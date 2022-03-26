import React, { useEffect, useState, useRef } from 'react'
import { Button, List, Popup, NavBar, Toast, DatePicker, Dialog } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import EditInput from './EditInput'
import EditList from './EditList'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, updateUserProfile, updateUserPhoto } from '@/store/actions/profile'
import { RootStateType } from '@/types/store'
import { useHistory } from 'react-router-dom'
import { logout } from '@/store/actions/login'

const defaultImg = 'http://toutiao.itheima.net/images/user_head.jpg'

const ProfileEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

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

  const fileRef = useRef<HTMLInputElement>(null)
  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const fd = new FormData()
    fd.append('photo', file)
    await dispatch(updateUserPhoto(fd))
    hidePopup()
    Toast.show({ content: '修改头像成功！', icon: 'success' })
  }

  const onUpdate = async (key: string, value: string) => {
    if (key === 'photo') {
      fileRef.current!.click()
      return
    }
    await dispatch(updateUserProfile(key, value))
    hidePopup()
    Toast.show({ content: '修改成功', icon: 'success' })
  }

  const [showDatePicker, setShowDatePicker] = useState(false)
  const onConfirm = (val: any) => {
    const birthday = dayjs(val).format('YYYY-MM-DD')
    onUpdate('birthday', birthday)
  }

  const onLogout = () => {
    Dialog.show({
      content: '是否现在退出登录?',
      closeOnAction: true,
      actions: [[
        {
          key: 'cancel',
          text: '取消',
          style: { color: '#0094ff' }
        },
        {
          key: 'confirm',
          text: '确定',
          danger: true,
          onClick: async () => {
            await dispatch(logout())
            Toast.show({ content: '退出成功', icon: 'success', afterClose: () => history.replace('/login') })
          }
        }
      ]]
    })
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar
          onBack={() => history.go(-1)}
          style={{ '--border-bottom': '1px solid #F0F0F0' }}
        >
          个人信息
          </NavBar>

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
                    src={userProfile.photo ? userProfile.photo : defaultImg}
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
            <List.Item
              arrow
              extra={userProfile.birthday}
              onClick={() => setShowDatePicker(true)}
            >
              生日
              </List.Item>
          </List>
        </div>

        <div className="logout">
          <Button className="btn" onClick={onLogout}>退出登录</Button>
        </div>
      </div>
      <Popup
        visible={showEditInput.visibile}
        position="right"
        onMaskClick={hidePopup}
        destroyOnClose
      >
        <EditInput hidePopup={hidePopup} type={showEditInput.type} onUpdate={onUpdate} />
      </Popup>
      <Popup
        visible={showEditList.visibile}
        position='bottom'
        onMaskClick={hidePopup}
        destroyOnClose
      >
        <EditList hidePopup={hidePopup} type={showEditList.type} onUpdate={onUpdate} />
      </Popup>

      {/* 文件上传 隐藏域 */}
      <input hidden type="file" ref={fileRef} onChange={onChangeFile} />

      <DatePicker
        title="请选择生日"
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        min={new Date('2020-01-01')}
        max={new Date()}
        value={new Date(userProfile.birthday)}
        onConfirm={onConfirm}
      />
    </div>
  )
}

export default ProfileEdit

// 01、因修改昵称与修改简介的弹出层结构、逻辑一致，因此封装EditInput组件以便复用这两种弹出层 
// 02、因修改头像与修改性别的弹出层结构、逻辑一致，因此封装EditList组件以便复用这两种弹出层 
// 03、onUpdate这个事件可以修改个人信息：性别、昵称、头像、简介、生日，但是头像走的是图片上传
// 03、onUpdate形参如果key是'photo'，则说明用户点击的是修改头像，即点击了'拍照'或者'本地选择'，则必须return，不能让其往后走更新其他的昵称或者简介生日等逻辑
// 04、当前项目修改个人资料时，无论是点击了'拍照'或者'本地选择'都是做文件上传，并没有调用原生能力（如拍照API）
// 04、如果'拍照'需要调用原生能力，则可以继续用第二形参value值做判断：'拍照'对应的value值是'0'，'本地选择'对应的value值是'1'
// 05、逻辑中使用的'!'是非空断言，断言该数据或者方法一定存在不会为空（非空断言在TS中可用，在JS中不能使用）
// 06、逻辑中使用的'?'是可选链操作符，表示有该数据时会往后取值操作，否则不会往后取值操作（可选链操作符在JS或者TS中都能使用）
// 07、文件上传 input[type='file']：设置hidden属性隐藏域 + 设置ref属性绑定input并调用click()打开隐藏域 + 设置onChange事件捕捉文件上传信息
// 08、文件上传需要实例化FormData对象进行append()参数拼接，将拼接好参数的formdata实例化对象作为接口参数，调用接口发送请求
// 08、FormData实例化对象调用append()拼接参数时，key必须与接口文档的字段保持一致，即 new FormData.append('接口文档要求的字段名',值)

// N1、获取DOM的类型，可以在DOM元素上设置ref属性，将光标移入ref属性上面查看该DOM元素对应TS类型
// N2、获取DOM的事件对象类型，可以在DOM元素上设置对应的行内事件，行内事件中使用箭头函数，将光标移入行内事件 `e=>`的e中查看该事件对象对应的TS类型
