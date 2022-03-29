import { HomeActionType } from "@/types/store"
import { ChannelType } from "@/types/data"

type HomeStateType = {
  userChannels: ChannelType[]
}
const initState: HomeStateType = {
  userChannels: {} as ChannelType[]
}

const home = (state = initState, action: HomeActionType): HomeStateType => {
  if (action.type === 'home/getUserChannels') {
    return {
      ...state,
      userChannels: action.response
    }
  }
  return state
}

export default home
