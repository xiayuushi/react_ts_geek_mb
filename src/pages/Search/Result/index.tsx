import React, { useRef, useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { NavBar, InfiniteScroll } from 'antd-mobile'

import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchResult, clearSearchResult } from '@store/actions/search'
import { RootStateType } from '@/types/store'
import ArticleItem from '@pages/Home/components/ArticleItem'

const Result = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [hasMore, setHasMore] = useState(true)
  const { searchResults: { results = [], total_count = 0 } } = useSelector((state: RootStateType) => state.search)
  const urlParams = decodeURI(location.search.replace('?keyword=', ''))

  const page = useRef(1)

  const loadMore = async () => {
    await dispatch(getSearchResult(urlParams, page.current))
    page.current = page.current + 1
    setHasMore(results.length <= total_count)
  }

  useEffect(() => {
    return () => {
      dispatch(clearSearchResult())
    }
  }, [])

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>搜索结果</NavBar>
      <div className="article-list">
        {
          results.map((v, i) => (
            <div className="article-item" key={i} >
              <ArticleItem article={v} />
            </div>
          ))
        }
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </div>
    </div>
  )
}

export default Result

// 01、考虑到首页的文章ArticleList列表项ArticleItem与当前页的文章列表项ArticleItem是复用同一个组件，且都需要跳转到文章详情页
// 01、因此在ArticleItem中注册点击事件跳转到文章详情页会比较合理，这样不必在首页文章列表项与当前页列表项都注册事件
// 02、InfiniteScroll组件的hasMore属性尽量使用响应式数据，即用state状态来控制，首次为true（先让它加载一次）且在loadMore逻辑发送请求之后再去判断它的状态
// 03、因为redux中文章搜索列表是对新旧数据进行拼接，因此在返回上一页时应该销毁组件，且清理掉redux中的之前的文章搜索列表

// history.push()传参的两种方式
// 方式1：在url路径后面使用'?'的形式拼接参数，以下A1与A2任选一种即可，它们都能实现接参需求
// 01、history.push(`/xxx?keyword=${keyword}`) 后续使用location.search.keyword进行接参
// A1：let keyword = decodeURI(new URLSearchParams(location.search).get('keyword')!)
// A2：let keyword = decodeURI(location.search.replace('?keyword=', ''))
// n1、URLSearchParams()这个webapi用于获取url中'?'后面的那一段字符串，即可以获取到keyword=${keyword}这一段（该api不会解析完整的url地址，且会自动忽略掉起始字符串中的'?'）
// n1、例如：consr res = URLSearchParams('?a=aaa&b=bbb') //通过res.a可以获取aaa 通过res.b可以获取bbb 
// n1、例如：consr xxx = URLSearchParams(); xxx.append('c','ccc'); xxx.append('d','ddd') //此时xxx.toString()可以得到'c=ccc&d=ddd'的字符串
// n2、如果地址栏url涉及到'+=&'等之类的特殊字符，可能会被浏览器进行encodeURI转码，导致出现类似'乱码'的内容，此时需要使用decodeURI()来将接收到的参数进行解码
// n3、如果url的'?'后有多个连续的'='，如'/xxx?keyword=aaa==bbb'这种不规则的字符串，则使用URLSearchParams则可能无法准确获取到我们所需的参数'aaa==bbb'
// n3、此时，可以不使用URLSearchParams，而是直接使用字符串repalce()来将'?keyword='给替换成空字符串，后续就是我们所需的参数
// n4、以上提到的仅考虑了传递单个参数的情况
// 方式2：使用state传参，state是一个对象，对象内部可以自定义键值对传参
// 01、history.push('/xxx', {keyword}) 后续使用location.state.keyword接参
// 02、使用location接收state传递过来的参数时，需要为useLocation指定泛型参数
// 02、例如 const location = useLocation<{keyword: string}>(); location.state.keyword就是接收到的参数

// 访问图片时出现403报错的解决方法
// Q：服务器拒绝响应，会报错403，例如自己的服务器访问其他服务器的图片，会触发防盗链返回403状态码
// A：解决图片403防盗链报错（不建议使用，因为可能侵权）
// A、在项目静态页中加入 `<meta name="referrer" content="no-referrer" />`
// n、不建议在自己服务器中使用其他公司服务器（做了防盗链处理）的图片，因为易造成侵权，另外也会导致SEO或者百度统计失效
