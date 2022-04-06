import request from "@utils/request"
import { RootThunkActionType, SearchActionType } from "@/types/store"
import { ApiResponseType, SuggestionType, SearchResultAllResType } from '@/types/data'

export const getSuggestion = (q: string): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<SuggestionType>>(`/suggestion?q=${q}`)
    dispatch({
      type: 'search/getSuggestion',
      response: res.data.data
    })
  }
}

export const clearSuggestion = (): SearchActionType => {
  return {
    type: 'search/clearSuggestion'
  }
}

export const addHistoryRecord = (keyword: string): RootThunkActionType => {
  return async (dispatch, getState) => {
    const { historyRecordList: oldHistoryRecordList } = getState().search
    const historyRecordList = Array.from(new Set([keyword, ...oldHistoryRecordList]))
    if (historyRecordList.length > 10) {
      historyRecordList.pop()
    }
    dispatch({
      type: 'search/updateHistoryRecord',
      payload: historyRecordList
    })
  }
}

export const delHistoryRecord = (keyword: string): RootThunkActionType => {
  return (dispatch, getState) => {
    let { historyRecordList } = getState().search
    historyRecordList = historyRecordList.filter(v => v !== keyword)
    dispatch({
      type: 'search/updateHistoryRecord',
      payload: historyRecordList
    })
  }
}

export const clearHistoryRecord = (): SearchActionType => {
  return {
    type: 'search/updateHistoryRecord',
    payload: []
  }
}

export const getSearchResult = (q: string, page = 1, per_page = 10): RootThunkActionType => {
  return async dispatch => {
    const res = await request.get<ApiResponseType<SearchResultAllResType>>('/search', {
      params: {
        q,
        page,
        per_page,
      }
    })
    dispatch({
      type: 'search/getSearchResult',
      response: res.data.data
    })
  }
}

// addHistoryRecord进行数组去重、数组长度限制、数组内关键字提到数组前面的几种方式
// 方式2比方式1更加简便，因为使用展开运算符时，可以直接将搜索关键字放到最前面，省去手动的unshift()插入到最前面

// 方式1：Array.prototype.filter()去重 + Array.prototype.pop()删除最后一项 + Array.prototype.unshift()添加到最前面
// st1、获取旧的历史记录数组：let {historyRecordList} = getState().search
// st2、数组去重：historyRecordList = historyRecordList.fliter(v!==keyword);  此处filter返回的是新数组因此需要赋值才能实现去重
// st3、判断数组元素长度，限制历史记录长度：if(historyRecordList.length>=10){ historyRecordList.pop() }; 
// st4、将最新的搜索关键字添加到数组最前面：historyRecordList.unshift() 

// 方式2：new Set([])去重 + Array.from()转成真数组 + Array.prototype.pop()删除最后一项
// st1、获取旧的历史记录数组：let {historyRecordList} = getState().search
// st2、使用Set对数组去重并将Set对象转成真数组：Array.from(new Set([keyword, ...historyRecordList]))
// st2、或者不使用Array.from()，也可以直接 [...new Set([keyword, ...historyRecordList])]
// st3、判断数组元素长度，限制历史记录长度：if(historyRecordList.length>10){ historyRecordList.pop() };
