import { UserType, ApiResponseType, UserProfileType } from '@/types/data'
import request from "@utils/request"
import { RootThunkActionType } from '@/types/store'

export const getUser = (): RootThunkActionType => {
  return async dispatch => {
    const res = await request.request<ApiResponseType<UserType>>({
      url: '/user',
      method: 'get'
    })
    dispatch({
      type: 'profile/getUser',
      response: res.data.data
    })
  }
}

export const getUserProfile = (): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<UserProfileType>>('/user/profile')
    dispatch({
      type: 'profile/getUserProfile',
      response: res.data.data
    })
  }
}

// 01、对于无需更新redux状态的，即无需处理对应的reducer中的状态的
// 01、也就无需在action模块中通过dispatch函数提交type，如当前模块的getCode发送验证码到手机
// 02、此处request是axios实例对象，该对象的方法可以添加泛型参数，但是它自身（这个对象）不能直接添加泛型参数
// 02、axios实例对象的get、put、patch等方法都可以添加泛型，但是axios实例对象不能添加泛型
// 02、例如：const request = axios.create(); request.post<>('/xxx', xxx)是可以的，但request({url,method,...})这种方式是不可以添加泛型的
// 03、但是axios实例对象有一个request方法，可以替代request({url,method,...})，因此request.request<>({url,method,...})这种方式是可以添加泛型的

// N1、axios实例对象的get、post、put、patch、delete、header等方法可以添加泛型，如 axios.create().get<>('/xxx')是可以的
// N2、axios实例对象自身不能添加泛型，如 axios.create({url,method,....})这种方式不能添加泛型
// N3、axios实例对象有一个request方法可以添加泛型，它也可以传入对象，如 axios.create().request<>({url,method,...})
// N3、详情参考当前项目 store/action/profile模块 
