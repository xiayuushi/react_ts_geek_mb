import React, { useState } from 'react'
import Icon from '@/components/Icon'
import { NavBar, Input } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import { ChatListType } from '@/types/data'
import useInitState from '@/hooks/useInitState'
import { getUserProfile } from '@store/actions/profile'

const defaultImg = 'http://toutiao.itheima.net/images/user_head.jpg'

const Chat = () => {
  const history = useHistory()

  const [chatList, setChatList] = useState<ChatListType>([
    { type: 'robot', text: '你好' },
    { type: 'user', text: '8' }
  ])
  const { userProfile } = useInitState(getUserProfile, 'profile')


  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header" onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list">
        {
          chatList.map((v, i) => {
            if (v.type === 'robot') {
              {/* 机器人的消息 */ }
              return (<div className="chat-item" key={i}>
                <Icon type="iconbtn_xiaozhitongxue" />
                <div className="message">{v.text}</div>
              </div>)
            } else {
              {/* 用户的消息 */ }
              return (<div className="chat-item user" key={i}>
                <img src={userProfile.photo ? userProfile.photo : defaultImg} alt="" />
                <div className="message">{v.text}</div>
              </div>)
            }
          })
        }
      </div>

      {/* 底部消息输入框 */}
      <div className="input-footer">
        <Input className="no-border" placeholder="请描述您的问题" />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat
