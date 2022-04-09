import React, { useState, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import { NavBar, TextArea } from 'antd-mobile'
import { TextAreaRef } from 'antd-mobile/es/components/text-area'

type Props = {
  // 评论的作者的名字
  name?: string,
  hideCommentPopup?: () => void,
  submitComment?: (comment: string) => void
}

export default function CommentInput({ name, hideCommentPopup, submitComment }: Props) {
  const [value, setValue] = useState('')
  const textAreaRef = useRef<TextAreaRef>(null)
  const onClick = () => {
    submitComment && submitComment(value)
  }
  useEffect(() => {
    textAreaRef.current!.focus()
  }, [])



  return (
    <div className={styles.root}>
      <NavBar right={<span className="publish" onClick={onClick}>发表</span>} onBack={hideCommentPopup} >
        {name ? '回复评论' : '评论文章'}
      </NavBar >

      <div className="input-area">
        {/* 回复别人的评论时显示：@某某 */}
        {name && <div className="at">@{name}:</div>}

        {/* 评论内容输入框 */}
        <TextArea placeholder="说点什么~" rows={10} ref={textAreaRef} value={value} onChange={e => setValue(e)} />
      </div>
    </div >
  )
}

// 01、发表评论的逻辑可以在当前组件中进行，也可以在父组件中进行
// 02、考虑到将来可能新增功能，因此建议进行状态提升，状态由父组件提供，即在父组件中进行处理（父组件提供方法传递给当前组件进行调用）
// 03、对于非必要方法，中调用时必须先进行逻辑与判断，当该方法存在时才调用，即对于xxx?: ()=>void, 则调用时应该 xxx && xxx()
