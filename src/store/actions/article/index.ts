import request from '@utils/request'
import { ApiResponseType, ArticleDetailType, ArticleCommentResType, CommentArticleResType } from '@/types/data'
import { RootThunkActionType, ArticleActionType } from '@/types/store'

export const getArticleDetail = (id: string): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<ArticleDetailType>>(`/articles/${id}`)
    dispatch({
      type: 'article/getArticleDetail',
      response: res.data.data
    })
  }
}

export const getArticleComment = (type: 'a' | 'c', source: string, offset?: string, limit?: number): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<ArticleCommentResType>>('/comments', {
      params: {
        type,
        source,
        offset,
        limit
      }
    })
    dispatch({
      type: 'article/getArticleComment',
      response: res.data.data
    })
  }
}

export const clearArticleComment = (): ArticleActionType => {
  return {
    type: 'article/clearArticleComment'
  }
}

export const isLikeArticle = (): RootThunkActionType => {
  return async (dispatch, getState) => {
    const { art_id, attitude } = getState().article.articleDetail
    if (attitude !== 1) {
      await request.post('/article/likings', { target: art_id })
    } else {
      await request.delete(`/article/likings/${art_id}`)
    }
    dispatch(getArticleDetail(art_id))
  }
}

export const isCollectArticle = (): RootThunkActionType => {
  return async (dispatch, getState) => {
    const { art_id, is_collected } = getState().article.articleDetail
    if (is_collected) {
      await request.delete(`/article/collections/${art_id}`)
    } else {
      await request.post('/article/collections', { target: art_id })
    }
    dispatch(getArticleDetail(art_id))
  }
}

export const isFollowAuthor = (): RootThunkActionType => {
  return async (dispatch, getState) => {
    const { aut_id, is_followed, art_id } = getState().article.articleDetail
    if (is_followed) {
      await request.delete(`/user/followings/${aut_id}`)
    } else {
      await request.post('/user/followings', { target: aut_id })
    }
    dispatch(getArticleDetail(art_id))
  }
}

export const commentsArticle = (content: string): RootThunkActionType => {
  return async (dispatch, getState) => {
    const { art_id } = getState().article.articleDetail
    const res = await request.post<ApiResponseType<CommentArticleResType>>('/comments', {
      target: art_id,
      content
    })
    await dispatch({
      type: 'article/commentArticle',
      newComment: res.data.data.new_obj
    })
    dispatch(getArticleDetail(art_id))
  }
}

// 01、attitude有3个数值代表两种状态：值只有为1时才是点赞状态，其余值为-1或者0时为非点赞状态
// 01、因此将attitude!==1作为判断条件，!==1表示当前为非点赞状态，此时调用post请求接口就是点赞，否则调用delete请求接口取消点赞。
