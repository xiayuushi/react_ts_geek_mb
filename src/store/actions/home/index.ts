import { ApiResponseType, ChannelType } from '@/types/data';
import { RootThunkActionType } from '@/types/store';
import request from "@utils/request"

export const getUserChannels = (): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<{ channels: ChannelType[] }>>('/user/channels')
    console.log(res.data.data.channels)
    dispatch({
      type: 'home/getUserChannels',
      response: res.data.data.channels
    })
  }
}