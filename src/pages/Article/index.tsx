import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { useParams } from 'react-router-dom'
import useInitState from '@/hooks/useInitState'
import { getArticleDetail } from '@/store/actions/article'

import dayjs from 'dayjs'
import classNames from 'classnames'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const Article = () => {
  const params = useParams<{ id: string }>()
  const { articleDetail } = useInitState(() => getArticleDetail(params.id), 'article')

  hljs.configure({
    //忽略未经过转义的html字符
    ignoreUnescapedHTML: true
  })
  const eventListenerFn = () => {
    // 获取富文本中所有带有代码块的code标签并添加内置的主题类样式
    document.querySelectorAll('.dg-html pre code').forEach(
      el => hljs.highlightElement(el as HTMLElement)
    )
  }
  useEffect(() => {
    document.addEventListener('load', eventListenerFn)
    return () => {
      document.removeEventListener('load', eventListenerFn)
    }
  }, [])
  return (
    <div className={styles.root}>
      <div className="wrapper">
        <div className="article-wrapper">
          <div className="header">
            <h1 className="title">{articleDetail.title}</h1>

            <div className="info">
              <span>{dayjs(articleDetail.pubdate).format('YYYY-MM-DD')}</span>
              <span>{articleDetail.read_count} 阅读</span>
              <span>{articleDetail.comm_count} 评论</span>
            </div>

            <div className="author">
              <img src={articleDetail.aut_photo} alt="" />
              <span className="name">{articleDetail.aut_name}</span>
              <span
                className={classNames(
                  'follow',
                  articleDetail.is_followed ? 'followed' : ''
                )}
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
      </div>
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
