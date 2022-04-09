import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { useParams, useHistory } from 'react-router-dom'
import useInitState from '@/hooks/useInitState'
import { getArticleDetail, getArticleComment, clearArticleComment, isFollowAuthor, commentsArticle } from '@/store/actions/article'
import { newCommentType } from '@/types/data'
import { NavBar, Popup } from 'antd-mobile'

import NoComment from './components/NoComment'
import CommentItem from './components/CommentItem'
import CommentFooter from './components/CommentFooter'
import CommentInput from './components/CommentInput'
import CommentReply from './components/CommentReply'
import Icon from '@components/Icon'
import { InfiniteScroll } from 'antd-mobile'

import dayjs from 'dayjs'
import classNames from 'classnames'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '@/types/store'

const Article = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const params = useParams<{ id: string }>()
  const { articleDetail } = useInitState(() => getArticleDetail(params.id), 'article')

  // 顶部吸附效果
  const [isShowHeader, setIsShowHeader] = useState(false)
  const authorRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollFn = () => {
    const { top } = authorRef.current!.getBoundingClientRect()
    top <= 0 ? setIsShowHeader(true) : setIsShowHeader(false)
  }
  useEffect(() => {
    wrapperRef.current!.addEventListener('scroll', scrollFn)
    return () => {
      wrapperRef.current!.removeEventListener('scroll', scrollFn)
    }
  }, [])


  // 富文本中'pre>code'标签的代码块高亮效果
  hljs.configure({
    //忽略未经过转义的html字符
    ignoreUnescapedHTML: true
  })
  const loadFn = () => {
    // 获取富文本中所有带有代码块的code标签并添加内置的主题类样式
    document.querySelectorAll('.dg-html pre code').forEach(
      el => hljs.highlightElement(el as HTMLElement)
    )
  }
  useEffect(() => {
    document.addEventListener('load', loadFn)
    return () => {
      document.removeEventListener('load', loadFn)
    }
  }, [])

  // 评论上拉加载更多
  const [hasMore, setHasMore] = useState(true)
  const { articleComments: { results = [], last_id, end_id } } = useSelector((state: RootStateType) => state.article)
  const loadMore = async () => {
    await dispatch(getArticleComment('a', params.id, last_id))
    setHasMore(last_id !== end_id)
  }
  useEffect(() => {
    return () => {
      dispatch(clearArticleComment())
    }
  }, [])

  // 评论
  const [isTop, setIsTop] = useState(true)
  const [isShowCommentPopup, setIsShowCommentPopup] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const btnCommentClick = () => {
    if (isTop) {
      wrapperRef.current!.scrollTo(0, commentRef.current!.offsetTop - 45)
    } else {
      wrapperRef.current!.scrollTo(0, 0)
    }
    setIsTop(!isTop)
  }
  const inputCommentClick = () => {
    showCommentPopup()
  }
  const showCommentPopup = () => {
    setIsShowCommentPopup(true)
  }
  const hideCommentPopup = () => {
    setIsShowCommentPopup(false)
  }
  const submitComment = async (comcontent: string) => {
    if (!comcontent) return
    await dispatch(commentsArticle(comcontent))
    hideCommentPopup()
  }

  // 回复评论
  const [isShowReplyPopup, setIsShowReplyPopup] = useState<{ visible: boolean, originComment: newCommentType }>({
    visible: false,
    originComment: {} as newCommentType
  })
  const showReplyPopup = (originComment: newCommentType) => {
    setIsShowReplyPopup({
      visible: true,
      originComment
    })
  }
  const hideReplyPopup = () => {
    setIsShowReplyPopup({
      visible: false,
      originComment: {} as newCommentType
    })
  }

  return (
    <div className={styles.root}>
      {/* 页面视图容器 */}
      <div className="root-wrapper">
        {/* 顶部导航 */}
        {/*（NavBar的内容author盒子1 与文章详情的author盒子2 结构是一样的，且NavBar的内容author盒子1默认是隐藏的 用于做吸顶吸附错觉效果） */}
        <NavBar
          onBack={() => history.go(-1)}
          right={<span><Icon type="icongengduo" /></span>}
        > {isShowHeader && (
          <div className="nav-author">
            <img src={articleDetail.aut_photo} alt="" />
            <span className="name">{articleDetail.aut_name}</span>
            <span
              className={classNames(
                'follow',
                articleDetail.is_followed ? 'followed' : ''
              )}
              onClick={() => dispatch(isFollowAuthor())}
            >
              {articleDetail.is_followed ? '已关注' : '关注'}
            </span>
          </div>
        )}
        </NavBar>

        {/* 文章：详情+评论 */}
        <div className="wrapper" ref={wrapperRef}>
          {/* 详情 */}
          <div className="article-wrapper">
            <div className="header">
              <h1 className="title">{articleDetail.title}</h1>

              <div className="info">
                <span>{dayjs(articleDetail.pubdate).format('YYYY-MM-DD')}</span>
                <span>{articleDetail.read_count} 阅读</span>
                <span>{articleDetail.comm_count} 评论</span>
              </div>

              <div className="author" ref={authorRef}>
                <img src={articleDetail.aut_photo} alt="" />
                <span className="name">{articleDetail.aut_name}</span>
                <span
                  className={classNames(
                    'follow',
                    articleDetail.is_followed ? 'followed' : ''
                  )}
                  onClick={() => dispatch(isFollowAuthor())}
                >
                  {articleDetail.is_followed ? '已关注' : '关注'}
                </span>
              </div>
            </div>

            <div className="content">
              <div
                className="content-html dg-html"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleDetail.content) }}
              />
              <div className="date">
                发布文章时间：{dayjs(articleDetail.pubdate).format('YYYY-MM-DD')}
              </div>
            </div>
          </div>
          {/* 评论 */}
          <div className="comment">
            <div className="comment-header" ref={commentRef}>
              <span>全部评论（{articleDetail.comm_count}）</span>
              <span>{articleDetail.like_count} 点赞</span>
            </div>
            <div className="comment-list">
              {
                articleDetail.comm_count === 0
                  ? (<NoComment />)
                  : (results.map(v => (<CommentItem type="normal" comment={v} key={v.com_id} showReplyPopup={showReplyPopup} />)))
              }
              <InfiniteScroll hasMore={hasMore} loadMore={loadMore} />
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <CommentFooter btnCommentClick={btnCommentClick} inputCommentClick={inputCommentClick} />
      </div>

      {/* 页面隐藏的弹出层：文章评论弹出层 + 评论回复弹出层 */}
      {/* 文章评论弹出层 */}
      <Popup visible={isShowCommentPopup} position="right" destroyOnClose>
        <CommentInput hideCommentPopup={hideCommentPopup} submitComment={submitComment}></CommentInput>
      </Popup>
      {/* 评论回复弹出层 */}
      <Popup visible={isShowReplyPopup.visible} position='right' destroyOnClose>
        <CommentReply hideReplyPopup={hideReplyPopup} originComment={isShowReplyPopup.originComment}></CommentReply>
      </Popup>
    </div>
  );
}

