import request from '@utils/request'
import { ApiResponseType, ArticleDetailType, ArticleCommentResType } from '@/types/data'
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

// 01、当attitude===1时是已经点赞状态；而attitude===0或者attitude===-1时，此时是非点赞状态
// 01、因此将attitude！==1作为判断条件，当前非点赞状态，再次点击则为点击状态
