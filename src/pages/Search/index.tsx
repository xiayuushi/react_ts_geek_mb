import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useHistory } from 'react-router'
import { NavBar, SearchBar } from 'antd-mobile'
import { useDebounceFn } from 'ahooks'

import Icon from '@/components/Icon'
import styles from './index.module.scss'

const SearchPage = () => {
  const history = useHistory()
  const [keyword, setKeyword] = useState('')
  const { run, cancel } = useDebounceFn(() => {
    console.log(keyword)
  }, { wait: 2000 })
  const onChange = (e: string) => {
    setKeyword(e)
    run()
  }
  useEffect(() => {
    return () => {
      cancel()
    }
  }, [])

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        onBack={() => history.go(-1)}
        right={<span className="search-text">搜索</span>}
      >
        <SearchBar placeholder="请输入关键字搜索" onChange={onChange} />
      </NavBar>

      {true && (
        <div
          className="history"
          style={{
            display: true ? 'none' : 'block'
          }}
        >
          <div className="history-header">
            <span>搜索历史</span>
            <span>
              <Icon type="iconbtn_del" />
              清除全部
            </span>
          </div>

          <div className="history-list">
            <span className="history-item">
              <span className="text-overflow">黑马程序员</span>
              <Icon type="iconbtn_essay_close" />
            </span>
          </div>
        </div>
      )}

      <div className={classnames('search-result', true ? 'show' : '')}>
        <div className="result-item">
          <Icon className="icon-search" type="iconbtn_search" />
          <div className="result-value text-overflow">
            <span>黑马</span>
            程序员
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage

// 输入框防抖处理的几种方式
// 方式1、手动使用定时器来做 useRef + setTimeout
// 方式2、使用ahooks这个库中的防抖函数 useDebounceFn来做

// 方式1、直接使用useRef生成的对象的current属性记录定时器id，进入定时器前清理定时器，在定时器内获取输入结果
// 注意：是对打印输出进行防抖，避免每次将不必要的关键字用于发请求，导致接口频繁的调用
// const timer = useRef(-1); const [keyword, setKeyword]=useState('')
// const onChange =(e:string)=>{ setKeyword(e); clearTimeout(timer.current); window.setTimeout(()=>{ console.log(e) }, 1000) }
// useEffect(()=>{ clearTimeout(timer.current) },[])

// 方式2、从ahooks这个react工具函数库中导入并使用useDebounceFn来对输入框做防抖
// 注意：解构出的run是执行函数，cancel是取消函数
// const [keyword, setKeyword]=useState('')
// const {run,cancel} = useDebounceFn(()=>{ console.log(keyword), {wait: 1000}})
// const onChange =(e:string)=>{ setKeyword(e); run(); }
// useEffect(()=>{ cancel() },[])

// 防抖与节流（以对输入框的处理为例）
// 防抖：在输入时不执行，停止一段时间后才会执行（类似生活中的电梯）
// 节流：在输入时以某种频率去执行，例如2秒执行一次（类似游戏中的技能的冷却时间）

// N1、TS项目中使用定时器或者计时器必须使用window对象点出，否则其默认是NodeJs对象为定时器或者计时器的id指定类型时就会报错
