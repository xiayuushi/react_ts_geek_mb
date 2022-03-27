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

// N1、自定义hook必须以useXxx的驼峰形式命名函数
// N2、函数泛型约束，只能在以function声明的函数中使用，不能在箭头函数中使用
// N2、因为泛型函数约束是定义在函数名称之后，约束的是函数参数的类型