export default Article

// 01、在react项目中解析渲染富文本必须使用到DOM标签的dangerouslySetInnerHTML属性
// 02、在react项目中应该谨慎使用dangerouslySetInnerHTML属性（尤其是让用户输入的内容一定要确保内容安全），因为易遭受xss跨站脚本攻击
// 03、xss攻击通常会与csrf（跨站伪造）攻击配合获取用户数据
// 04、dompurify是一个可以清除可能潜在风险内容的库，专门用于防范xss攻击
// 05、dompurify可以在不同的框架中使用，不局限于react或者vue，也可以在原生JS中使用
// 06、highlight.js专门用于页面中代码高亮显示，例如一些嵌套代码的博客中常常可以看到有插入代码块的地方会有高亮效果，该代码块的高亮显示效果通常会使用该库提供的主题来制作
// 07、highlight.js需要导入两个内容：插件与插件内置样式主题
// 08、highlight.js插件对象可以提供一个highlightElement()用于给代码块'pre>code'标签设置代码块高亮，高亮具体效果由主题样式文件决定
// 08、higtlight.js的主题（其内部提供的css样式文件），导入该主题后，会在组件中新增一个'.hljs'的样式类名，该样式类的作用就是将插入代码块的地方进行高亮显示（）
// 09、highlight.js的安装及导入时都需要带上后面的'.js'后缀
// 09、代码块标签通常都是 pre>code 标签，因此对富文本中的代码块使用highlight.js进行高亮显示需要先获取富文本中所有的code标签
// 10、在处理逻辑时遇到TS报错类型不符，在不影响业务功能的情况下，可以考虑使用类型断言，将报错的数据进行符合类型的断言
// 11、InfiniteScroll组件的hasMore属性尽量使用响应式数据，即用state状态来控制，首次为true（先让它加载一次）且在loadMore逻辑发送请求之后再去判断它为false的状态
// 11、因为loadMore发送请求之前redux是没有评论数据的，因此useSelector获取的articleComment一开始是没有数据的，因此需要解构出里面用到的数据赋初始值（results赋空数组）
// 11、此处评论列表中的hasMore的判断条件是：当lase_id与end_id相同，说明此时评论加载完毕，则hasMore为false，无需继续开启loadMore发请求了
// 11、也可以再解构出total_count与results进行对比，两者相同，说明此时评论加载完毕，则hasMore为false，无需继续开启loadMore发请求了
// 11、总之确保一开始hasMore为true，后续让其在loadMore的逻辑中持续判断，当hasMore为false时让loadMore停止发送请求
// 12、redux中对state的数据采用不同的方式生成，则其在组件后续处理中也会有所不同
// 12、A 如果redux中文章评论列表是对新旧数据进行拼接生成，那么在返回上一页时应该销毁组件，且置空redux中的之前的文章评论列表
// 12、B 如果redux中文章评论列表是直接覆盖，并非进行拼接生成，那么则无需在销毁组件时置空redux中之前的文章评论列表
// 13、文章评论只需要文章id与文章内容，但是评论回复除了以上两个外还必须带上被回复的那个源评论，因此定义state时应该定义对象的形式

