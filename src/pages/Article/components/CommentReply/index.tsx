import React, { useState, useEffect } from 'react'
import { NavBar } from 'antd-mobile'
import CommentFooter from '../CommentFooter'
import NoComment from '../NoComment'
import styles from './index.module.scss'
import CommentItem from '../CommentItem'
import { newCommentType, ArticleCommentResType, ApiResponseType } from '@/types/data'
import request from '@utils/request'
import { InfiniteScroll } from 'antd-mobile'

type PropsType = {
  hideReplyPopup: () => void,
  originComment: newCommentType
}

const CommentReply = ({ hideReplyPopup, originComment }: PropsType) => {
  const [hasMore, setHasMore] = useState(true)
  const [reply, setReply] = useState({} as ArticleCommentResType)
  const loadMore = async () => {
    const res = await request.get<ApiResponseType<ArticleCommentResType>>('/comments', {
      params: {
        type: 'c',
        source: originComment.com_id,
        offset: reply.last_id || '',
        limit: 10,
      }
    })
    setReply({
      ...res.data.data,
      results: [...(reply.results || []), ...res.data.data.results]
    })
    setHasMore(reply.last_id !== reply.end_id)
  }

  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        {/* 顶部导航栏 */}
        <NavBar className="transparent-navbar" onBack={hideReplyPopup}>
          <div>{originComment.reply_count}条回复</div>
        </NavBar>

        {/* 源评论信息 */}
        <div className="origin-comment">
          <CommentItem type="reply" comment={originComment}></CommentItem>
        </div>

        {/* 回复评论的列表 */}
        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {
            originComment.reply_count === 0
              ? (<NoComment />)
              : (reply.results?.map(v => (<CommentItem comment={v} type="reply" key={v.com_id}></CommentItem>)))
          }
          <InfiniteScroll hasMore={hasMore} loadMore={loadMore} />
        </div>

        {/* 评论工具栏，设置 type="reply" 不显示评论和点赞按钮 */}
        <CommentFooter type="reply" />
      </div>
    </div>
  )
}

export default CommentReply

// 01、考虑到评论回复的数据比较少，可以无需存储到redux中，因此直接在组件使用useState定义状态进行管理
// 02、如果存储到redux，则action可以参考getArticleComment这个actionCreator，对应的reducer也要有管理回复评论数据的state
// 02、获取评论与获取回复的接口及所需字段都是类似的，只是传参不同，因此定义action及处理reducer都是类似的
// 03、InfiniteScroll组件（无限滚动）loadMore的逻辑可以参考src/Article/index.tsx，在Article/index.tsx中数据是存放与redux中的
