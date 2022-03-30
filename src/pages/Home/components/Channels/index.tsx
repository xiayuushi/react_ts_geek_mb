import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { ChannelType } from '@/types/data'
import { differenceBy } from 'lodash'

type PropsType = {
  hide: () => void,
  userChannels: ChannelType[],
  allChannels: ChannelType[]
}
const Channels = ({ hide, userChannels, allChannels }: PropsType) => {
  const recommmendChannels = differenceBy(allChannels, userChannels, 'id')

  return (
    <div className={styles.root}>
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={hide} />
      </div>
      <div className="channel-content">
        {/* 编辑时，添加类名 edit */}
        <div className={classnames('channel-item')}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">点击进入频道</span>
            <span className="channel-item-edit">编辑</span>
          </div>
          <div className="channel-list">
            {/* 选中时，添加类名 selected */}
            {
              userChannels.map(v => (
                <span className={classnames('channel-list-item')} key={v.id}>
                  {v.name}
                  <Icon type="iconbtn_tag_close" />
                </span>
              ))
            }
          </div>
        </div>

        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {
              recommmendChannels.map(v => (
                <span className="channel-list-item" key={v.id}>+ {v.name}</span>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels

// 01、lodash是一个JS工具函数库，内置了大量的已经封装好了可随时导入使用的工具函数
// 02、推荐频道列表是需要计算才能得到的，即`推荐频道列表 = 全部频道列表 - 我的频道列表`
// 03、代码获取`推荐频道列表`的几种方式
// 03、方式1：const recommendChannels = allChannels.filter(item=>{ const index = userChannels.findIndex(v=> v.id===item.id); return index === -1 })
// 03、方式2：const recommendChannels = allChannels.filter(item=>{ return userChannels.every(v=> v.id===item.id) })
// 03、方式3：const recommendChannels = allChannels.filter(item=>{ return !userChannels.some(v=> v.id===item.id) })
// 03、方式4：const recommmendChannels = differenceBy(allChannels, userChannels, 'id') //lodash中的'differenceBy'方法
// 04、用户频道列表渲染的功能优化（并非直接走接口获取频道列表，而是应该具体分析，在action/home模块做逻辑判断）
// 04、Q1 如果用户已登录，则应该发送请求获取用户的频道数据
// 04、Q2 如果用户未登录，则应该优先操作本地数据
// 04、Q2 A 本地有，则操作本地数据，不走接口
// 04、Q2 B 本地无，则发送请求获取默认的频道数据，然后再存储到本地，后续则操作本地数据
// N1、无论何种情况，getUserChannels都要提供action对象(含必须的type与自定义的response属性)以便在reducer中能够找到对应的type进行处理

// lodash的使用流程
// st1、安装lodash及类型声明文件，例如 `yarn add lodash @types/lodash`
// st2、导入到需要使用的组件中，并解构出需要使用到的工具函数
// st3、直接按照传参要求调用函数并传入对应的参数即可

// lodash中difference函数与differenceBy函数的区别
// difference只适用于一维数组且数组中的元素为简单类型，例如：`const xxx = difference([1,2,3],[2]) //返回xxx结果为[1,3]`
// difference适用于一维数组且数组中的元素可以是可迭代的复杂类型，参数3为排除的规则，例如：`const xxx = differenceBy([{id:1},{id:2}],[{id:1},'id']) //返回xxx结果为[{id:2}]`

// 使用lodash进行防抖与节流
// const newFn = debounce(func, [wait=0], [options=]) 此时newFn就是func经过防抖处理后的新函数
// const newFn = throttle(func, [wait=0], [options=]) 此时newFn就是func经过节流处理后的新函数

// 数组的扁平化（将数组的元素展开到一个数组中，JS数组方法flat()与flatMap()的使用）
// 例如：const arr = [1, 2, 3, [4, 5, 6, [7, 8, 8, 8, 8, 9]]]
// arr.flat(2) 可以得到 [1,2,3,4,5,6,7,8,9] 其中方法接收的参数2表示展开2层，如果元素重复会自动去重处理
// 例如：const list = ['hello world', 'xi xi']
// list.flatMap(v=>{return v.split(' ')}) 可以得到 ['hello', 'world', 'xi', 'xi'] 
// 等同于 list.map(v=>{return v.split(' ')}).flat()
