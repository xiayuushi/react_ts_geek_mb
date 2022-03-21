import store from "@/store"
import { ThunkAction } from 'redux-thunk'

export type RootStateType = ReturnType<typeof store.getState>
export type RootActionType = LoginActionType
export type RootThunkActionType = ThunkAction<void, RootStateType, any, RootActionType>

export type LoginStateType = {
  token: string,
  refresh_token: string
}

export type LoginActionType = {
  type: 'login/login',
  response: {
    token: string,
    refresh_token: string
  }
}

// 01、当前文件是store相关的类型声明集合
// 02、包含RootReducer(RootState)、RootAction、RootThunkAction、及各个action模块的声明
// 03、RootReducerType(RootStateType)是集合了所有reducer模块state的声明的对象
// 04、RootActionType是集合了所有action模块声明的对象
// 05、RootThunkActionType是项目通用的函数返回值泛型参数（由redux-thunk中内置的ThunkAction泛型进行自定义封装而成）