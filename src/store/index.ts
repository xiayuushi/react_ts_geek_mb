import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store

// React-TS项目中，redux的使用分为3步骤
// 01、定义type（含常规的数据类型如data.d.ts 与 store专属的类型如store.d.ts）
// 02、定义action（含actionCreator，可能返回对象或者函数：对象时用独立的xxxActionType，函数时用RootThunkActionType）
// 03、定义reducer（含state及初始值、actionCreator对应的reducer处理函数）
