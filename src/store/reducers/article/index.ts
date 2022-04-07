import { ArticleDetailType, ArticleCommentResType } from '@/types/data'
import { ArticleActionType } from '@/types/store'

type ArticleStateType = {
  articleDetail: ArticleDetailType,
  articleComments: ArticleCommentResType
}
const initState: ArticleStateType = {
  articleDetail: {} as ArticleDetailType,
  articleComments: {} as ArticleCommentResType
}

const article = (state = initState, action: ArticleActionType): ArticleStateType => {
  if (action.type === 'article/getArticleDetail') {
    return {
      ...state,
      articleDetail: action.response
    }
  }
  if (action.type === 'article/getArticleComment') {
    const oldResults = state.articleComments.results || []
    return {
      ...state,
      articleComments: {
        ...state.articleComments,
        results: [...oldResults, ...action.response.results]
      }
    }
  }
  if (action.type === 'article/clearArticleComment') {
    return {
      ...state,
      articleComments: {
        ...state.articleComments,
        results: []
      }
    }
  }
  return state
}

export default article
