import { HomeActionType } from "@/types/store"
import { ChannelType } from "@/types/data"

type HomeStateType = {
  userChannels: ChannelType[],
  allChannels: ChannelType[],
  activeChannelId: number
}
const initState: HomeStateType = {
  userChannels: [],
  allChannels: [],
  activeChannelId: 0
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
  if (action.type === 'home/changeActiveChannelId') {
    return {
      ...state,
      activeChannelId: action.payload
    }
  }
  return state
}

export default home
