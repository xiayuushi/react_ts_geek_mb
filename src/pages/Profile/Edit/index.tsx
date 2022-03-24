import React, { useEffect, useState } from 'react'
import { Button, List, Popup, NavBar, Toast } from 'antd-mobile'
import classNames from 'classnames'

import EditInput from './EditInput'
import EditList from './EditList'
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

  type EditInputType = { type: '' | 'intro' | 'name', visibile: boolean }
  type EditListType = { type: '' | 'gender' | 'photo', visibile: boolean }
  const [showEditInput, setShowEditInput] = useState<EditInputType>({
    type: '',
    visibile: false,
  })
  const [showEditList, setShowEditList] = useState<EditListType>({
    type: '',
    visibile: false
  })
  const hidePopup = () => {
    setShowEditInput({
      type: '',
      visibile: false
    })
    setShowEditList({
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
              arrow
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
              onClick={() => setShowEditList({ type: 'photo', visibile: true })}
            >
              头像
            </List.Item>
            <List.Item
              arrow
              extra={userProfile.name}
              onClick={() => setShowEditInput({ type: 'name', visibile: true })}>
              昵称
            </List.Item>
            <List.Item
              arrow
              extra={<span className={classNames('intro', userProfile.intro && 'normal')}>{userProfile.intro || '未填写'}</span>}
              onClick={() => setShowEditInput({ type: 'intro', visibile: true })}
            >
              简介
            </List.Item>
          </List>

          <List className="profile-list">
            <List.Item
              arrow
              extra={userProfile.gender === 1 ? '男' : '女'}
              onClick={() => setShowEditList({ type: 'gender', visibile: true })}
            >
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
        visible={showEditInput.visibile}
        position="right"
        onMaskClick={hidePopup}
        destroyOnClose
      >
        <EditInput hidePopup={hidePopup} type={showEditInput.type} onUpdate={onUpdate}></EditInput>
      </Popup>
      <Popup
        visible={showEditList.visibile}
        position='bottom'
        onMaskClick={hidePopup}
        destroyOnClose
      >
        <EditList hidePopup={hidePopup} type={showEditList.type} onUpdate={onUpdate}></EditList>
      </Popup>
    </div>
  )
}

export default ProfileEdit

// 01、因修改昵称与修改简介的弹出层结构、逻辑一致，因此封装EditInput组件以便复用这两种弹出层 
// 02、因修改头像与修改性别的弹出层结构、逻辑一致，因此封装EditList组件以便复用这两种弹出层 
