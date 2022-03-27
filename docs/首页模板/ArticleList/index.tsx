import ArticleItem from '../ArticleItem'

import styles from './index.module.scss'

const ArticleList = () => {
  return (
    <div className={styles.root}>
      {/* 文章列表中的每一项 */}
      <div className="article-item">
        <ArticleItem />
      </div>
    </div>
  )
}

export default ArticleList
