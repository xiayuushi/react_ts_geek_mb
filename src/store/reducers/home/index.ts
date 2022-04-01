import { HomeActionType } from "@/types/store"
import { ChannelType, ArticleType } from "@/types/data"

type HomeStateType = {
  userChannels: ChannelType[],
  allChannels: ChannelType[],
  activeChannelId: number,
  channelArticles: {
    [channelId: number]: {
      timestamp: number,
      articleList: ArticleType[]
    }
  }
}
const initState: HomeStateType = {
  userChannels: [],
  allChannels: [],
  activeChannelId: 0,
  channelArticles: {}
}

const home = (state = initState, action: HomeActionType): HomeStateType => {
  if (action.type === 'home/getUserChannels') {
    return {
      ...state,
      userChannels: action.response
    }
  }
  if (action.type === 'home/getAllChannels') {
    return {
      ...state,
      allChannels: action.response
    }
  }
  if (action.type === 'home/changeActiveChannelId') {
    return {
      ...state,
      activeChannelId: action.payload
    }
  }
  if (action.type === 'home/getChannelArticleList') {
    const { channelId, timestamp, articleList } = action.payload
    const oldArticleList = state.channelArticles[channelId]?.articleList ?? []
    return {
      ...state,
      channelArticles: {
        ...state.channelArticles,
        [channelId]: {
          articleList: [...oldArticleList, ...articleList],
          timestamp: +timestamp,
        }
      }
    }
  }
  return state
}

export default home

// 01、不同频道对应渲染不同的文章列表，因此设置action时，需要将频道id也加进来，与服务器返回的字段进行结合
// 01、而不再是像其他的action那样，只需要指定一个必须的type属性，再额外配置一个自定义属性来全盘承接服务器返回的数据
// 02、此处自定义配置了自定义属性对象，在对象内再次配置自定义channelId、timestamp、articlesList来分别承接频道、服务器返回的时间戳、服务器返回的频道对应文章列表
// 02、之前：{type: 'xxx', payload: res.xxx.xxx }
// 02、此时：{type: 'xxx', payload: { channelId: 频道id， timestamp:res.xxx.xxx, articlesList:res.xxx.xxxx } }
// 02、后续，定义state时：channelArticles:{[channelId]:{timestap, articleList},[channelId]:{timestap, articleList},... }
// N1、以上payload是自定义的属性，channelId、timestamp、 articlesList都是自定义的字段，后续只需要将频道id与服务器返回的数据赋值给这些字段变量即可
// N1、之所以，这么做是为了后续通过不同的频道id来渲染不同的文章列表，否则后续的逻辑会很难处理
// N1、另外，这些必须在定义数据的类型的时候就应该考虑好（可以先调用一次接口，才能明确服务器返回的数据是什么类型）

// 03、设置redux状态时，也要考虑清除，不同频道对应不同文章列表的状况
// 03、格式：channelArticles: { 频道1：频道1对应返回的文章数据, 频道2：频道2对应返回的文章数据}
// 03、例如：channelArticles: { 0: {timestamp: 1234, articles: [...]}, 1: {timestamp: 2345, articles:[...]},... }

// 04、action.type === 'home/getChannelArticleList'，其中channelArticles是存储了全部频道文章的对象
// 04、在切换频道时，只是渲染对应频道的文章，因此需要...state.channelArticles展开，然后渲染当前切换到的频道的文章列表
// 04、即，[channelId]: { articles, timestamp: +timestamp }，其中因为类型不一致的问题，因此需要使用'+'进行隐式转换（将string类型转成number类型）

// 05、因为无限加载做的是文章数据的拼接，因此需要修改action.type === 'home/getChannelArticleList'时的reducer,将请求回来的数据的逻辑由直接赋值改成新旧数据的展开与拼接

// 06、获取之前的 某个频道对应的文章列表 有两种方式
// 06、方式1： `const oldArticleList = state.channelArticles[channelId]?.articleList ?? []`
// 06、方式2：`const oldArticleList = state.channelArticles[channelId]?.articleList || []`
// 06、第一个单`?`可选链操作符是为了防止一开始频道数据为空时往后取articleList的值导致报错
// 06、第二个双`?`它只会判断undefined与null的情况，即如果articleList是undefined或者null时，才会往后取[]，避免undefined或者null使用展开运算符报错

// 运算符 ? 、?? 、!、||、&&的区别 
// 01、? 是可选链操作符，避免undefined往后取值报错
// 02、?? 只会对undefined或null进行短路，在短路运算中，前者如果是undefined或者null时，才会往后取值
// 03、! 是TS中的非空断言，表示数据不为空
// 04、|| 是短路运算中的逻辑或，在短路运算中，前者的结果为false时，会往后取值（作为判断条件时，任意一个条件成立即可）
// 05、&& 是短路运算中的逻辑与，在短路运算中，前者的结果为true时，会往后取值（作为判断条件时，两个条件必须同时成立）