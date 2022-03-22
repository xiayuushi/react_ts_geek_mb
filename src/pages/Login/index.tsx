import React, { useRef } from 'react'
import { NavBar, Form, Input, Button, List, Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'
import { LoginParamsType } from '@/types/data'
import { login, getCode } from '@store/actions/login'
import { InputRef } from 'antd-mobile/es/components/input'

const Login = () => {
  const history = useHistory()
  const back = () => {
    history.go(-1)
  }

  const dispatch = useDispatch()
  const onFinish = async (values: LoginParamsType) => {
    await dispatch(login(values))
    Toast.show({ content: '登录成功', icon: 'success', afterClose: () => { history.push('/layout') } })
  }

  const [form] = Form.useForm()
  const mobileInputRef = useRef<InputRef>(null)
  const onGetCode = () => {
    const { mobile } = form.getFieldsValue(['mobile', 'code'])

    const mobileError = form.getFieldError('mobile')
    if (!mobile || mobileError.length > 0) {
      mobileInputRef.current?.focus()
      return
    }

    dispatch(getCode(mobile))
  }
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
            extra={<span className="code-extra" onClick={onGetCode}>发送验证码</span>}
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

// N1、原生标签组件的事件对象e的类型获取：定义onKeyup事件，将光标移入事件对象可以看到对应的事件对象e的类型
// N2、第三方组件库组件的事件对象e的类型获取：定义ref属性，将光标移入ref属性上可以看到对应的事件对象e的类型
