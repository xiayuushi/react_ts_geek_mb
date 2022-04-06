import React from 'react'
import styles from './index.module.scss'
import { getArticleDetail } from '@/store/actions/article'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import classNames from 'classnames'
import useInitState from '@/hooks/useInitState'
import DOMPurify from 'dompurify'

const Article = () => {
  const params = useParams<{ id: string }>()
  const { articleDetail } = useInitState(() => getArticleDetail(params.id), 'article')

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

// dompurify使用流程
// st1、安装dompurify及类型声明文件：yarn add dompurify @types/dompurify
// st2、在需要使用的组件中导入并使用：import DOMPurify from 'dompurify'
// st3、调用该插件的sanitize(dirty)清除可能潜在风险的输入内容：DOMPurify.sanitize(此处传入可能存在潜在风险的内容如富文本)
// st3、例如：在dangerouslySetInnerHTML属性的__html值的地方使用：<div dangerouslySetInnerHTML={{_html: DOMPurify.sanitize(富文本内容)}}></div>

