import { HomeActionType } from "@/types/store"
import { ChannelType } from "@/types/data"

type HomeStateType = {
  userChannels: ChannelType[],
  allChannels: ChannelType[]
}
const initState: HomeStateType = {
  userChannels: [],
  allChannels: []
}

const home = (state = initState, action: HomeActionType): HomeStateType => {
  if (action.type === 'home/getUserChannels') {
    return {
      ...state,
      userChannels: action.response
    }
  }
  if (action.type === 'home/getAllChannels') {
    return {
      ...state,
      allChannels: action.response
    }
  }
  return state
}

export default home
