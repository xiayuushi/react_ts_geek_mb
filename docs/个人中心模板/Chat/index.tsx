import Icon from '@/components/Icon'
import { NavBar, Input } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'

const Chat = () => {
  const history = useHistory()

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header" onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list">
        {/* 机器人的消息 */}
        <div className="chat-item">
          <Icon type="iconbtn_xiaozhitongxue" />
          <div className="message">你好！</div>
        </div>

        {/* 用户的消息 */}
        <div className="chat-item user">
          <img src={'http://toutiao.itheima.net/images/user_head.jpg'} alt="" />
          <div className="message">你好？</div>
        </div>
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