// 顶部吸附效果的实现
// 01、其实就是监听文章列表的滚动高度，让两个author盒子的交替显示与隐藏的切换效果，看起来就像是滚动到一定距离产生吸附到顶部的效果
// 02、DOM元素.getBoundingClientRect()可以返回一个对象，该对象包含DOM元素与可见区视口位置信息
// 02、即 { top, bottom, left, right, ... } = DOM.getBoundingClientRect()
// 03、这些方位位置信息是相对距离，即调用该方法的DOM元素的四个边，与视口的左边或上边的相对距离
// 04、NavBar的内容是author盒子，这个与文章列表盒子的其中一个子级元素author盒子结构上是相似的
// 04、NavBar的内容author盒子默认情况下是隐藏的，当下方文章列表滚动时距离顶部为0或者负数时，就会让NavBar内容的那个author盒子出现
// 04、以此来达到看起来是下方文章列表中的author产生了滚动吸附的错觉

// 顶部吸附效果实现流程
// 即,取两个DOM+1个方法+让默认隐藏的另一个盒子显示：滚动条元素DOM注册滚动事件、author盒子DOM通过getBoundingClientRect()获取顶部距离并判断该距离作为另一个隐藏的author盒子显示的依据
// st1、给具有y轴滚动条的元素DOM注册滚动事件（即设置了overflow-y:auto样式的的盒子）
// st2、获取下方author盒子距离可视区顶部的位置（author盒子DOM.getBoundingClientRect()获取）
// st3、在滚动事件中监听author盒子距离可视区顶部的位置变化（当author盒子被隐藏时，让另一个默认隐藏且与author盒子结构类似的盒子显示）

// 滚动到指定位置 DOM元素.scrollTo(x,y)
// 01、可以配合DOM元素的offsetTop属性做滚动到指定位置（offsetTop返回当前元素相对有定位的父级的顶部内边距离）
// 01、例如：滚动的DOM元素.scrollTo(x, 某个参照物DOM元素.offsetTop)

// dompurify使用流程
// st1、安装dompurify及类型声明文件：yarn add dompurify @types/dompurify
// st2、在需要使用的组件中导入并使用：import DOMPurify from 'dompurify'
// st3、调用该插件的sanitize(dirty)清除可能潜在风险的输入内容：DOMPurify.sanitize(此处传入可能存在潜在风险的内容如富文本)
// st3、例如：在dangerouslySetInnerHTML属性的__html值的地方使用：<div dangerouslySetInnerHTML={{_html: DOMPurify.sanitize(富文本内容)}}></div>

// highlight.js的使用流程
// st1、安装highlight.js这个插件：yarn add highlight.js
// st2、在需要使用的组件中导入该插件以便后续调用其方法对code代码块进行高亮：import hljs fron 'highlight.js'
// st3、在需要使用的组件中导入其主题，想要什么主题风格就导什么（主题是css样式文件，在依赖项目录的highlightjs插件的styles目录）：import 'highlight.js/styles/xxx.css'
// st4、遍历富文本所在的父级容器，找出所有有代码块的标签'pre>code'，并调用插件的highlightElement()遍历添加上hljs内置的'.hljs'类名

// DOM元素.getBoundingClientRect()与DOM元素.offset的区别
// 01、getBoundingClientRect()获取的是相对于可视区左或者上的相对距离
// 02、offset是只读属性，可以用于获取当前元素相对于有定位父元素的距离

