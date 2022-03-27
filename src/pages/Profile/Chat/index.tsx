import React, { useState, useEffect, useRef } from 'react'
import Icon from '@/components/Icon'
import { NavBar, Input } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import { ChatListType } from '@/types/data'
import useInitState from '@/hooks/useInitState'
import { getUserProfile } from '@store/actions/profile'
import io, { Socket } from 'socket.io-client'
import { getToken } from '@/utils/storage'

const defaultImg = 'http://toutiao.itheima.net/images/user_head.jpg'

const Chat = () => {
  const history = useHistory()

  const [chatList, setChatList] = useState<ChatListType>([
    { type: 'robot', text: '亲爱的用户您好，小智同学为您服务' },
    { type: 'user', text: '你好' }
  ])
  const { userProfile } = useInitState(getUserProfile, 'profile')

  const socketRef = useRef<Socket | null>(null)
  const [userText, setUserText] = useState('')
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      if (!userText.trim()) return
      socketRef.current!.emit('message', {
        msg: userText,
        timestamp: Date.now()
      })
      setChatList(chatList => [...chatList, { type: 'user', text: userText }])
      setUserText('')
    }
  }

  useEffect(() => {
    const { token } = getToken()
    const SocketIoClient = io(`${process.env.REACT_APP_IO}`, {
      query: { token },
      transports: ['websocket']
    })

    socketRef.current = SocketIoClient

    SocketIoClient.on('connect', () => {
      setChatList((chatList) => [...chatList, { type: 'robot', text: '连接成功' }])
    })

    SocketIoClient.on('message', (data: { msg: string, timestamp: number }) => {
      setChatList(chatList => [...chatList, { type: 'robot', text: data.msg }])
    })

    return () => {
      SocketIoClient.close()
    }
  }, [])

  const chatListRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    chatListRef.current!.scrollTop = chatListRef.current!.scrollHeight
  }, [chatList])

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header" onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list" ref={chatListRef}>
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
        <Input className="no-border" placeholder="请描述您的问题" value={userText} onChange={e => setUserText(e)} onKeyUp={onKeyUp} />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat

// 01、用户头像的数据建议走action调用接口获取，不要直接使用useSelector从redux取，避免出现取空数据的情况
// 02、useInitState是自定义hook，传入actionCreator名称以及对应的reducer模块名称，就可以获取该reducer模块对应的state状态
// 03、websocket是即时聊天通讯协议，凡是涉及页面客服聊天、页面聊天室、页面点餐系统等，都会使用该协议
// 04、websocket的对话是双向的，不仅可以由客户端发起对话，也能够由服务器发起对话，且是长期对话
// 05、http协议的对话是单向的，只能由客户端发起，且是短期的，如果想要长期则必须启用耗费性能的轮询模式
// N1、websocket协议的网络请求可以在chrome控制面板 [网络] -> [筛选] -> [WS] 中查看到
// N2、useState()解构出的用于设置状态的方法，如果传入简单类型，则可能无法获取最新的状态值（如无法获取当前最新的聊天信息），此时可以使用useRef()来突破闭包限制，但比较麻烦
// N2、useState()解构出的用于设置状态的方法，如果传入回调，则该回调形参可以获取最新的状态，这点可以突破组件内的闭包限制拿最新的状态
// N3、不要将chatList作为useEffect的依赖，否则每次发送消息后都会重新初始化连接状态
// N4、当组件销毁时必须主动断开与服务器的连接，即 `useEffect(()=>{ return ()=>SocketIoClient.close() },[])`
// N5、为了确保消息自动滚动到最底部，可以将DOM元素的scrollHeight滚动高度设置给scrollTop，这是粗略计算的方法

// socket.io-client的使用
// st1、安装socket.io-client，例如：`yarn add socket.io-client`
// st2、在聊天组件中导入使用，例如：`import io from 'socket.io-client'`
// st3、根据接口文档示例或者socket.io-client的示例文档API创建socket.io-client插件实例对象，例如：`const SocketIoClient =io(url, { ... })`
// st4、使用创建好的插件实例对象调用对应的方法实现自己的业务需求，例如：`SocketIoClient.on('自定义事件xxx',()=>{ ... })`

// sock.io-client与服务器通讯时常用的构子函数或者API（下方SocketIoClient是插件实例化对象）
// 01、SocketIoClient.on('connect',()=>{ //当和服务器建立连接时会触发当前回调... })
// 02、SocketIoClient.on('与emit传递的自定义事件名称保持一致',(e)=>{ //当接收到服务器的消息时会触发当前回调，且形参e就是接收到的由服务器返回的数据... })
// 03、SocketIoClient.on('disconnect',()=>{ //当与服务器的连接断开时会触发当前回调... })
// 04、SocketIoClient.emit('自定义事件xxx', { 字段名:值 }) //主动给服务器发送消息（自定义事件名、字段名必须与接口文档保持一致）
// 05、SocketIoClient.close() //主动与服务器断开连接

// useRef指定泛型
// 01、通过useRef创建的对象xxx是不可变的，但它的current属性是可变的，该特性可以用于突破同一组件的闭包限制
// 02、useRef指定泛型的三种情况（设置泛型为DOM元素或者组件的ref属性提示的类型，不指定泛型，指定为特殊类型与null的联合类型）
// 情况1、通过useRef创建的对象xxx用于给DOM元素ref属性绑定时，初始值可以为null，只需给useRef的泛型指定为：光标移入DOM元素的ref属性时提示的那个类型即可
// 情况1、例如：`const xxx = useRef<HTMLDivElement>(null)` + `<div ref={xxx}></div>` //参考 src/pages/Profile/Edit（绑定DOM元素或者组件的ref属性）
// 情况2、通过useRef创建的对象xxx用于计时器时，初始值直接设置为一个数值即可，此时不需要为useRef指定泛型
// 情况2、例如: `const xxx = useRef(1)` + `xxx.current = window.setInterval(()=>{},1000)` //参考 src/pages/Login （计时器倒计时） 
// 情况3、通过useRef创建的对象xxx并非给DOM元素ref属性绑定时也并非给计时器使用时，如果初始值为null可能会报错，此时必须指定useRef的泛型为：赋值给current属性的数据的类型与null的联合类型
// 情况3、例如: `const xxx = useRef<Socket|null>(null)` + `xxx.current = SocketIoClient` //参考 src/pages/Profile/Chat （小智同学）
