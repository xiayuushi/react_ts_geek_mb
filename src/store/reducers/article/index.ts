import { ArticleDetailType, ArticleCommentResType } from '@/types/data'
import { ArticleDetailActionType } from '@/types/store'

type ArticleStateType = {
  articleDetail: ArticleDetailType,
  articleComments: ArticleCommentResType
}
const initState: ArticleStateType = {
  articleDetail: {} as ArticleDetailType,
  articleComments: {} as ArticleCommentResType
}

const article = (state = initState, action: ArticleDetailActionType): ArticleStateType => {
  if (action.type === 'article/getArticleDetail') {
    return {
      ...state,
      articleDetail: action.response
    }
  }
  if (action.type === 'article/getArticleComment') {
    return {
      ...state,
      articleComments: action.response
    }
  }
  return state
}

export default article
