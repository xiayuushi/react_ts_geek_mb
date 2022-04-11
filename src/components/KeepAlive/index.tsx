import React from 'react'
import styles from './index.module.scss'
import { Route, RouteProps } from 'react-router-dom'

type PropsType = RouteProps & { activePath: string }

const KeepAlive = ({ activePath, children, ...rest }: PropsType) => {
  return (
    <Route
      {...rest}
      children={({ location }) => {
        const isMatch = location.pathname.startsWith(activePath)
        return (
          <div className={styles.root} style={{ display: isMatch ? 'block' : 'none' }}>{children}</div>
        )
      }}
    />
  )
}

export default KeepAlive

// 01、当前封装的KeepAlive组件适用于需要做缓存的路由组件，它的作用是让组件在随切换路由时不被销毁，从而保留住页面中的某些状态或者位置
// 01、即组件随路由切换时，使用KeepAlive配置路由的组件依旧会渲染，只是会被css设置display:none进行隐藏
// 01、路由组件缓存，最重要的一点就是：让该路由组件不被销毁，且保持组件渲染，在未匹配成功时只需要通过css的方式让其不显示即可
// 02、需要使用KeepAlive对路由组件缓存的场景：组件切换前后需要保持某些内容或者状态一致，例如切换前后滚动条位置、切换频道前后某篇文章在文章列表的位置、Tab高亮等
// 02、如果组件销毁，会重新发送请求，则文章列表会重新加载，导致之前阅读的文章找不到，此时使用KeepAlive就可以解决这些因组件切换销毁导致的问题
// 03、使用方式：在配置路由时，使用当前封装的KeepAlive组件替代Route组件即可
// 03、使用注意：使用KeepAlive组件配置路由时，不能被嵌套到react-router-dom的Switch组件内
// 03、因为Switch组件内部的组件只有匹配成功的才会渲染，而没有匹配成功的一律不会渲染
// 04、keep-alive组件的封装就是依赖了'react-router-dom中Route组件children属性的值为函数时，无论路由是否匹配成功都会执行'的特点
// 04、当activePath与路由path匹配成功后，将其css设置为block显示出来，否则设置为none隐藏，但始终都会渲染（因为使用KeepAlive配置路由的组件不会被销毁）
// 04、KeepAlive组件的activePath属性的值，就是需要做路由组件缓存的组件的path路径，即activePath与path这两者的值必须一致
// 04、即，想让某个path被匹配后该组件随路由切换不被销毁，只需要使用KeepAlive配置路由且将activePath设置为path即可
// 04、例如：<KeepAlive activePath="/xxx" path="/xxx"><Xxx /></KeepAlive>
// 05、不需要做路由缓存的组件（即，路由切换就需要将组件销毁的组件）直接使用react-router-dom的Route组件配置路由即可
