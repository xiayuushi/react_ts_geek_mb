import { LoginActionType } from '@/types/store'
import { TokenDataType } from '@/types/data'

const initState: TokenDataType = {} as TokenDataType

const login = (state = initState, action: LoginActionType): TokenDataType => {
  if (action.type === 'login/login') {
    return action.response
  }
  return state
}

export default login

// N1、此处initState的写法有多种（如果写死初始值字段，则后期如果有新数据，则会比较被动）
// 01、方式1 给定初始值字段 const initState:TokenDataType={token:'', refresh_token:''}
// 02、方式2 给定空字段且使用类型断言避免报错字段缺失 const initState = { } as TokenDataType 
