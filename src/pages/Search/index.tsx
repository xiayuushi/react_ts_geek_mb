import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useHistory } from 'react-router'
import { NavBar, SearchBar } from 'antd-mobile'
import { useDebounceFn } from 'ahooks'

import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { getSuggestion, clearSuggestion } from '@/store/actions/search'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '@/types/store'

const SearchPage = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState('')
  const [isSuggestion, setIsSuggestion] = useState(false)
  const { suggestion: { options } } = useSelector((state: RootStateType) => state.search)

  const { run, cancel } = useDebounceFn((keyword) => {
    dispatch(getSuggestion(keyword))
  }, { wait: 2000 })
  const onChange = (e: string) => {
    if (!e.trim()) {
      setIsSuggestion(false)
      dispatch(clearSuggestion)
      return
    }
    setKeyword(e)
    setIsSuggestion(true)
    run(e)
  }

  const keywordHighLight = (str: string) => {
    return str?.replace(
      new RegExp(keyword, 'gi'),
      (match) => `<span>${match}</span>`
    )
  }

  useEffect(() => {
    return () => {
      cancel()
    }
  }, [])

  return (
    <div className={styles.root}>
      {/* 搜索框 */}
      <NavBar
        className="navbar"
        onBack={() => history.go(-1)}
        right={<span className="search-text">搜索</span>}
      >
        <SearchBar placeholder="请输入关键字搜索" onChange={onChange} />
      </NavBar>

      {/* 搜索历史（与下方搜索联系互斥显示） */}
      <div
        className="history"
        style={{
          display: isSuggestion ? 'none' : 'block'
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

      {/* 搜索联想（与上方搜索历史互斥显示） span标签是搜索文字的高亮效果展示 */}
      <div className={classnames('search-result', isSuggestion ? 'show' : '')}>
        {
          options[0] !== null && options.map((v, i) => (
            <div className="result-item" key={i}>
              <Icon className="icon-search" type="iconbtn_search" />
              <div className="result-value text-overflow" dangerouslySetInnerHTML={{ __html: keywordHighLight(v) }}>
              </div>
            </div>
          ))
        }
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
// const onChange =(e:string)=>{ setKeyword(e); clearTimeout(timer.current); timer.current=window.setTimeout(()=>{ console.log(e)或者发请求 }, 1000) }
// useEffect(()=>{ clearTimeout(timer.current) },[])

// 方式2、从ahooks这个react工具函数库中导入并使用useDebounceFn来对输入框做防抖
// 注意：解构出的run是执行函数，cancel是取消函数
// const [keyword, setKeyword]=useState('')
// const {run,cancel} = useDebounceFn((e)=>{ console.log(e)或者发请求}, {wait: 1000}})
// const onChange =(e:string)=>{ setKeyword(e); run(e); }
// useEffect(()=>{ cancel() },[])

// 防抖与节流（以对输入框的处理为例）
// 01、防抖：在输入时不执行，停止一段时间后才会执行（类似生活中的电梯）
// 02、节流：在输入时以某种频率去执行，例如2秒执行一次（类似游戏中的技能的冷却时间）

// 正则表达式的两种写法（构造函数写法可以传入变量）
// 01、构造函数写法：new RegExp(正则，'gi')
// 02、字面量写法： /正则/gi

// 字符串replace()的参数
// 01、String.prototype.replace(参数1是替换前的字符, 参数2是替换后的字符)
// 02、参数2可以是具体的值，也可以是一个函数，函数形参就是替换前的字符匹配到的值，因此可以通过该函数提取出搜索的关键字匹配到的值
// 02、String.prototype.replace('xxx', match=>{ match可以获取到替换前的字符'xxx'对应匹配到的值，且是保留源大小写匹配到的值 })

// 搜索关键字实现高亮的思路
// 01、调用接口后，获取到包含搜索关键字的联想记录
// 02、定义提取搜索关键字高亮的函数，该函数接收一个形参（形参就是联想记录的文本），并返回一个字符串的replace()
// 03、字符串的replace()的作用是将普通文字替换成富文本（富文本中的搜索关键字是高亮的）
// 04、字符串replace()，第一参数是需要被替换的字符（即正则构造函数），第二参数传入一个回调（回调是替换后的内容，会返回包含搜索关键字的富文本），在回调形参中可以获取到搜索关键字匹配到的值
// 05、使用正则表达式的构造函数写法，将搜索关键字（变量keyword）传入
// 06、在react中并没有像vue那样的v-html指令，实现富文本的解析，但是react中DOM元素上有一个dangerouslySetInnerHTML属性可以实现类似的效果
// 06、例如:`<div dangerouslySetInnerHTML={{__html: 此处放入需要解析的富文本 }}></div>`

// N1、TS项目中使用定时器或者计时器必须使用window对象点出，否则其默认是NodeJs对象为定时器或者计时器的id指定类型时就会报错
// N2、正则表达式：字面量写法简单但不适合传入变量，构造函数写法稍微繁琐但是适合传入变量
// N3、react中DOM元素可以通过dangerouslySetInnerHTML属性实现富文本解析，作用类似于vue中的v-html
// N3、但是如果是在用户输入的标签中要慎用，因为react中DOM元素的dangerouslySetInnerHTML属性容易受到xss攻击
// N3、如果是针对仅做渲染的DOM元素，则可以放心的使用，该属性的值是一个对象，注意对象内的__html属性是双下划线，__html的值就是需要解析的富文本
// N3、例如:`<div dangerouslySetInnerHTML={{__html: 此处放入需要解析的富文本 }}></div>`
// N4、String.prototype.replace(new RegExp(keyword, 'gi'), match=>{ 形参match就是正则匹配到的保留大小写格式的值，可以用来返回富文本 如 return `<span>${match}</span>` })
