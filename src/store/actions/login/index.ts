import { LoginParamsType } from '@/types/data'
import request from '@utils/request'
import { RootThunkActionType } from '@/types/store'

export const login = (values: LoginParamsType): RootThunkActionType => {
  return async dispatch => {
    const res = await request.post('/authorizations', values)
    dispatch({
      type: 'login/login',
      response: res.data
    })
  }
}