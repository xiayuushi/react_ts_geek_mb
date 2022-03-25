import React from 'react'
import styles from './index.module.scss'

type PropsType = {
  type: '' | 'gender' | 'photo',
  hidePopup: () => void,
  onUpdate: (key: string, value: string) => void,
}
const genderList = [
  { title: '男', value: '1' },
  { title: '女', value: '0' },
]
const photoList = [
  { title: '拍照', value: '0' },
  { title: '本地选择', value: '1' },
]


const EditList = ({ hidePopup, type, onUpdate }: PropsType) => {
  const list = type === 'gender' ? genderList : photoList
  return (
    <div className={styles.root}>
      {
        list.map(v =>
          (<div
            className="list-item"
            key={v.title}
            onClick={() => onUpdate(type, v.value)}
          >
            {v.title}
          </div>)
        )
      }
      <div className="list-item" onClick={hidePopup}>取消</div>
    </div>
  )
}

export default EditList
