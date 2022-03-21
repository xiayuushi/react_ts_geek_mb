import { LoginStateType, RootActionType } from '@/types/store'

const initState: LoginStateType = {
  token: '',
  refresh_token: ''
}

const login = (state = initState, action: RootActionType) => {
  if (action.type === 'login/login') {
    return action.response
  }
  return state
}

export default login