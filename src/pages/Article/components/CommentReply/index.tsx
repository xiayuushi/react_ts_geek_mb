import React, { useState, useEffect } from 'react'
import { NavBar } from 'antd-mobile'
import CommentFooter from '../CommentFooter'
import NoComment from '../NoComment'
import styles from './index.module.scss'
import CommentItem from '../CommentItem'
import { newCommentType, ArticleCommentResType, ApiResponseType } from '@/types/data'
import request from '@utils/request'

type PropsType = {
  hideReplyPopup: () => void,
  originComment: newCommentType
}

const CommentReply = ({ hideReplyPopup, originComment }: PropsType) => {
  const [reply, setReply] = useState({} as ArticleCommentResType)
  useEffect(() => {
    const getCommentReply = async (source: string, offset?: string) => {
      const res = await request.get<ApiResponseType<ArticleCommentResType>>('/comments', {
        params: {
          type: 'c', source, offset, limit: 10
        }
      })
      setReply(res.data.data)
    }
    getCommentReply(originComment.com_id, reply.last_id || '')

  }, [])

  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        {/* 顶部导航栏 */}
        <NavBar className="transparent-navbar" onBack={hideReplyPopup}>
          <div>{originComment.reply_count}条回复</div>
        </NavBar>

        {/* 源评论信息 */}
        <div className="origin-comment">
          <CommentItem type="normal" comment={originComment}></CommentItem>
        </div>

        {/* 回复评论的列表 */}
        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {
            originComment.reply_count === 0
              ? (<NoComment />)
              : (reply.results?.map(v => (<CommentItem comment={v} type="reply" key={v.com_id}></CommentItem>)))
          }
        </div>

        {/* 评论工具栏，设置 type="reply" 不显示评论和点赞按钮 */}
        <CommentFooter type="reply" />
      </div>
    </div>
  )
}

export default CommentReply

// 01、考虑到评论回复的数据比较少，可以无需存储到redux中，因此直接在组件使用useState定义状态进行管理
