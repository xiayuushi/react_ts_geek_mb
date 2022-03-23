import { UserType } from '@/types/data.d'
import { ProfileActionType } from '@/types/store.d'

type ProfileStateType = {
  user: UserType
}

const initState = {
  user: {} as UserType
}

const profile = (state = initState, action: ProfileActionType): ProfileStateType => {

  if (action.type === 'profile/getUser') {
    return {
      ...state,
      user: action.response
    }
  }
  return state
}

export default profile