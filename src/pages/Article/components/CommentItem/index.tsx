import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import classnames from 'classnames'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { ArticleCommentType, newCommentType } from '@/types/data'

type Props = {
  // normal 普通 - 文章的评论（右侧无关注作者按钮 + 左下有回复按钮）
  // origin 回复评论的原始评论，也就是对哪个评论进行回复（右侧有关注作者按钮 + 左下无回复按钮）
  // reply 回复评论（右侧无关注作者按钮 + 左下无回复按钮）
  type?: 'normal' | 'reply' | 'origin',
  comment: ArticleCommentType,
  showReplyPopup?: (comment: newCommentType) => void
}

const CommentItem = ({
  // normal 普通
  // origin 回复评论的原始评论
  // reply 回复评论
  type = 'normal',
  comment,
  showReplyPopup
}: Props) => {
  const replyJSXClick = () => {
    showReplyPopup && showReplyPopup(comment)
  }

  useEffect(() => {
    showReplyPopup && showReplyPopup(comment)
  }, [comment])

  // 回复按钮
  const replyJSX =
    type === 'normal' ? (
      <span className="replay" onClick={replyJSXClick}>
        {comment.reply_count} 回复
        <Icon type="iconbtn_right" />
      </span>
    ) : null

  return (
    <div className={styles.root}>
      <div className="avatar">
        <img src={comment.aut_photo} alt="" />
      </div>
      <div className="comment-info">
        <div className="comment-info-header">
          <span className="name">{comment.aut_name}</span>
          {/* 文章评论、评论的回复 */}
          {(type === 'normal' || type === 'reply') && (
            <span className="thumbs-up">
              {comment.like_count}
              <Icon type={comment.is_liking ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
            </span>
          )}
          {/* 要回复的评论 */}
          {type === 'origin' && (
            <span className={classnames('follow', comment.is_followed ? 'followed' : '')}>
              {comment.is_followed ? '已关注' : '关注'}
            </span>
          )}
        </div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-footer">
          {replyJSX}
          {/* 非评论的回复 */}
          {type !== 'reply' && (
            <span className="comment-time">{dayjs(+new Date(comment.pubdate) - 1 * 1000).fromNow()}</span>
          )}
          {/* 文章的评论 */}
          {type === 'origin' && (
            <span className="thumbs-up">
              {comment.reply_count}
              <Icon type={comment.is_liking ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem

// 01、dayjs解析的相对时间为'xxx秒内'，说明服务器时间与本地时间存在误差，解决方式如下
// 01、方式1：让后端校准服务器时间，这是规范做法
// 01、方式2：前端自己对时间进行处理，例如：dayjs(+new Date(comment.pubdate)-1*1000).fromNow()
// n1、因为TS有类型检测，因此必须在事件对象前使用'+'进行隐式转换（如果是JS则无需如此转换）

