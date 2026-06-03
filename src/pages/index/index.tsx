import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Button } from '@antmjs/vantui'
import { useState } from 'react'
import N4 from '@/assets/N4.json'
import Taro from '@tarojs/taro'
import './index.scss'
import { GrammarPoint } from '@/api/types'

type List = GrammarPoint & {
  remember: number
  learn?: string
  review?: string
  master?: false
}

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [current, setCurrent] = useState(0)
  const [mode, setMode] = useState<'learning' | 'review'>('learning')
  const [flag, setFlag] = useState(false)
  const [remember, setRemember] = useState(false)
  const [list, setList] = useState<List[]>([])

  const handlePrevious = () => {
    if (current === 0)
      Taro.showToast({
        title: '已经是第一个了',
        icon: 'none'
      })
    else setCurrent(current - 1)
  }

  const handleNext = () => {
    if (current === list.length - 1)
      Taro.showModal({
        title: '记忆完毕',
        confirmText: '开始测试',
        cancelText: '重新记忆'
      }).then((res) => {
        setCurrent(0)
        if (res.confirm) setMode('review')
      })
    else setCurrent(current + 1)
  }

  const handleKnown = () => {
    setFlag(true)
    setRemember(true)
  }

  const handleUnknown = () => {
    setFlag(true)
    setRemember(false)
  }

  const handleReviewNext = () => {
    const updatedList = list.map((item, index) => {
      if (index === current)
        return {
          ...item,
          remember: item.remember + 1
        }
      else return item
    })
    let nextIndex = -1
    // 从当前项的下一项开始，循环遍历整个列表
    for (let i = 1; i <= list.length; i++) {
      const index = (current + i) % list.length // 关键：用模运算实现循环查找
      if (updatedList[index].remember < 2) {
        nextIndex = index
        break
      }
    }
    if (nextIndex === -1) {
      Taro.showToast({
        title: '本组复习已完成',
        icon: 'none'
      })
      return
    } else setCurrent(nextIndex)
    setList(updatedList)
    setFlag(false)
    setRemember(false)
  }

  const handleReviewError = () => {
    setFlag(false)
    setRemember(false)
    let nextIndex = -1
    // 从当前项的下一项开始，循环遍历整个列表
    for (let i = 1; i <= list.length; i++) {
      const index = (current + i) % list.length // 关键：用模运算实现循环查找
      if (list[index].remember < 2) {
        nextIndex = index
        break
      }
    }
    setCurrent(nextIndex)
  }

  useLoad(() => {
    setList(
      N4.map((item) => ({
        ...item,
        remember: 0
      }))
    )
  })

  return (
    <View className={`index ${isDarkMode ? 'dark-mode' : ''}`}>
      <View className="grammar-container">
        {/* Title Section */}
        <View className="grammar-title">
          <Text className="title-text">{list[current]?.title}</Text>
        </View>
        {(mode === 'learning' || (mode === 'review' && flag)) && (
          <>
            {/* Connection Rules Section */}
            <View className="grammar-section">
              <View className="section-header">
                <Text className="section-label">接续方式</Text>
              </View>
              <View className="section-content">
                <Text className="content-text">
                  {list[current]?.connectionRules}
                </Text>
              </View>
            </View>
            {/* Meaning Section */}
            <View className="grammar-section">
              <View className="section-header">
                <Text className="section-label">含义</Text>
              </View>
              <View className="section-content">
                <Text className="content-text">{list[current]?.meaning}</Text>
              </View>
            </View>
            {/* Examples Section */}
            <View className="grammar-section">
              <View className="section-header">
                <Text className="section-label">例句</Text>
              </View>
              <View className="examples-list">
                {list[current]?.examples.map((item, index) => (
                  <View className="example-item" key={index}>
                    <Text className="example-japanese">{item.japanese}</Text>
                    <Text className="example-chinese">{item.chinese}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {mode === 'learning' && (
          <View className="navigation-buttons">
            <Button
              type="default"
              className="nav-button"
              onClick={handlePrevious}
            >
              上一个
            </Button>
            <Button type="primary" className="nav-button" onClick={handleNext}>
              下一个
            </Button>
          </View>
        )}
        {mode === 'review' && !flag && (
          <View className="navigation-buttons">
            <Button type="primary" className="nav-button" onClick={handleKnown}>
              认识
            </Button>
            <Button className="nav-button" onClick={handleUnknown}>
              模糊
            </Button>
          </View>
        )}
        {mode === 'review' && flag && (
          <View className="navigation-buttons">
            <Button
              type="primary"
              className="nav-button"
              onClick={handleReviewNext}
            >
              下一个
            </Button>
            {remember && (
              <Button className="nav-button" onClick={handleReviewError}>
                记错了
              </Button>
            )}
          </View>
        )}
      </View>
    </View>
  )
}
