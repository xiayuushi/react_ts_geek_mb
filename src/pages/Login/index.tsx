import React from 'react'
import { NavBar, Form, Input, Button, List } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'
import { LoginParamsType } from '@/types/data'
import { login } from '@store/actions/login'
import { AxiosError } from 'axios'
const Login = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const back = () => {
    history.go(-1)
  }
  const onFinish = async (values: LoginParamsType) => {
    try {
      await dispatch(login(values))
    } catch (e) {
      const err = e as AxiosError<{ message: string }>
      console.log(err.response?.data.message)
    }
  }
  return (
    <div className={styles['root']}>
      <NavBar onBack={back}></NavBar>
      <div className="login-form">
        <h3 className="title">账号登录</h3>
        <Form
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
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <List.Item
            className="login-code-extra"
            extra={<span className="code-extra">发送验证码</span>}
          >
            <Form.Item
              className="login-item"
              name="code"
              rules={[
                { required: true, message: '验证码不能为空' },
                { pattern: /^\d{6}$/, message: '验证码为6为数字' },
              ]}
            >
              <Input placeholder="请输入验证码" />
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
