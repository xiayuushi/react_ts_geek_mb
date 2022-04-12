import React from 'react'
import styles from './index.module.scss'
import { TabBar } from 'antd-mobile'
import Icon from '@components/Icon'
import { useHistory, useLocation, Switch, Route, Redirect } from 'react-router-dom'

import Home from '@pages/Home'
import Question from '@pages/Question'
import Video from '@pages/Video'
import Profile from '@pages/Profile'
import { AuthRoute2 } from '@/components/AuthRoute'
import KeepAlive from '@/components/KeepAlive'

const Layout = () => {
  const tabs = [
    { path: '/layout/home', title: '首页', icon: 'iconbtn_home' },
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
      <KeepAlive exact path="/layout/home" activePath="/layout/home"><Home /></KeepAlive>
      <Switch>
        <Route path="/layout/qa" component={Question}></Route>
        <Route path="/layout/video" component={Video}></Route>
        <Redirect exact from='/layout' to='/layout/home'></Redirect>
        <AuthRoute2 path="/layout/profile" component={Profile}></AuthRoute2>
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
// 03、带'KeepAlive'的是自定义封装的缓存路由，用于缓存路由组件，让其在切换时不被销毁，让其滚动位置或者文章列表在切换前后保持一致（详情查看@/component/KeepAlive）
// 04、'KeepAlive'组件配置的路由不能嵌套到Switch内部，否则其功能会失效
// 05、因为Layout是tabbar页面（home首页、qa问答、video视频、profile我的）的容器，为了在使用KeepAlive组件对home首页进行缓存时不影响其他三个tabbar页面
// 05、必须将home页面的路由，由之前的'/layout'改成'/layout/home'，避免对其他三个tabbar页面造成影响
