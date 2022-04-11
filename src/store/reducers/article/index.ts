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
        ...action.response,
        results: [...oldResults, ...action.response.results]
      }
    }
  }
  if (action.type === 'article/clearArticleComment') {
    return {
      ...state,
      articleComments: {} as ArticleCommentResType
    }
  }
  if (action.type === 'article/commentArticle') {
    return {
      ...state,
      articleComments: {
        ...state.articleComments,
        results: [action.newComment, ...state.articleComments?.results]
      }
    }
  }
  if (action.type === 'article/updateReplyCount') {
    return {
      ...state,
      articleComments: {
        ...state.articleComments,
        results: state.articleComments.results?.map(v => {
          if (v.com_id === action.commentId) {
            return {
              ...v,
              reply_count: v.reply_count + 1
            }
          }
          return v
        })
      }
    }
  }
  return state
}

export default article
