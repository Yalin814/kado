import { PropsWithChildren, useState } from 'react'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './app.scss'
import N4 from '@/assets/N4.json'
import { Loading } from '@antmjs/vantui'

function App({ children }: PropsWithChildren<any>) {
  const [loading, setLoading] = useState(false)

  useLaunch(() => {
    setLoading(true)
    console.log('App launched.')
    Taro.showLoading({
      title: '系统初始化中...'
    })
    Taro.getStorage({
      key: 'list'
    })
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        Taro.setStorage({
          key: 'list',
          data: N4
        }).finally(() => {
          setLoading(false)
        })
      })
  })

  // children 是将要会渲染的页面
  if (loading) return <Loading type="spinner" />
  else return children
}

export default App
