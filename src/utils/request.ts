import axios, { AxiosError } from 'axios'
import { Toast } from 'antd-mobile'
import { isLogin, getToken } from './storage'
const instance = axios.create({
  baseURL: process.env.REACT_APP_URL
})

instance.interceptors.request.use(config => {
  const { token } = getToken()
  if (isLogin) {
    config.headers!.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  return response
}, (error: AxiosError<{ message: string }>) => {
  !(error.response)
    ? Toast.show('网络错误，请联网重试！')
    : Toast.show(error.response?.data.message)
  return Promise.reject(error)
})

export default instance

// 01、在组件中使用的try-catch中catch形参e不能显示的指定任何类型（虽然它默认是any或者unknown类型，但也不允许显式的指定）
// 01、但是可以为组件中的try-catch中catch的形参e进行类型断言，将其断言为AxiosError类型，以便获得axios响应出错时的便捷属性提示
// 02、在axios响应拦截器中的回调形参中的error，一定是AxiosError类型，因此可以直接为响应拦截器出错回调中的形参error指定该类型
// 02、因此在axios响应拦截器中直接指定AxiosError或者断言AxiosError类型都是可行的（直接指定更方便）
// N1、无论以上何种方式，只要为AxiosError传入泛型参数，则可以有更加具体的链式属性提示

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

// N1、try-catch捕获的错误情况很多，不能显式的指定类型，只能进行类型断言，断言错误为AxiosError类型（断言为AxiosError类型后，无法处理其他非axios请求的类型错误，要慎用）
// N2、axios响应拦截器中，既可以使用类型断言，也可以显式的指定AxiosError类型，是比较推荐的做法，另外也不影响组件中再次使用try-catch捕获其他非axios请求的错误
// N3、推荐使用axios响应拦截器中处理登录失败的请求，这样子可以避免重复在不同组件中写try-catch处理登录失败

// N4、对于某些需要token才能访问的页面请求，请求前需要判断是否登录，已登录则在请求头中自动携带token发送请求
// N5、请求拦截器config配置中一定会有header对象，对于此处报错直接使用TS的非空断言规避TS类型报错