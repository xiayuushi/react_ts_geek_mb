import React, { useState } from 'react'
import styles from './index.module.scss'
import Icon from '@components/Icon'
import { Tabs, Popup } from 'antd-mobile'
import useInitState from '@/hooks/useInitState'
import { getUserChannels, getAllChannels, changeActiveChannelId } from '@/store/actions/home'
import Channels from './components/Channels'
import { useSelector, useDispatch } from 'react-redux'
import { RootStateType } from '@/types/store'
import ArticleList from './components/ArticleList'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const history = useHistory()
  const { userChannels } = useInitState(getUserChannels, 'home')
  const { allChannels } = useInitState(getAllChannels, 'home')

  const [visible, setVisible] = useState(false)
  const showPopup = () => {
    setVisible(true)
  }
  const hidePopup = () => {
    setVisible(false)
  }

  const dispatch = useDispatch()
  const { activeChannelId } = useSelector((state: RootStateType) => state.home)
  const tabsChange = (x: string) => {
    dispatch(changeActiveChannelId(+x))
  }

  return (
    <div className={styles.root}>
      {/* 频道 Tabs 列表 */}
      {
        userChannels.length > 0 && (
          <Tabs className="tabs" activeKey={activeChannelId + ''} onChange={tabsChange}>
            {
              userChannels.map(v => (
                <Tabs.Tab title={v.name} key={v.id} forceRender>
                  <ArticleList channelId={v.id}></ArticleList>
                </Tabs.Tab>
              ))
            }
          </Tabs>
        )
      }
      {/* 顶部右侧图标 */}
      <div className="tabs-opration">
        <Icon type="iconbtn_search" onClick={() => history.push('/search')} />
        <Icon type="iconbtn_channel" onClick={showPopup} />
      </div>
      {/* 图标对应的频道弹出层 */}
      <Popup
        visible={visible}
        onMaskClick={hidePopup}
        position="right"
        bodyStyle={{ height: '100vh' }}
      >
        <Channels
          hide={hidePopup}
          userChannels={userChannels}
          allChannels={allChannels}
          activeChannelId={activeChannelId}
        />
      </Popup>
    </div>
  )
}

export default Home

// 01、当请求的数据未回来，直接渲染频道列表会报错'userChannels.map is not a function'，因此需要做条件渲染：当数据回来再做渲染
// 02、渲染频道列表发现选中项默认高亮失效了，此时只需要将userChannels是否为空的逻辑挪到外层并包裹整个tabs标签结构即可解决
// 03、接口中频道id为number类型，因此定义redux的状态时设置activeChannelId为number类型，但是antd-mobile中Tab的onChange形参内置为string类型，因此传参时需要进行转换
// N1、如果想让频道切换后保留之前频道的滚动条位置，可以给antd-mobile中的Tabs.Tab组件添加一个forceRender属性
// N2、antd-mobile中的Tabs.Tab组件forceRender属性是强制渲染，可以让组件内容随Tab标签页进行切换时，将内容（结构）进行隐藏（display:none;），而不是直接销毁组件。
// N3、Tabs.Tab加上forceRender属性（即该属性值为true时），则会为每个Tabs标签页（频道）生成一个独立的结构（多个结构互不影响）
// N3、会让当前所在的频道组件显示，其余的进行display:none进行隐藏（会渲染，但是结构通过css隐藏了，因此各个频道的滚动条位置互不影响，也就可以保留滚动条位置）
// N4、Tabs.Tab不加forceRender属性（即该属性值默认为false时），则每个Tabs标签页（频道）共用一个结构（当前切换到的频道才会放入这个结构）
// N4、只有当前所在的频道组件会渲染，其余的频道直接不渲染，因此每次切换频道时虽然路由没有发生跳转但都是移除了之前的频道后重新生成，因此频道的滚动条位置无法保留
// N5、Tabs.Tab设置了forceRender属性如果路由发生跳转，如何保留之前频道的滚动条位置？
// N5、对组件进行缓存，封装类似vue中的keep-alive来替代常规路由Route进行路由配置（对需要缓存的路由使用自定义的keep-alive组件进行配置）
// N5、配置路由时，对于需要做缓存的组件使用keep-alive组件替代Route组件，且keep-alive组件必须放置到react-router-dom的Switch组件外部
// N5、尤其注意keep-alive组件不能嵌套到Switch内部内部，否则keep-alive控制的组件不会渲染，因为Switch只会让匹配成功的组件渲染，其余都不渲染
// N5、keep-alive组件的封装就是依赖了'Route组件children属性的值为函数时，无论路由是否匹配成功都会执行'的特点，让其定义的activePath匹配成功后
