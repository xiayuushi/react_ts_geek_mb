import React, { useEffect } from 'react'
import ArticleItem from '../ArticleItem'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getArticleList } from '@store/actions/home'
import { RootStateType } from '@/types/store'

type PropsType = {
  channelId: number
}
const ArticleList = ({ channelId }: PropsType) => {
  const dispatch = useDispatch()
  const { channelArticles } = useSelector((state: RootStateType) => state.home)
  useEffect(() => {
    dispatch(getArticleList(channelId, Date.now()))
  }, [])
  return (
    <div className={styles.root}>
      {/* 文章列表中的每一项 */}
      {
        channelArticles[channelId]?.articleList.map(v =>
          (
            <div className="article-item" key={v.art_id}>
              <ArticleItem article={v} />
            </div>
          ))
      }

    </div>
  )
}

export default ArticleList
