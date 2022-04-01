import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import { Provider } from 'react-redux'
import store from '@store/index'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

