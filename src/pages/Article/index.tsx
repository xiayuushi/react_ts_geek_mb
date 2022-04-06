import React from 'react';
import styles from './index.module.scss'
import { getArticleDetail } from '@/store/actions/article';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs'
import classNames from 'classnames'
import useInitState from '@/hooks/useInitState';

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
              dangerouslySetInnerHTML={{ __html: articleDetail.content }}
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

export default Article;
