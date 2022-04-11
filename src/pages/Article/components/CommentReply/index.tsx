import React, { useState, useEffect } from 'react'
import { NavBar } from 'antd-mobile'
import CommentFooter from '../CommentFooter'
import NoComment from '../NoComment'
import styles from './index.module.scss'
import CommentInput from '../CommentInput'
import CommentItem from '../CommentItem'
import { newCommentType, ArticleCommentResType, ApiResponseType, CommentArticleResType } from '@/types/data'
import { RootStateType } from '@/types/store'
import request from '@utils/request'
import { InfiniteScroll, Popup } from 'antd-mobile'
import { useSelector, useDispatch } from 'react-redux'
import { updateReplyCount } from '@/store/actions/article'

type PropsType = {
  hideReplyPopup: () => void,
  originComment: newCommentType
}

const CommentReply = ({ hideReplyPopup, originComment }: PropsType) => {
  const dispatch = useDispatch()
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


  const [visible, setVisible] = useState(false)
  const inputCommentClick = () => {
    setVisible(true)
  }
  const hideCommentPopup = () => {
    setVisible(false)
  }
  const { art_id, aut_name } = useSelector((state: RootStateType) => state.article.articleDetail)
  const submitComment = async (comment: string) => {
    const res = await request.post<ApiResponseType<CommentArticleResType>>('/comments', {
      target: originComment.com_id,
      content: comment,
      art_id,
    })
    setReply({
      ...reply,
      results: [res.data.data.new_obj, ...(reply.results || [])]
    })
    dispatch(updateReplyCount(originComment.com_id))
    hideCommentPopup()
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
        <CommentFooter type="reply" inputCommentClick={inputCommentClick} />
      </div>

      {/* 对某人的某条评论进行回复的弹出层 */}
      <Popup visible={visible} position="right" destroyOnClose>
        <CommentInput name={aut_name} hideCommentPopup={hideCommentPopup} submitComment={submitComment}></CommentInput>
      </Popup>
    </div>
  )
}

export default CommentReply

// 01、考虑到评论回复的数据比较少，可以无需存储到redux中，因此直接在组件使用useState定义状态进行管理（不建议这么做，详情见05）
// 02、如果存储到redux，则action可以参考getArticleComment这个actionCreator，对应的reducer也要有管理回复评论数据的state
// 02、获取评论与获取回复的接口及所需字段都是类似的，只是传参不同，因此定义action及处理reducer都是类似的
// 03、InfiniteScroll组件（无限滚动）loadMore的逻辑可以参考src/Article/index.tsx，在Article/index.tsx中数据是存放与redux中的
// 04、数组展开进行拼接时，应该考虑数据展示的先后顺序，如新添加的评论应该在前面展示
// 05、用于渲染评论条数的originComment.reply_count是redux的数据（articleComments），而新添加的评论回复却是当前组件的状态（并未放到redux）中
// 05、因此添加评论回复后评论数量不会随之增加，所以解决方式是在当前组件添加回复后，定义并调用新增回复数量的action将添加数量同步到redux中
// N1、在实际项目中，尽量让同一模块的数据保持统一，要么全部放redux，要么全部放组件（推荐放redux中）
// N1、不建议将redux数据拆分出来一部分放组件一部分放redux，否则用于渲染的数据可能无法同步更新（例如当前组件的回复评论数量）
// N2、即使调用了updateReplyCount这个action对redux中用于渲染的回复数量进行更新，但是页面视图上的数量依旧未能更新成功
// N2、观察redux开发者工具，可以看到redux中回复数量实际上是发生了更新的，之所以视图未能更新成功