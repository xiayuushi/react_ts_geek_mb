import {
  TokenDataType,
  TokenType,
  ChannelType,
  ArticleResType,
  ArticleType,
  SuggestionType,
  SearchResultAllResType,
  ArticleDetailType,
  ArticleCommentResType,
  newCommentType
} from '@/types/data'
import store from "@/store"
import { ThunkAction } from 'redux-thunk'
import { TokenDataType, UserType, UserProfileType, AddChannelResType } from "./data"

export type RootStateType = ReturnType<typeof store.getState>
export type RootActionType =
  | LoginActionType
  | ProfileActionType
  | HomeActionType
  | SearchActionType
  | ArticleActionType
export type RootThunkActionType = ThunkAction<void, RootStateType, any, RootActionType>

export type LoginActionType = {
  type: 'login/login',
  response: TokenDataType
} | {
  type: 'login/getCode'
} | {
  type: 'login/logout'
} | {
  type: 'login/saveToken',
  response: TokenDataType
}

export type ProfileActionType = {
  type: 'profile/getUser',
  response: UserType
} | {
  type: 'profile/getUserProfile',
  response: UserProfileType
}

export type HomeActionType = {
  type: 'home/getUserChannels',
  response: ChannelType[]
} | {
  type: 'home/getAllChannels',
  response: ChannelType[]
} | {
  type: 'home/changeActiveChannelId',
  payload: number
} | {
  type: 'home/addChannel',
  response: AddChannelResType[]
} | {
  type: 'home/getChannelArticleList',
  payload: {
    channelId: number,
    timestamp: string,
    articleList: ArticleType[]
  }
} | {
  type: 'home/refreshChannelArticleList',
  payload: {
    channelId: number,
    timestamp: string,
    articleList: ArticleType[]
  }
}

export type SearchActionType = {
  type: 'search/getSuggestion',
  response: SuggestionType
} | {
  type: 'search/clearSuggestion'
} | {
  type: 'search/updateHistoryRecord',
  payload: string[]
} | {
  type: 'search/getSearchResult',
  response: SearchResultAllResType
} | {
  type: 'search/clearSearchResult'
}

export type ArticleActionType = {
  type: 'article/getArticleDetail',
  response: ArticleDetailType
} | {
  type: 'article/getArticleComment',
  response: ArticleCommentResType
} | {
  type: 'article/clearArticleComment'
} | {
  type: 'article/commentArticle',
  newComment: newCommentType
} | {
  type: 'article/updateReplyCount',
  commentId: string
}

// 01??????????????????store???????????????????????????
// 02?????????RootReducer(RootState)???RootAction???RootThunkAction????????????action???????????????
// 03???RootReducerType(RootStateType)??????????????????reducer??????state??????????????????
// 04???RootActionType??????????????????action?????????????????????
// 05???RootThunkActionType???????????????????????????????????????????????????redux-thunk????????????ThunkAction????????????????????????????????????


// 06?????????????????????????????????????????????????????????????????????action?????????????????????id??????????????????????????????????????????????????????
// 06???????????????????????????action???????????????????????????????????????type????????????????????????????????????????????????????????????????????????????????????
// 06????????????????????????????????????????????????????????????????????????????????????channelId???timestamp???articlesList????????????????????????????????????????????????????????????????????????????????????????????????
// ?????????{type: 'xxx', payload: res.xxx.xxx }
// ?????????{type: 'xxx', payload: { channelId: ??????id??? timestamp:res.xxx.xxx, articlesList:res.xxx.xxxx } }
// ???????????????state??????channelArticles:{[channelId]:{timestap, articleList},[channelId]:{timestap, articleList},... }
// ??????payload????????????????????????channelId???timestamp??? articlesList???????????????????????????????????????????????????id????????????????????????????????????????????????????????????
// ?????????????????????????????????????????????????????????id?????????????????????????????????????????????????????????????????????
// ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????


// N1???RootReducer???RootState??????????????????ThunkAtion?????????????????????????????????????????????useSelector???????????????????????????
// N2???RootAction???????????????ThunkAction??????????????????????????????
// N3???RootThunkActionType?????????????????????action?????????actionCreator????????????????????????
// N4?????????actionType?????????????????????action???????????????reducer??????????????????action?????????
// N5?????????actionCreator?????????????????????????????????????????????????????????reducer????????????
// N5?????????????????????????????????????????????????????????redux???????????????????????????action.type???????????????aixos????????????????????????
// N6????????????????????????????????????????????????
// N6????????????????????????????????????????????????????????????????????????????????????vscode??????????????????????????????????????????????????????????????????TS???????????????????????????vscode?????????????????????
// N7?????????????????????????????????????????????action.type????????????????????????updateHistoryRecordList?????????payload?????????string[]??????????????????????????????????????????????????????????????????type?????????
// N7????????????????????????????????????????????????????????????????????????action.type?????????updateHistoryRecordList??????type??????searchAction??????????????????actionCreator??????????????????????????????????????????????????????
// N7????????????????????????action.type???'search/updateHistoryRecord'??????????????????reducer???????????????????????????????????????????????????actionCreator??????????????????????????????????????????????????????reducer??????
// N7?????????????????????????????????????????????action.type????????????reducer??????????????????????????????????????????????????????????????????actionCreator
