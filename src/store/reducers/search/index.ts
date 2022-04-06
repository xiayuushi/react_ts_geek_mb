import { SearchActionType } from '@/types/store'
import { SuggestionType, SearchResultAllResType } from '@/types/data'
import { setSearchHistoryRecordList, getSearchHistoryRecordList } from '@/utils/storage'

type SearchStateType = {
  suggestion: SuggestionType,
  historyRecordList: string[],
  searchResults: SearchResultAllResType
}
const initState: SearchStateType = {
  suggestion: {
    options: []
  },
  historyRecordList: getSearchHistoryRecordList(),
  searchResults: {} as SearchResultAllResType
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
  if (action.type === 'search/getSearchResult') {
    const oldResults = state.searchResults.results || []
    return {
      ...state,
      searchResults: {
        ...state.searchResults,
        results: [...oldResults, ...action.response.results]
      }
    }
  }
  return state
}

export default search
