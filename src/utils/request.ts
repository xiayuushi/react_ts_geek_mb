import axios, { AxiosError } from 'axios'
import { Toast } from 'antd-mobile'
import { isLogin, getToken } from './storage'
import store from '@/store'
import history from './history'
import { ApiResponseType } from '@/types/data'
import { saveToken, logout } from '@/store/actions/login'

const instance = axios.create({
  baseURL: process.env.REACT_APP_URL
})

instance.interceptors.request.use(config => {
  const { token } = getToken()
  if (isLogin()) {
    config.headers!.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  return response
}, async (error: AxiosError<{ message: string }>) => {
  // 未联网不会有axios响应数据
  if (!error.response) {
    Toast.show('网络错误，请联网重试！')
    return Promise.reject(error)
  }

  // token失效（`error.response.status === 401`这个条件判断中不要使用可选链操作符，否则永远不会进入该判断逻辑内）
  // 无refreshToken，直接强制重新登录，以便获取token
  // 有refreshToken，则做无感刷新，即，使用refreshToken调用接口更新token，并将更新后的新token与之前的refreshToken同步存储到redux与本地缓存，然后再使用拦截器实例对象发送之前出错的那次请求（做无感刷新）
  if (error.response.status === 401) {
    const { refresh_token: refreshToken } = getToken()
    if (!refreshToken) {
      history.replace({
        pathname: '/login',
        state: { from: history.location.pathname }
      })
      Toast.show('登录信息过期，请重新登录！')
      return Promise.reject(error)
    }
    try {
      // 此处使用refreshToken调用接口刷新token时，不要使用axios响应拦截器实例对象instance发送请求，否则会递归导致死循环
      const res = await axios.request<ApiResponseType<{ token: string }>>({
        baseURL: process.env.REACT_APP_URL,
        url: '/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
      // 因为使用refreshToken更新token的接口只返回更新后的token，并没有返回refreshToken
      // 但是saveToken这个actionCreator在定义类型时被定义为含有token与refresh_token字段的类型
      // 因此saveToken只接收一个对象，对象必须含有token与refresh_token这两个字段，因此需要将之前的（本次请求使用的）refreshToken也放进去才能调用该actionCreator
      store.dispatch(saveToken({
        token: res.data.data.token,
        refresh_token: refreshToken
      }))
      // 使用refreshToken调用接口更新token成功之后，后续再使用axios拦截器实例对象发送之前因token失效导致出错的那次请求
      // 这里是无感刷新的关键，是使用axios拦截器实例发的请求，且必须将重新使用拦截器对象实例发送的请求return出去
      // 此处error.config是一个对象，该对象有之前（token失效时导致）发送请求失败时所需的所有信息，因此直接传入整个error.config对象再次使用拦截器实例对象重新发送之前因token失效导致出错的那次请求
      return instance.request(error.config)
    } catch (err) {
      // 当token失效且refreshToken也失效时，则必须重新登录了
      const error = err as AxiosError<{ message: string }>
      const errorMessage = error.response?.data ? error.response?.data.message : '更新用户登录信息失败，请重新登录！'
      Toast.show({ content: errorMessage, icon: 'fail' })
      store.dispatch(logout())
      history.replace('/login', { from: history.location.pathname })
      return Promise.reject(err)
    }
  }
  Toast.show(error.response?.data.message)
  return Promise.reject(error)
})

export default instance

// 01、在组件中使用的try-catch中catch形参e不能显示的指定任何类型（虽然它默认是any或者unknown类型，但也不允许显式的指定）
// 01、但是可以为组件中的try-catch中catch的形参e进行类型断言，将其断言为AxiosError类型，以便获得axios响应出错时的便捷属性提示
// 02、在axios响应拦截器中的回调形参中的error，一定是AxiosError类型，因此可以直接为响应拦截器出错回调中的形参error指定该类型
// 02、因此在axios响应拦截器中直接指定AxiosError或者断言AxiosError类型都是可行的（直接指定更方便）
// 02、无论以上何种方式，只要为AxiosError传入泛型参数，则可以有更加具体的链式属性提示

// axios的AxiosError类型
// 01、使用try-catch去捕获错误时，因为捕获的错误的情况很多，并非全是axios报错，catch形参e内置是any或者unknown类型且不允许显式的指定类型，因此使用形参e时不会有属性提示
// 02、在try-catch中，也不允许直接为catch形参显示的指定类型（显式的指定为any或者unknown也不被允许）
// 02、即 `try{...}catch(e:xxx){...}` 这种为e直接指定类型的方式都是不被允许的
// 03、做登录请求失败的逻辑时，为了有更加明确的属性提示，可以使用类型断言将catch形参e断言为axios的AxiosError类型，以此来获取axios报错信息
// 03、例如：`try{...}catch(e){ const xxx = e as AxiosError }` 后续就可以通过变量xxx来获取axios报错信息（此时使用xxx时有链式属性提示）
// 04、为了有更加明确的axios错误类型提示，可以给AxiosError传入泛型参数

// 在组件try-catch逻辑中，将catch形参e断言为AxiosError类型，并为该类型传入泛型参数的两种方式
// 01、方式1：断言e的类型为AxiosError之前，`console.dir(res)`查看报错信息
// 02、方式2：断言e的类型为AxiosError之后，变量接收的返回的报错信息数据进行定义，通常是一个返回错误信息的字段，只需要定义该字段及对应的字段类型即可
// 02、例如：`try{...}catch(e){ const xxx = e as AxiosError<{ message: string }> }` 后续通过变量xxx可以一路链式点选属性到message拿到axios报错信息

// 在axios响应拦截器中，出错逻辑形参error的类型一定是AxiosError类型，因此以上定义泛型参数的两种方式都适用
// 可以直接显式的为响应拦截器出错的回调形参error指定AxiosError类型，也可以使用类型断言

// N01、try-catch捕获的错误情况很多，不能显式的指定类型，只能进行类型断言，断言错误为AxiosError类型（断言为AxiosError类型后，无法处理其他非axios请求的类型错误，要慎用）
// N02、axios响应拦截器中，既可以使用类型断言，也可以显式的指定AxiosError类型，是比较推荐的做法，另外也不影响组件中再次使用try-catch捕获其他非axios请求的错误
// N03、推荐使用axios响应拦截器中处理登录失败的请求，这样子可以避免重复在不同组件中写try-catch处理登录失败
// N04、对于某些需要token才能访问的页面请求，请求前需要判断是否登录，已登录则在请求头中自动携带token发送请求
// N05、请求拦截器config配置中一定会有header对象，对于此处报错直接使用TS的非空断言规避TS类型报错
// N06、此处的history对象并非是BrowserRouter提供的，因为useHistory()无法在非组件中使用
// N06、此处的history对象是自己通过安装react-router-dom时的依赖插件history进行封装而成的（配合不带history功能的Router组件，可以实现BrowserRouter的效果）
// N06、history.replace('/xxx',{key:value})等同于 history.replace({pathname:'/xxx', state:{key:value}})
// N07、使用登录接口返回的refreshToken做无感刷新时，`error.response.status === 401`这个判断条件中不要使用可选链操作符，否则不会进入该判断语句
// N08、此处响应拦截器中处理token失效，并使用refreshToken进行无感刷新时，之所以使用新的axios发送请求是为了避免递归出现死循环
// N08、此处axios直接调用的request()是axios内置的，并非自定义封装
// N08、因为如果使用当前axios实例instance发送请求，则会再次进入到拦截器中从而递归导致报错
// N08、axios.request({...})等同于axios.create({...})，但区别是axios.request<泛型参数>({...})可以使用泛型
// N09、使用refreshToken调用接口更新token成功之后，使用axios拦截器实例对象再次发送出错之前的那些请求，即 `return instance.request(error.config)`是无感刷新的关键
// N09、无感刷新完成后，最明显的特征是修改token让其模拟报错401，重新刷新后，又可以使用refrenshToken获取新的token数据而不需要被强制到登录页进行登录
// N10、axios拦截器（无论是请求拦截器或响应拦截器）只要捕获到失败了，都必须return Promise.reject(error)
