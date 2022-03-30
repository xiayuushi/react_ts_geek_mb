import React, { useState } from 'react'
import styles from './index.module.scss'
import Icon from '@components/Icon'
import { Tabs, Popup } from 'antd-mobile'
import useInitState from '@/hooks/useInitState'
import { getUserChannels, getAllChannels } from '@/store/actions/home'
import Channels from './components/Channels'

const Home = () => {
  const { userChannels } = useInitState(getUserChannels, 'home')
  const { allChannels } = useInitState(getAllChannels, 'home')
  const [visible, setVisible] = useState(false)
  const showPopup = () => {
    setVisible(true)
  }
  const hidePopup = () => {
    setVisible(false)
  }
  return (
    <div className={styles.root}>
      {/* 频道 Tabs 列表 */}
      {
        userChannels.length > 0 && (
          <Tabs className="tabs">
            {
              userChannels.map(v => (
                <Tabs.Tab title={v.name} key={v.id}>
                  {v.name}的内容
                </Tabs.Tab>
              ))
            }
          </Tabs>
        )
      }
      {/* 顶部右侧图标 */}
      <div className="tabs-opration">
        <Icon type="iconbtn_search" />
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
        />
      </Popup>
    </div>
  )
}

export default Home

// 01、当请求的数据未回来，直接渲染频道列表会报错'userChannels.map is not a function'，因此需要做条件渲染：当数据回来再做渲染
// 02、渲染频道列表发现选中项默认高亮失效了，此时只需要将userChannels是否为空的逻辑挪到外层并包裹整个tabs标签结构即可解决
