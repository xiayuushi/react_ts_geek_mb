import { UserType, UserProfileType } from '@/types/data.d'
import { ProfileActionType } from '@/types/store.d'

type ProfileStateType = {
  user: UserType,
  userProfile: UserProfileType
}

const initState = {
  user: {},
  userProfile: {}
} as ProfileStateType

const profile = (state = initState, action: ProfileActionType): ProfileStateType => {

  if (action.type === 'profile/getUser') {
    return {
      ...state,
      user: action.response
    }
  }
  if (action.type === 'profile/getUserProfile') {
    return {
      ...state,
      userProfile: action.response
    }
  }
  return state
}

export default profile