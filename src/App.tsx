import React from 'react'
import './App.scss'
import Login from './pages/Login'
import Layout from './pages/Layout'
import ProfileEdit from './pages/Profile/Edit'
import NotFound from './pages/NotFound'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Switch>
          <Redirect exact from='/' to='/layout'></Redirect>
          <Route path='/login' component={Login}></Route>
          <Route path='/layout' component={Layout}></Route>
          <Route path='/profile/edit' component={ProfileEdit}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </div >
  )
}

export default App

// 01、react-router-dom@5.3.0路由的三种使用方式
// 01、方式1 `<Route path='/xxx' component={Xxx}></Route>`
// 01、方式2 `<Route path='/xxx' render={()=>(<Xxx></Xxx>)}></Route>`
// 01、方式3 `<Route path='/xxx'><Xxx></Xxx></Route>`

// 02、react-router-dom@5.3.0路由重定向的两种使用方式
// 02、方式1 `<Redirect exact from='/aaa' to='/xxx'></Redirect>`
// 02、方式2 `<Route exact path='/aaa' render={()=>(<Redirect to='/xxx'></Redirect>)}></Route>`

// N1、Redirect的from属性生效的前提是，该组件嵌套在Switch组件内
// N1、Redirect组件中的from属性脱离Switch组件包裹后不会生效，此时相当于from='*'
// N2、404路由必须放置在正常路由的末尾
// N3、以及路由必须嵌套在Router内部，包括一级路由的锚点跳转组件NavLink以及Link
// N4、Switch组件嵌套下的路由在path匹配成功时只能显示一个
