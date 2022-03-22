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