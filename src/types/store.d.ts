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
}

// 01、当前文件是store相关的类型声明集合
// 02、包含RootReducer(RootState)、RootAction、RootThunkAction、及各个action模块的声明
// 03、RootReducerType(RootStateType)是集合了所有reducer模块state的声明的对象
// 04、RootActionType是集合了所有action模块声明的对象
// 05、RootThunkActionType是项目通用的函数返回值泛型参数（由redux-thunk中内置的ThunkAction泛型进行自定义封装而成）


// 06、不同频道对应渲染不同的文章列表，因此此处设置action时，需要将频道id也加进来，与服务器返回的字段进行结合
// 06、而不再是像其他的action那样，只需要指定一个必须的type属性，再额外配置一个自定义属性来全盘承接服务器返回的数据
// 06、此处自定义配置了自定义属性对象，在对象内再次配置自定义channelId、timestamp、articlesList来分别承接频道、服务器返回的时间戳、服务器返回的频道对应文章列表
// 之前：{type: 'xxx', payload: res.xxx.xxx }
// 此时：{type: 'xxx', payload: { channelId: 频道id， timestamp:res.xxx.xxx, articlesList:res.xxx.xxxx } }
// 后续，定义state时：channelArticles:{[channelId]:{timestap, articleList},[channelId]:{timestap, articleList},... }
// 以上payload是自定义的属性，channelId、timestamp、 articlesList都是自定义的字段，后续只需要将频道id与服务器返回的数据赋值给这些字段变量即可
// 之所以，这么做是为了后续通过不同的频道id来渲染不同的文章列表，否则后续的逻辑会很难处理
// 另外，这些必须在定义数据的类型的时候就应该考虑好（可以先调用一次接口，才能明确服务器返回的数据是什么类型）


// N1、RootReducer（RootState）通常用于作ThunkAtion的第二个泛型参数类型、或者用于useSelector作为回调形参的泛型
// N2、RootAction通常只用作ThunkAction的第四个泛型参数类型
// N3、RootThunkActionType通常会用于各个action模块，actionCreator函数的返回值类型
// N4、各个actionType通常只用于各自action模块对应的reducer模块第二形参action的类型
// N5、如果actionCreator调用接口请求却没有数据返回，也无需操作reducer中的状态
// N5、简言之，如果服务器返回的数据无需作为redux的状态，则无需定义action.type，也无需为aixos请求方法指定泛型
// N6、如何快速定义接口返回的数据类型
// N6、先发送一次请求，拿到数据后，在控制台复制返回的数据回到vscode中赋值给一个变量，将光标移入该变量，然后根据TS自动的类型推断复制vscode提示的类型即可
// N7、将增加、删除、清空历史记录的action.type的名称统一定义为updateHistoryRecordList，且将payload定义为string[]，是为了省去一个个单独为添加、删除、清空定义type的麻烦
// N7、因此关于文章搜索的历史记录的状态更改，只有一个action.type，就是updateHistoryRecordList，该type对应searchAction模块内的三个actionCreator分别定义具体的添加、删除、清空的逻辑
// N7、即此处定义一个action.type为'search/updateHistoryRecord'，它对应一个reducer，而添加、删除、清空历史记录的三个actionCreator在内部已经处理好了历史记录交给同一个reducer即可
// N7、如果不这么做，也可以定义多个action.type以及多个reducer去对应不同的具体的添加、删除、清空历史记录的actionCreator
