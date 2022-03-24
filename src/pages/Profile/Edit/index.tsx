import React, { useEffect, useState } from 'react'
import { Button, List, Popup, NavBar, Toast } from 'antd-mobile'
import classNames from 'classnames'

import EditInput from './EditInput'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, updateUserProfile } from '@/store/actions/profile'
import { RootStateType } from '@/types/store'


const ProfileEdit = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserProfile())
  }, [])

  const { profile: { userProfile } } = useSelector((state: RootStateType) => state)

  type PopupType = { type: '' | 'intro' | 'name', visibile: boolean }
  const [showPopup, setShowPopup] = useState<PopupType>({
    type: '',
    visibile: false,
  })
  const hidePopup = () => {
    setShowPopup({
      type: '',
      visibile: false
    })
  }
  const onUpdate = async (key: string, value: string) => {
    console.log(key, value)
    await dispatch(updateUserProfile(key, value))
    Toast.show({ content: '修改成功', icon: 'success', afterClose: () => hidePopup() })
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar style={{ '--border-bottom': '1px solid #F0F0F0' }}>个人信息</NavBar>

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
            <List.Item
              arrow
              extra={userProfile.name}
              onClick={() => setShowPopup({ type: 'name', visibile: true })}>
              昵称
            </List.Item>
            <List.Item
              arrow
              extra={<span className={classNames('intro', userProfile.intro && 'normal')}>{userProfile.intro || '未填写'}</span>}
              onClick={() => setShowPopup({ type: 'intro', visibile: true })}
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
      <Popup
        visible={showPopup.visibile}
        position="right"
        onMaskClick={hidePopup}
        destroyOnClose
      >
        <EditInput hidePopup={hidePopup} type={showPopup.type} onUpdate={onUpdate}></EditInput>
      </Popup>
    </div>
  )
}

export default ProfileEdit
