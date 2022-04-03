import { TokenDataType, ChannelType } from '@/types/data'

export const TOKEN_KEY = 'REACT_TS_GEEK_MOBILE'
export const CHANNELS_KEY = 'REACT_TS_GEEK_MOBILE_UNLOGINCHANNELS'
export const SEARCHHISTORYRECORDLIST_KEY = 'REACT_TS_GEEK_MOBILE_SEARCHHISTORYRECORDLIST'

export const getToken = (): TokenDataType => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}')
}

export const setToken = (token: TokenDataType): void => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const isLogin = (): boolean => !!getToken().token


export const setLocalUnloginChannelsList = (unloginChannelsList: ChannelType[]): void => {
  localStorage.setItem(CHANNELS_KEY, JSON.stringify(unloginChannelsList))
}

export const getLocalUnloginChannelsList = (): ChannelType[] => {
  return JSON.parse(localStorage.getItem(CHANNELS_KEY) || '[]')
}

export const removeLocalUnloginChannelsList = (): void => {
  localStorage.removeItem(CHANNELS_KEY)
}

export const localHasUnloginChannelsList = () => {
  return !!getLocalUnloginChannelsList().length
}


export const setSearchHistoryRecordList = (list: string[]): void => {
  localStorage.setItem(SEARCHHISTORYRECORDLIST_KEY, JSON.stringify(list))
}

export const getSearchHistoryRecordList = (): string[] => {
  return JSON.parse(localStorage.getItem(SEARCHHISTORYRECORDLIST_KEY) || '[]')
}


// 01、localStorage.getItem(key)，其中key必须是string类型
// 02、localStorage.setItem(key,val)，其中key与val都必须是string类型
// 02、其中val的实参token是一个对象，因此必须使用JSON.string()进行数据转换才能进行localStorage本地存储
// 03、必须给getToken指定返回值类型为TokenDataType，否则isLogin中使用getToken()时没有链式属性提示
// 04、JSON.parse()的值只能是string类型，而localStorage.getItem()的值却有两种情况，因此必须分别对两种情况进行逻辑处理
// 04、localStorage.getItem()有值时是字符串，无值时是空对象，空对象无法赋值给字符串类型，因此必须将空对象转成字符串'{}'
// 04、考虑到JSON.parse('{}')进行转换后的结果是{}，而{}被转成布尔值是true，因此isLogin中必须对getToken()进行深层取到内部属性的值才能正确作为是否登录的判断依据

// N1、TOKEN_KEY用于操作用户的本地token，CHANNELS_KEY用于操作未登录用户的频道列表
// N2、对象不能直接使用length属性作为判断有无的标准，因此需要拿对象中的属性是否存在来作为判断标准
// N3、数组可以直接使用length属性作为判断有无的标准，因此可以使用length是否存在或者length是否大于0作为判断有无的标准
