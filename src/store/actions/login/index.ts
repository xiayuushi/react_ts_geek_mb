import request from '@utils/request'
import { setToken } from '@utils/storage'
import { RootThunkActionType } from '@/types/store'
import { LoginParamsType, ApiResponseType, TokenDataType } from '@/types/data'

export const login = (values: LoginParamsType): RootThunkActionType => {
  return async dispatch => {
    const res = await request.post<ApiResponseType<TokenDataType>>('/authorizations', values)
    console.log(res)

    dispatch({
      type: 'login/login',
      response: res.data.data
    })

    setToken(res.data.data)
  }
}

export const getCode = (mobile: string): RootThunkActionType => {
  return async () => {
    await request.get(`/sms/codes/${mobile}`)
  }
}

// 01、对于无需更新redux状态的，即无需处理对应的reducer中的状态的
// 01、也就无需在action模块中通过dispatch函数提交type，如当前模块的getCode发送验证码到手机
