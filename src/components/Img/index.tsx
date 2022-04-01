import React, { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'
import Icon from '@components/Icon'

type PropsType = {
  src: string,
  alt?: string,
  className?: string
}

const Img = ({ src, alt, className }: PropsType) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          imgRef.current!.src = imgRef.current!.getAttribute('data-src')!
        }
      })
    ob.observe(imgRef.current!)
    return () => {
      ob.unobserve(imgRef.current!)
    }
  }, [])

  return (
    <div className={classnames(styles.root, className)}>
      {/* 正在加载时显示的内容 */}
      {isLoading && (
        <div className="image-icon">
          <Icon type="iconphoto" />
        </div>)
      }


      {/* 加载出错时显示的内容 */}
      {isError && (
        <div className="image-icon">
          <Icon type="iconphoto-fail" />
        </div>)
      }

      {/* 加载成功时显示的内容 */}
      <img
        alt={alt}
        data-src={src}
        ref={imgRef}
        onError={() => setIsError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

export default Img

// 01、当前组件是自定义封装的图片懒加载组件，封装完成后可当成常规img标签元素那样使用，且自动会有图片懒加载效果
// 02、如果使用antd-mobile的Image组件，则使用lazy属性即可开启图片懒加载，但是此处使用原生webapi进行自行封装
// 03、原生img标签上有onError属性可以定义图片加载出错时的回调，有onLoad属性可以定义图片加载完成后的回调
// 04、本次封装使用到了原生webapi，即IntersectionObserver()
// 04、该API第一参数是一个回调，回调的形参是一个数组，可以从数组中解构出isIntersecting用于判断被监听对象是否进入可视区
// 05、实例化IntersectionObserver()出一个对象ob，通过该对象调用observe()，可以监听DOM元素，通过该对象调用unobserve()可以解除监听
// 06、图片懒加载的本质是一开始不为img标签设置src属性，因为只要直接设置src属性，该图片就会直接被加载出来
// 06、监听图片是否进入可视区，一旦进入可视区，再将图片url设置给img的src属性
// N1、必须使用`!`非空断言，断定img元素不为空，否则通过JS对空元素进行属性添加或获取（而且只要触发useEffect，说明DOM已经渲染完成，DOM标签也已经渲染了）
// N2、IntersectionObserver()这个原生webapi的用途很多，它也可以用于封装上拉加载更多组件（功能与antd-mobile的InfiniteScroll组件类似）
