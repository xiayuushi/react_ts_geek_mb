import React, { useState, useEffect, useRef } from 'react'
import { Input, NavBar, TextArea } from 'antd-mobile'

import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/types/store'
import { InputRef } from 'antd-mobile/es/components/input'
import { TextAreaRef } from 'antd-mobile/es/components/text-area'

type PropsType = {
  hidePopup: () => void,
  onUpdate: (key: string, value: string) => void,
  type: '' | 'name' | 'intro',
}
const EditInput = ({ hidePopup, type, onUpdate }: PropsType) => {
  const { profile: { userProfile } } = useSelector((state: RootStateType) => state)
  const [value, setValue] = useState(type === 'name' ? userProfile.name : userProfile.intro)

  const inputRef = useRef<InputRef>(null)
  const textAreaRef = useRef<TextAreaRef>(null)
  useEffect(() => {
    if (type === 'name') {
      inputRef.current?.focus()
    } else {
      textAreaRef.current?.focus()
      document.querySelector('textarea')?.setSelectionRange(-1, -1)
    }
  }, [type])

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        right={<span className="commit-btn" onClick={() => onUpdate(type, value)}>提交</span>}
        onBack={hidePopup}
      >
        编辑{type === 'name' ? '昵称' : '简介'}
      </NavBar>

      <div className="edit-input-content">
        <h3>{type === 'name' ? '昵称' : '简介'}</h3>

        <div className="input-wrap">
          {
            type === 'name'
              ? (<Input ref={inputRef} placeholder="请输入昵称" value={value} onChange={e => setValue(e)} />)
              : (<TextArea ref={textAreaRef} placeholder="请输入简介" maxLength={99} showCount value={value} onChange={e => setValue(e)} />)
          }
        </div>
      </div>
    </div>
  )
}

export default EditInput

// 01、Popup的children是自定义封装的EditInput组件
// 02、EditInput根据type属性值的不同，代表的组件也不同（type='name'时是EditInput传递的是Input组件，否则传递的是TextArea组件）
// 03、对EditInput组件（Input或TextArea）进行受控时，因为数据回显不同，则不同的组件初始值状态value不一样
// 03、因此在为它们进行受控时需要根据父组件（EditInput）传递的type属性进行辨别，详情参考上面的调用useState时的三元表达式
// 04、同一组件进行复用且有不同的逻辑，在做数据回显时，容易出现数据'串扰'，解决方式有3种
// 04、方式1 为它们的共同父组件设置一个key属性，例如：<EditInput key={showPopup.type} type={showPopup.type} /> 当showPopup.type值不同时，则每次关闭时都会将原来那个key对应的EditInput组件进行销毁，此时复用就不会出现数据'串扰'
// 04、方式2 根据业务中与数据有关联的布尔值进行判断，渲染不同的组件，如 { showPopup.visible && <EditInput type={showPopup.type} /> }
// 04、方式3 使用antd-mobile中 Popup组件提供的destroyOnClose属性，在关闭Popup弹出层时将其内容children（EditInput组件）直接卸载销毁
// 04、以上前两种方式在其他项目中也可以尝试，尤其是添加key属性作为标识（确保组件在销毁与重新渲染时是不同的），以防止复用组件数据'串扰'是最常用的方式
// 05、antd-mobile中的组件是基于原生组件改的，其事件对象的类型也不再是原生的那些类型，而是antd-mobile自己提供的类型
// 05、因此Input与TextArea进行受控时，onChange中的e也不再是原生的e，它不需要像原生那样通过e.target的方式取value值与设置value值（这点可查看antd-mobile文档，此处e是string类型）
// 06、antd-mobile中的textArea组件并没有解决光标位置的问题，使用focus()聚焦时，光标会在内容的前面出现不太合理
// 06、因此调用原生textarea的setSelectionRange(-1, -1)，将光标设置到内容的最后面

// N1、react父子组件传值都是props来实现的
// n1、父传属性xxx时，子直接`props.xxx`接收 
// n1、例如：父<Xxx xxx={data} />  + 子props.xxx可以使用父组件传递过来的data
// n2、父传方法xxx时，子直接`props.xxx()`调用 
// n2、例如：父<Xxx xxx={fn} /> + 子()=>props.xxx()可以调用父组件提供的方法修改父组件的数据
// n3、子传父时，只需要调用父组件提供的方法，同时将传递的数据通过形参传递给父组件即可（不能违背单向数据流原则）
// n3、例如：父<Xxx xxx={fn} /> + 子()=>props.xxx(data) + 父 fn(v){ 形参v就是子组件传递的数据data }

// N2、textarea的setSelectionRange()可以参考MDN文档API，'HTMLInputElement/setSelectionRange'
// n1、textarea对象.setSelectionRange(0,-1)时，表示选中textarea的所有内容
// n1、textarea对象.setSelectionRange(-1,-1)时，表示将光标定位到textarea内容末尾