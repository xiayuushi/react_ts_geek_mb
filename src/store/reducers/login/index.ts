import { getToken } from '@/utils/storage'
import { TokenDataType } from '@/types/data'
import { LoginActionType } from '@/types/store'

const initState: TokenDataType = getToken()

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
// N2、因为后续对token相关数据进行了本地持久化处理，且token相关数据的类型与当前reducer模块的initState类型一致都是TokenDataType，
// N2、因此可以直接调用获取token相关数据的getToken()来作为initState的初始值
