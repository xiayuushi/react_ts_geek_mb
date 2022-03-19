import { useHistory } from 'react-router-dom'
import { NavBar } from 'antd-mobile'

import ArticleItem from '@/components/ArticleItem'

import styles from './index.module.scss'

const Result = () => {
  const history = useHistory()

  const renderArticleList = () => {
    return [].map((item, index) => {
      const {
        title,
        pubdate,
        comm_count,
        aut_name,
        art_id,
        cover: { type, images }
      } = item

      const articleData = {
        title,
        pubdate,
        comm_count,
        aut_name,
        type,
        images
      }

      return (
        <div
          key={index}
          className="article-item"
          onClick={() => history.push(`/article/${art_id}`)}
        >
          <ArticleItem {...articleData} />
        </div>
      )
    })
  }

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>搜索结果</NavBar>
      <div className="article-list">{renderArticleList()}</div>
    </div>
  )
}

export default Result
