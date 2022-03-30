import { useEffect } from 'react'
import { RootStateType } from '@/types/store.d'
import { useDispatch, useSelector } from "react-redux"

function useInitState<T extends keyof RootStateType>(actionCreator: () => void, reducerName: T) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actionCreator())
  }, [])
  const initState = useSelector((state: RootStateType) => state[reducerName])
  return initState
}

export default useInitState

// 01、当前封装的是自定义hook，用于获取redux中某个reducer模块中的管理状态state
// 02、使用该hook时，必须传入actionCreator与reducer模块名称
// 03、此处hook传入的第一个参数是从某个action模块中导出的actionCreator，不要加括号调用（传入函数名即可，内部会调用）
// 04、此处hook传入的第二个参数是从某个reducer模块的名称（reducer模块名是字符串）
// 05、当前封装的useInitState的返回类型是基于redux-thunk的ThunkAction封装而成的RootThunkAction
// 05、A 如果需要走接口发送请求的actionCreator，则使用当前自定义封装的useInitState会更加方便，因为它们类型一致（此处指useInitState与`actionCreator返回函数`时的类型一致）
// 05、B 如果无需走接口发请求的actionCreator，则建议单独使用react-redux提供的内置hook，即useDisoatch与useSelector（此处useInitState与`actionCreator返回对象`时的类型不一致，会报错）

// N1、自定义hook必须以useXxx的驼峰形式命名函数
// N2、函数泛型约束，只能在以function声明的函数中使用，不能在箭头函数中使用
// N2、因为泛型函数约束是定义在函数名称之后，约束的是函数参数的类型
// N3、在action模块定义actionCreator时，如果actionCreator返回是一个对象，则不要使用当前自定义封装的useInitState，因为actionCreator的返回类型与对象不符合会报错
// N3、例如：const actionCreator=():XxxActionType=>{ return {type:'xxx', key: val} }
// N4、在action模块定义actionCreator时，如果actionCreator返回是函数形式，则使用当前自定义封装的useInitState会比较方便
// N4、例如：const actionCreator=():RootThunkActionType=>{ return async (dispatch)=>{ await axios.get('/xxx'); dispatch({type:'xxx', key:val})  } }
