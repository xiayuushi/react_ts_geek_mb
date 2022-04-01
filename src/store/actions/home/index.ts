import request from "@utils/request"
import { RootThunkActionType, HomeActionType } from '@/types/store'
import { ApiResponseType, ChannelType, ArticleResType } from '@/types/data'
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

export const changeActiveChannelId = (channelId: number): HomeActionType => {
  return {
    type: 'home/changeActiveChannelId',
    payload: channelId
  }
}

export const delChannel = (channelId: number): RootThunkActionType => {
  return async dispatch => {
    if (isLogin()) {
      await request.delete('/user/channels', {
        data: {
          channels: [channelId]
        }
      })
    } else {
      const localRestChannelsList = getLocalUnloginChannelsList().filter(v => v.id !== channelId)
      setLocalUnloginChannelsList(localRestChannelsList)
    }
    dispatch(getUserChannels())
  }
}

export const addChannel = (channel: ChannelType): RootThunkActionType => {
  return async (dispatch, getState) => {
    if (isLogin()) {
      await request.patch('/user/channels', { channels: [channel] })
    } else {
      const { home: { userChannels } } = getState()
      setLocalUnloginChannelsList([...userChannels, channel])
    }
    dispatch(getUserChannels())
  }
}

export const getArticleList = (channel_id: number, timestamp: number): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<ArticleResType>>('/articles', { params: { channel_id, timestamp } })
    dispatch({
      type: 'home/getChannelArticleList',
      payload: {
        channelId: channel_id,
        timestamp: res.data.data.pre_timestamp,
        articleList: res.data.data.results
      }
    })
  }
}

export const refreshArticleList = (channel_id: number, timestamp: number): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<ArticleResType>>('/articles', { params: { channel_id, timestamp } })
    dispatch({
      type: 'home/refreshChannelArticleList',
      payload: {
        channelId: channel_id,
        timestamp: res.data.data.pre_timestamp,
        articleList: res.data.data.results
      }
    })
  }
}

// 01、用户频道列表渲染的功能优化（并非直接走接口获取频道列表，而是应该具体分析，在action/home模块做逻辑判断）
// 01、Q1 如果用户已登录（用户），则应该发送请求获取用户的频道数据
// 01、Q2 如果用户未登录（游客），则应该优先操作本地数据
// 01、Q2 A 本地有，则操作本地数据，不走接口
// 01、Q2 B 本地无，则发送请求获取默认的频道数据，然后再存储到本地，后续则操作本地数据
// N1、无论何种情况，getUserChannels都要提供action对象(含必须的type与自定义的response属性)以便在reducer中能够找到对应的type进行处理

// 02、删除、新增频道的操作
// 02、Q1 用户已登录，直接走删除（或新增）接口，删除（或新增）后再更新最新的频道列表数据
// 02、Q2 用户未登录，不能调用删除（或新增）接口，仅进行本地缓存删除（或新增），删除（或新增）后再更新最新的频道列表数据

// 03、不同频道对应渲染不同的文章列表，因此此处设置action时，需要将频道id也加进来，与服务器返回的字段进行结合
// 03、而不再是像其他的action那样，只需要指定一个必须的type属性，再额外配置一个自定义属性来全盘承接服务器返回的数据
// 03、此处自定义配置了自定义属性对象，在对象内再次配置自定义channelId、timestamp、articlesList来分别承接频道、服务器返回的时间戳、服务器返回的频道对应文章列表
// 之前：{type: 'xxx', payload: res.xxx.xxx }
// 此时：{type: 'xxx', payload: { channelId: 频道id， timestamp:res.xxx.xxx, articlesList:res.xxx.xxxx } }
// 后续，定义state时：channelArticles:{[channelId]:{timestap, articleList},[channelId]:{timestap, articleList},... }
// 以上payload是自定义的属性，channelId、timestamp、 articlesList都是自定义的字段，后续只需要将频道id与服务器返回的数据赋值给这些字段变量即可
// 之所以，这么做是为了后续通过不同的频道id来渲染不同的文章列表，否则后续的逻辑会很难处理
// 另外，这些必须在定义数据的类型的时候就应该考虑好（可以先调用一次接口，才能明确服务器返回的数据是什么类型）

// N1、如果actionCreator调用接口请求却没有数据返回，也无需操作reducer中的状态
// N1、简言之，如果服务器返回的数据无需作为redux的状态，则无需定义action.type，也无需为aixos请求方法指定泛型
// N2、actionCreator返回函数时，函数第二形参可以获取到根reducer的状态，即RootState
