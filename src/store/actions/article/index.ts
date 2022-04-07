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