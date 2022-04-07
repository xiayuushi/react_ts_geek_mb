import React from 'react'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/types/store'

type Props = {
  // normal 普通评论面板（评论+点赞+收藏+分享）
  // reply 回复评论面板（点赞+分享）
  type?: 'normal' | 'reply'
}

const CommentFooter = ({ type = 'normal' }: Props) => {
  const { articleDetail, articleComments } = useSelector((state: RootStateType) => state.article)
  return (
    <div className={styles.root}>
      <div className="input-btn">
        <Icon type="iconbianji" />
        <span>抢沙发</span>
      </div>

      {type === 'normal' && (
        <>
          <div className="action-item">
            <Icon type="iconbtn_comment" />
            <p>评论</p>
            {!!articleDetail.comm_count && <span className="bage">{articleDetail.comm_count}</span>}
          </div>
          <div className="action-item">
            <Icon type={articleDetail.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
            <p>点赞</p>
          </div>
          <div className="action-item">
            <Icon type={articleDetail.is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'} />
            <p>收藏</p>
          </div>
        </>
      )}

      {type === 'reply' && (
        <div className="action-item">
          <Icon type={articleDetail.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
          <p>点赞</p>
        </div>
      )}

      <div className="action-item">
        <Icon type="iconbtn_share" />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter
