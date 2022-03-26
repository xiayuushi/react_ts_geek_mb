import React, { useRef, useState, useEffect } from 'react'
import { NavBar, Form, Input, Button, List, Toast } from 'antd-mobile'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'
import { LoginParamsType } from '@/types/data'
import { login, getCode } from '@store/actions/login'
import { InputRef } from 'antd-mobile/es/components/input'

const Login = () => {
  const history = useHistory()
  const location = useLocation<{ from: string }>()
  const back = () => {
    history.go(-1)
  }

  const dispatch = useDispatch()
  const onFinish = async (values: LoginParamsType) => {
    await dispatch(login(values))
    console.log(location.state);

    Toast.show({
      content: '登录成功',
      icon: 'success',
      afterClose: () => { history.replace(location.state ? location.state.from : '/layout') }
    })
  }

  const [form] = Form.useForm()
  const timeRef = useRef(1)
  const [time, setTime] = useState(0)
  const mobileInputRef = useRef<InputRef>(null)
  const onGetCode = async () => {
    const { mobile } = form.getFieldsValue(['mobile', 'code'])
    const mobileError = form.getFieldError('mobile')
    if (!mobile || mobileError.length > 0) {
      mobileInputRef.current?.focus()
      return
    }

    await dispatch(getCode(mobile))
    setTime(60)
    timeRef.current = window.setInterval(() => {
      setTime((time) => time - 1)
    }, 1000)
  }

  useEffect(() => {
    if (time === 0) {
      clearInterval(timeRef.current)
    }
  }, [time])
  useEffect(() => {
    return () => {
      clearInterval(timeRef.current)
    }
  }, [])

  return (
    <div className={styles['root']}>
      <NavBar onBack={back}></NavBar>
      <div className="login-form">
        <h3 className="title">账号登录</h3>
        <Form
          form={form}
          validateTrigger={['onBlur', 'onChange']}
          onFinish={onFinish}
          initialValues={{
            mobile: '13911111111',
            code: '246810'
          }}
        >
          <Form.Item
            className="login-item"
            name="mobile"
            rules={[
              { required: true, message: '手机号不能为空' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式有误' },
            ]}
          >
            <Input ref={mobileInputRef} placeholder="请输入手机号" autoComplete="off" maxLength={11} />
          </Form.Item>
          <List.Item
            className="login-code-extra"
            extra={<span className="code-extra" onClick={onGetCode}>{
              time === 0 ? '发送验证码' : `${time}s后重试`
            }</span>}
          >
            <Form.Item
              className="login-item"
              name="code"
              rules={[
                { required: true, message: '验证码不能为空' },
                { pattern: /^\d{6}$/, message: '验证码为6为数字' },
              ]}
            >
              <Input placeholder="请输入验证码" autoComplete="off" maxLength={6} />
            </Form.Item>
          </List.Item>
          <Form.Item className="login-item">
            <Button
              className="login-submit"
              type="submit"
              color="primary"
              block
            // onClick={login}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login

// 01、在antd的Input组件中定义onKeyup事件，将光标移到事件对象中获取Input组件的类型是HTMLInputElement
// 01、在原生中获取DOM元素的类型，是准确的，但是antd的组件已经被修改过，因此此时以这种方式获取的类型是不准确的
// 02、antd中的Input组件的类型并非是HTMLInputElement，而是antd提供的InputRef类型
// 02、因此获取antd的Input实例时，必须给useRef传入antd提供的InputRef类型
// 03、获取antd组件的类型：可以先定义ref属性，将光标移入到该属性上会有提示，根据提示设置useRef的泛型参数
// 03、因为该泛型参数是antd提供的，因此必须从antd相关组件中进行导入
// 04、即使同一组件中，只要是在不同的方法内，都是封闭的闭包环境，因此获取到的useState中的状态可能不是最新的
// 04、获取useState最新的状态，有两种方式（当前项目采用方式1）
// 04、方式1 从useState()解构出的设置状态的方法，可以在该方法箭头函数回调中获取最新的状态（回调形参就是最新的状态）
// 04、例如：const [xxx, setXxx]=useState(0); setXxx(state=>state就是最新的xxx)，这点类似与class组件中的setState((state)=>state就是最新的状态)
// 04、方式2 使用useRef().current配合useEffect突破闭包限制，获取useState最新的状态
// 04、注意：useRef()返回的对象是在组件中不可变的，但该对象的current属性是可变的
// 05、调用setInterval()时，如果没有指定为window对象的setInterval()，则在TS中setInterval()默认会被当成是nodeJS的方法
// 05、此时，将setInterval()进行赋值给某个变量时，可能会存在类型不一致的问题（window对象的setInterval()返回的对象是number类型）

// N1、原生标签组件的事件对象e的类型获取：定义onKeyup事件，将光标移入事件对象可以看到对应的事件对象e的类型
// N2、第三方组件库组件的事件对象e的类型获取：定义ref属性，将光标移入ref属性上可以看到对应的事件对象e的类型
// N3、还可以使用useRef().current配合useEffect来突破闭包限制，获取useState中最新的数据
// N3、详情参考：https://gitee.com/xiayuushi/react_client_geek/blob/master/src/pages/NotFound/index.js
// N4、在TS中使用setInterval()尽量加上`window.`，否则该方法默认会被指定为Nodejs的方法（NodeJS的setInterval()返回类型不是number）
// N5、当前组件销毁时（跳转到其他组件时），必须clearInterval()，否则会报错
// N5、另外，此处有两次逻辑需要清除计时器，而且两次逻辑的依赖项不一样，因此不能写到同一个useEffect中
// N5、第一次清除是倒计时time的值0时，依赖项是time，会检测time去判断。第二次清除是在组件销毁时，此时没有依赖项，只在组件销毁时执行一次！
