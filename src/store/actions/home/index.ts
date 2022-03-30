import request from "@utils/request"
import { RootThunkActionType, HomeActionType } from '@/types/store'
import { ApiResponseType, ChannelType } from '@/types/data'
import { isLogin, localHasUnloginChannelsList, getLocalUnloginChannelsList, setLocalUnloginChannelsList } from '@utils/storage';

export const getUserChannels = (): RootThunkActionType => {
  return async dispatch => {
    // 情况1：用户已登录，直接走接口获取用户频道列表
    if (isLogin()) {
      const res = await request.get<ApiResponseType<{ channels: ChannelType[] }>>('/user/channels')
      dispatch({
        type: 'home/getUserChannels',
        response: res.data.data.channels
      })
      return
    }
    if (localHasUnloginChannelsList()) {
      // 情况2：A 用户未登录 本地有存储频道列表数据 直接拿本地存储
      getLocalUnloginChannelsList()
      dispatch({
        type: 'home/getUserChannels',
        response: getLocalUnloginChannelsList()
      })
      return
    }
    // 情况2：B 用户未登录 且 本地无存储频道列表数据 先走接口获取默认频道列表再储存到本地 
    const res = await request.get<ApiResponseType<{ channels: ChannelType[] }>>('/user/channels')
    dispatch({
      type: 'home/getUserChannels',
      response: res.data.data.channels
    })
    setLocalUnloginChannelsList(res.data.data.channels)
  }
}

export const getAllChannels = (): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<{ channels: ChannelType[] }>>('/channels')
    dispatch({
      type: 'home/getAllChannels',
      response: res.data.data.channels
    })
  }
}

// 01、用户频道列表渲染的功能优化（并非直接走接口获取频道列表，而是应该具体分析，在action/home模块做逻辑判断）
// 01、Q1 如果用户已登录（用户），则应该发送请求获取用户的频道数据
// 01、Q2 如果用户未登录（游客），则应该优先操作本地数据
// 01、Q2 A 本地有，则操作本地数据，不走接口
// 01、Q2 B 本地无，则发送请求获取默认的频道数据，然后再存储到本地，后续则操作本地数据
// N1、无论何种情况，getUserChannels都要提供action对象(含必须的type与自定义的response属性)以便在reducer中能够找到对应的type进行处理
