import { SearchActionType } from '@/types/store'
import { SuggestionType } from '@/types/data'
import { setSearchHistoryRecordList, getSearchHistoryRecordList } from '@/utils/storage'

type SearchStateType = {
  suggestion: SuggestionType,
  historyRecordList: string[]
}
const initState: SearchStateType = {
  suggestion: {
    options: []
  },
  historyRecordList: getSearchHistoryRecordList()
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
  if (action.type === 'search/updateHistoryRecord') {
    setSearchHistoryRecordList(action.payload)
    return {
      ...state,
      historyRecordList: action.payload
    }
  }
  return state
}

export default search