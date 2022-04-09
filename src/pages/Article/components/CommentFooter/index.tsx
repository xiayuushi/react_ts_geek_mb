import React from 'react'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { RootStateType } from '@/types/store'
import { isLikeArticle, isCollectArticle } from '@/store/actions/article'

type Props = {
  // normal 普通评论面板（评论+点赞+收藏+分享）
  // reply 回复评论面板（点赞+分享）
  type?: 'normal' | 'reply',
  btnCommentClick?: () => void,
  inputCommentClick?: () => void
}

const CommentFooter = ({ type = 'normal', btnCommentClick, inputCommentClick }: Props) => {
  const dispatch = useDispatch()
  const { articleDetail, articleComments } = useSelector((state: RootStateType) => state.article)



  return (
    <div className={styles.root}>
      <div className="input-btn" onClick={inputCommentClick}>
        <Icon type="iconbianji" />
        <span>抢沙发</span>
      </div>

      {type === 'normal' && (
        <>
          <div className="action-item" onClick={btnCommentClick}>
            <Icon type="iconbtn_comment" />
            <p>评论</p>
            {!!articleDetail.comm_count && <span className="bage">{articleDetail.comm_count}</span>}
          </div>
          <div className="action-item" onClick={() => dispatch(isLikeArticle())}>
            <Icon type={articleDetail.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
            <p>点赞</p>
          </div>
          <div className="action-item" onClick={() => dispatch(isCollectArticle())}>
            <Icon type={articleDetail.is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'} />
            <p>收藏</p>
          </div>
        </>
      )}

      {type === 'reply' && (
        <div className="action-item" onClick={() => dispatch(isLikeArticle())}>
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

// 01、当前组件的评论功能因为要操作父组件Article中的DOM，因此onComment必须由父组件定义然后传递过来给当前组件组件使用