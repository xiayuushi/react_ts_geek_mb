import { TokenDataType, TokenType, ChannelType } from '@/types/data';
import store from "@/store"
import { ThunkAction } from 'redux-thunk'
import { TokenDataType, UserType, UserProfileType } from "./data"

export type RootStateType = ReturnType<typeof store.getState>
export type RootActionType = LoginActionType | ProfileActionType | HomeActionType
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
}

// 01、当前文件是store相关的类型声明集合
// 02、包含RootReducer(RootState)、RootAction、RootThunkAction、及各个action模块的声明
// 03、RootReducerType(RootStateType)是集合了所有reducer模块state的声明的对象
// 04、RootActionType是集合了所有action模块声明的对象
// 05、RootThunkActionType是项目通用的函数返回值泛型参数（由redux-thunk中内置的ThunkAction泛型进行自定义封装而成）

// N1、RootReducer（RootState）通常用于作ThunkAtion的第二个泛型参数类型、或者用于useSelector作为回调形参的泛型
// N2、RootAction通常只用作ThunkAction的第四个泛型参数类型
// N3、RootThunkActionType通常会用于各个action模块，actionCreator函数的返回值类型
// N4、各个actionType通常只用于各自action模块对应的reducer模块第二形参action的类型
