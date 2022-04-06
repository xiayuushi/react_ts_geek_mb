import { ArticleDetailType } from '@/types/data'
import { ArticleDetailActionType } from '@/types/store'

type ArticleStateType = {
  articleDetail: ArticleDetailType
}
const initState: ArticleStateType = {
  articleDetail: {} as ArticleDetailType
}

const article = (state = initState, action: ArticleDetailActionType): ArticleStateType => {
  if (action.type === 'article/getArticleDetail') {
    return {
      ...state,
      articleDetail: action.response
    }
  }
  return state
}

export default article
