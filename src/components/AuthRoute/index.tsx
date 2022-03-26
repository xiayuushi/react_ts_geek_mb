import React, { ComponentType } from 'react'
import { isLogin } from '@utils/storage'
import { Route, Redirect, RouteProps } from 'react-router-dom'

export const AuthRoute1 = ({ children, ...rest }: RouteProps) => {
  return (
    <Route
      {...rest}
      render={
        ({ location }) => {
          return isLogin() ? children : (<Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />)
        }
      } />
  )
}


interface XxxRouteProps extends RouteProps {
  component: ComponentType<any>
}
export const AuthRoute2 = ({ component: Component, ...rest }: XxxRouteProps) => {
  return (
    <Route {...rest} render={({ location }) => {
      return isLogin() ? (<Component />) : (<Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />)
    }} />
  )
}


export const AuthRoute3 = ({ render, ...rest }: RouteProps) => {
  return (
    <Route {...rest} render={({ location }) => {
      return isLogin() ? render : (<Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />)
    }} />
  )
}


// 01、当前封装的是鉴权路由，因为React没有直接提供类似Vue那样的导航守卫，如要实现鉴权路由必须自行封装
// 02、以上三种不同的封装方式，决定了其使用鉴权路由的方式也不一样
// 02、AuthRoute1的使用：<AuthRoute path="/xxx"><Xxx /></AuthRoute>
// 02、AuthRoute2的使用：<AuthRoute path="/xxx" component={Xxx} />
// 02、AuthRoute3的使用：<AuthRoute path="/xxx" render={导入的组件Xxx 或者 ()=>(<Xxx />)} />

// 03、Route组件render属性的回调形参可以获取当前路由相关数据，
// 03、可以从中render属性的回调中，从形参解构出location用于获取被鉴权拦住之前的来源页path，以便后续登录后做跳转

// 04、history.push()可以传入对象，此处的Redirect组件的to属性值也可以是对象
// 04、history.push('/xxx')等同于history.push({ pathname:'/xxx'})
// 05、history.push()或者Redirect组件的to属性，传入对象时，state字段可以传递额外的属性，state也是个对象，对象内可以自定义字段传递数据
// 05、例如：history.push({ pathname:'/xxx', state: { 自定义字段：值 }})
// 05、此处，Redirect组件的to属性中，state用于传递额外数据（例如自定义的字段from，用于记录被鉴权路由拦下时的来源页路径）

// N1、Q：封装鉴权路由AuthRoute2时报错'JSX 元素类型Component不具有任何构造签名或调用签名'
// N1、A：先继承React-router-dom内置的RouteProps类型，再重新将component的类型定义为：组件的props允许接收任意类型
// N1、A：例如：`interface XxxRoutePropsType extends RouteProps { component: ComponentType<any> //表示组件的props可以接收任意类型 }`
