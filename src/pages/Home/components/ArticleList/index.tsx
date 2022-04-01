import React, { useEffect } from 'react'
import ArticleItem from '../ArticleItem'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getArticleList, refreshArticleList } from '@store/actions/home'
import { RootStateType } from '@/types/store'
import { InfiniteScroll, PullToRefresh } from 'antd-mobile'

type PropsType = {
  channelId: number
}

const ArticleList = ({ channelId }: PropsType) => {
  const dispatch = useDispatch()
  const { channelArticles } = useSelector((state: RootStateType) => state.home)

  const hasMore = channelArticles[channelId]?.timestamp !== null
  const loadMore = async () => {
    await dispatch(getArticleList(channelId, channelArticles[channelId]?.timestamp || Date.now()))
  }

  const onRefresh = async () => {
    await dispatch(refreshArticleList(channelId, Date.now()))
  }

  return (
    <div className={styles.root}>
      {/* 下拉刷新（antd-mobile下拉刷新） */}
      <PullToRefresh onRefresh={onRefresh}>
        {/* 文章列表中的每一项 */}
        {
          channelArticles[channelId]?.articleList.map(v =>
            (
              <div className="article-item" key={v.art_id}>
                <ArticleItem article={v} />
              </div>
            ))
        }
        {/* 上拉加载更多（antd-mobile无限滚动） */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </PullToRefresh>
    </div>
  )
}

export default ArticleList

// 01、antd-mobile中的InfiniteScroll组件可以实现上拉加载更多，只需将该组件放置于列表下方，当组件出现在可视区时就会加载一次（基于此，可以替代useEffect中依赖项为[]时的初次发请求）
// 02、InfiniteScroll组件的loadMore属性必须返回一个promise，而axios请求返回的就是promise，因此通常会在该属性的函数体内进行异步请求
// 02、InfiniteScroll 会自动对 loadMore 函数加锁，避免重复的请求，但是前提是 loadMore 函数需要返回一个正确的 Promise
// 02、例如：const loadMore = async ()=>{ await axios() } 或者 const loadMore =()=>{ return axios() }
// 03、InfiniteScroll组件的hasMore属性是一个布尔值，该布尔值的结果取决于上拉加载更多的列表是否还有数据（因为此处接口有问题，因此人为设定为当加载完100条后就设置为false）
// 03、当前项目接口返回的timestamp时间戳，就是判断列表是否还有数据的依据，当timestamp为null时，则数据加载完毕，因此 const hasMore = timestamp !== null
// 03、但是该接口并未完善导致时间戳的频道不准确，因此只能人为的设限当加载100条后置为false不再做无限加载，即 const hasMore =  article.length <= 100
// 04、getArticleList这个actionCreator需要传入频道id以及时间戳
// 04、A 如果是传入服务器返回的时间戳channelArticles[channelId]?.timestamp，则是请求历史推荐数据
// 04、B 如果是传入当前时间戳Date.now()，则是请求当前最新的推荐数据
// 05、因为无限加载做的是文章数据的拼接，因此需要修改action.type === 'home/getChannelArticleList'时的reducer,将请求回来的数据的逻辑由直接赋值改成新旧数据的展开与拼接
// 06、下拉刷新做的并非是数据的拼接，因此action.type === 'home/refreshChannelArticleList'时，只需要将最新的时间戳Date.now()传入，然后获取数据直接进行赋值即可，无需新旧文章列表进行拼接
