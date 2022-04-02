import request from "@utils/request"
import { ApiResponseType, SuggestionType } from '@/types/data'
import { RootThunkActionType } from "@/types/store"

export const getSuggestion = (q: string): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<SuggestionType>>(`/suggestion?q=${q}`)
    console.log(res)
    dispatch({
      type: 'search/getSuggestion',
      response: res.data.data
    })
  }
}