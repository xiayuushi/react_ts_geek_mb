import { SearchActionType } from '@/types/store'
import { SuggestionType } from '@/types/data'

type SearchStateType = {
  suggestion: SuggestionType
}
const initState: SearchStateType = {
  suggestion: {
    options: []
  }
}
const search = (state = initState, action: SearchActionType): SearchStateType => {
  if (action.type === 'search/getSuggestion') {
    return {
      ...state,
      suggestion: {
        ...state.suggestion,
        options: action.response.options
      }
    }
  }
  if (action.type === 'search/clearSuggestion') {
    return {
      ...state,
      suggestion: {
        ...state.suggestion,
        options: []
      }

    }
  }
  return state
}

export default search