import request from '@utils/request'
import { ApiResponseType, ArticleDetailType } from '@/types/data'
import { RootThunkActionType } from '@/types/store'

export const getArticleDetail = (id: string): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<ArticleDetailType>>(`/articles/${id}`)
    dispatch({
      type: 'article/getArticleDetail',
      response: res.data.data
    })
  }
}