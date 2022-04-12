import React from 'react'
import './App.scss'
import Login from './pages/Login'
import Layout from './pages/Layout'
import ProfileEdit from './pages/Profile/Edit'
import Chat from './pages/Profile/Chat'
import Article from './pages/Article'
import Search from './pages/Search'
import SearchResult from './pages/Search/Result'
import NotFound from './pages/NotFound'

import { Router, Switch, Route, Redirect } from 'react-router-dom'
import history from '@utils/history'
import { AuthRoute1, AuthRoute2 } from '@components/AuthRoute'

const App = () => {
  return (
    <div className='app'>
      <Router history={history}>
        <Switch>
          <Redirect exact from='/' to='/layout'></Redirect>
          <Route path='/login' component={Login}></Route>
          <Route path='/layout' component={Layout}></Route>
          <Route path='/search' exact component={Search}></Route>
          <Route path='/article/:id' component={Article}></Route>
          <Route path='/search/result' component={SearchResult}></Route>

          <AuthRoute1 path='/profile/edit'><ProfileEdit /></AuthRoute1>
          <AuthRoute2 path='/chat' component={Chat}></AuthRoute2>
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </div >
  )
}

export default App

// 01、react-router-dom@5.3.0常规路由的三种使用方式
// 01、方式1 `<Route path='/xxx' component={Xxx}></Route>`
// 01、方式2 `<Route path='/xxx' render={()=>(<Xxx></Xxx>)}></Route>`
// 01、方式3 `<Route path='/xxx'><Xxx></Xxx></Route>`

// 02、react-router-dom@5.3.0路由重定向的两种使用方式
// 02、方式1 `<Redirect exact from='/aaa' to='/xxx'></Redirect>`
// 02、方式2 `<Route exact path='/aaa' render={()=>(<Redirect to='/xxx'></Redirect>)}></Route>`

// 03、react-router-dom的Route组件，设置children属性且属性值是一个函数时，无论该路由是否匹配，该函数都会被执行
// 03、例如：<Route path="/abc" children={()=>(<Xxx />)} /> 
// 03、此时，无论path是否匹配到了'/abc'，这个children属性设置的函数都会执行
// 04、如果children属性值函数是渲染返回JSX，则不要将该Route嵌套到Switch中，否则children属性值函数返回的JSX不会被渲染出来
// 04、因为Switch组件嵌套的路由，只有匹配成功的才会被渲染
// 05、Route组件children属性特性1：'Route组件的children属性值是函数时，无论路由是否匹配成功，都会执行该函数'
// 05、Route组件children属性特性2：'Route组件的children属性值是函数时，且该函数返回JSX时，不能将该Route组件嵌套到Switch组件内，否则children属性值函数返回的JSX不会被渲染'
// 05、以上特性也被用于react封装KeepAlive组件做路由组件缓存
// 06、必须强调此处提到的Route组件这个children属性，并不是写到Route的文本节点中的chilren内容！

// N1、Redirect的from属性生效的前提是，该组件嵌套在Switch组件内
// N1、Redirect组件中的from属性脱离Switch组件包裹后不会生效，此时相当于from='*'
// N2、404路由必须放置在正常路由的末尾
// N3、以及路由必须嵌套在Router内部，包括一级路由的锚点跳转组件NavLink以及Link
// N4、Switch组件嵌套下的路由在path匹配成功时只能显示一个
// N5、带'AuthRoute'的是自定义封装的鉴权路由，因为封装方式不同，其使用方式也不同（详情查看@/component/AuthRoute）
// N6、带'KeepAlive'的是自定义封装的缓存路由，用于缓存路由组件，让其在切换时不被销毁，让其滚动位置或者文章列表在切换前后保持一致（详情查看@/component/KeepAlive）
// N6、'KeepAlive'组件配置的路由不能嵌套到Switch内部，否则其功能会失效
// N7、因为Layout是tabbar页面（home首页、qa问答、video视频、profile我的）的容器，为了在使用KeepAlive组件对home首页进行缓存时不影响其他三个tabbar页面
// N7、必须将home页面的路由，由之前的'/layout'改成'/layout/home'，避免对其他三个tabbar页面造成影响
