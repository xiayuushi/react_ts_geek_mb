import { LoginParamsType, ApiResponseType, TokenDataType } from '@/types/data'
import request from '@utils/request'
import { RootThunkActionType } from '@/types/store'

export const login = (values: LoginParamsType): RootThunkActionType => {
  return async dispatch => {
    const res = await request.post<ApiResponseType<TokenDataType>>('/authorizations', values)
    console.log(res)

    dispatch({
      type: 'login/login',
      response: res.data.data
    })
  }
}