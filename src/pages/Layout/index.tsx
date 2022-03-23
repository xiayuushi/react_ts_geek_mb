import React, { useState } from 'react'
import styles from './index.module.scss'
import { TabBar } from 'antd-mobile'
import Icon from '@components/Icon'
import { useHistory, useLocation, Switch, Route, Redirect } from 'react-router-dom'

import Home from '@pages/Home'
import Question from '@pages/Question'
import Video from '@pages/Video'
import Profile from '@pages/Profile'

const Layout = () => {
  const tabs = [
    { path: '/layout', title: '首页', icon: 'iconbtn_home' },
    { path: '/layout/qa', title: '问答', icon: 'iconbtn_qa' },
    { path: '/layout/video', title: '视频', icon: 'iconbtn_video' },
    { path: '/layout/profile', title: '我的', icon: 'iconbtn_mine' },
  ]

  const history = useHistory()
  const location = useLocation()
  const changeRoute = (key: string) => {
    history.push(key)
  }

  return (
    <div className={styles['root']}>
      <Switch>
        <Route exact path="/layout" component={Home}></Route>
        <Route path="/layout/qa" component={Question}></Route>
        <Route path="/layout/video" component={Video}></Route>
        <Route path="/layout/profile" component={Profile}></Route>
      </Switch>
      <TabBar className='tab-bar' onChange={changeRoute} activeKey={location.pathname}>
        {tabs.map(item => (
          <TabBar.Item
            key={item.path}
            title={item.title}
            icon={(active: boolean) => (<Icon type={active ? `${item.icon}_sel` : item.icon} />)}
          />
        ))}
      </TabBar>
    </div>
  )
}

export default Layout

// 01、antd-mobile中Tabbar.Item组件中的icon属性接收字符串或者JSX或者函数（函数形参可以获取当前Tabbar.Item是否被选中）
// 02、带'_sel'后缀的字体图标是深色的，此处用作选中的tabbar图标（不带'_sel'的是浅色图标，用于表示未选中的tabbar图标）