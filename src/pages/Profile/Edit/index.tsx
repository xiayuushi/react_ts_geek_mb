import React, { useEffect } from 'react'
import { Button, List, DatePicker, NavBar } from 'antd-mobile'
import classNames from 'classnames'

import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '@/store/actions/profile'
import { RootStateType } from '@/types/store'


const ProfileEdit = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserProfile())
  }, [])

  const { profile: { userProfile } } = useSelector((state: RootStateType) => state)
  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar
          style={{
            '--border-bottom': '1px solid #F0F0F0'
          }}
        >
          个人信息
        </NavBar>

        <div className="wrapper">
          {/* 列表 */}
          <List className="profile-list">
            {/* 列表项 */}
            <List.Item
              extra={
                <span className="avatar-wrapper">
                  <img
                    width={24}
                    height={24}
                    src={userProfile.photo ? userProfile.photo : 'http://toutiao.itheima.net/images/user_head.jpg'}
                    alt=""
                  />
                </span>
              }
              arrow
            >
              头像
            </List.Item>
            <List.Item arrow extra={userProfile.name}>
              昵称
            </List.Item>
            <List.Item
              arrow
              extra={
                <span className={classNames('intro', 'normal')}>
                  {'未填写'}
                </span>
              }
            >
              简介
            </List.Item>
          </List>

          <List className="profile-list">
            <List.Item arrow extra={userProfile.gender === 1 ? '男' : '女'}>
              性别
            </List.Item>
            <List.Item arrow extra={userProfile.birthday}>
              生日
            </List.Item>
          </List>
        </div>

        <div className="logout">
          <Button className="btn">退出登录</Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit
