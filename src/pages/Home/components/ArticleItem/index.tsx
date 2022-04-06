import React from 'react'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import classnames from 'classnames'
import { ArticleType, SearchResultType } from '@/types/data'
import { isLogin } from '@/utils/storage'
import dayjs from 'dayjs'
import Img from '@components/Img'
import { useHistory } from 'react-router-dom'

type Props = {
  article: ArticleType | SearchResultType
}

const ArticleItem = ({ article }: Props) => {
  const history = useHistory()
  const { art_id, aut_name, comm_count, title, pubdate, cover: { type, images } } = article
  return (
    <div className={styles.root} onClick={() => history.push(`/article/${art_id}`)}>
      <div
        className={classnames(
          'article-content',
          type === 3 && 't3',
          type === 0 && 'none-mt'
        )}
      >
        <h3>{title}</h3>
        {type !== 0 && (
          <div className="article-imgs">
            {
              images?.map((v, i) => (
                <div className="article-img-wrapper" key={i}>
                  <Img src={v} alt="" />
                </div>
              ))
            }

          </div>
        )}
      </div>
      <div className={classnames('article-info', type === 0 && 'none-mt')}>
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        <span>{dayjs(pubdate).fromNow()}</span>
        <span className="close">
          {
            isLogin() && (<Icon type="iconbtn_essay_close" />)
          }
        </span>
      </div>
    </div>
  )
}

export default ArticleItem
