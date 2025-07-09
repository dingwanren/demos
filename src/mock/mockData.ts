// mockData.ts
import type { ListItem } from './types'

/**
 * 生成虚拟列表的 mock 数据
 * @param count 生成的数据条数
 * @param options 配置项
 * @returns ListItem[]
 */
export function generateMockList(
  count: number,
  options?: {
    withImages?: boolean
    maxDescriptionLength?: number
    pinnedItems?: number
  }
): ListItem[] {
  const {
    withImages = true,
    maxDescriptionLength = 200,
    pinnedItems = 0
  } = options || {}

  // 随机文本生成
  const titles = [
    'Vue 3 新特性解析',
    'TypeScript 高级技巧',
    '前端性能优化指南',
    '如何实现虚拟列表',
    'React vs Vue 对比',
    'Webpack 配置详解',
    'Node.js 最佳实践',
    'CSS 布局完全指南'
  ]

  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

  const mockImages = [
    'https://picsum.photos/200/300?random=1',
    'https://picsum.photos/200/300?random=2',
    'https://picsum.photos/200/300?random=3',
    'https://picsum.photos/200/300?random=4',
    'https://picsum.photos/200/300?random=5'
  ]

  return Array.from({ length: count }, (_, i) => {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    const descriptionLength = Math.floor(Math.random() * maxDescriptionLength) + 50
    const randomDescription = lorem.repeat(5).substring(0, descriptionLength)
    
    const item: ListItem = {
      id: `item-${i}`,
      title: `${randomTitle} #${i + 1}`,
      description: randomDescription,
      image: withImages ? mockImages[Math.floor(Math.random() * mockImages.length)] : '',
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
    }

    // 前几项设置为置顶
    if (i < pinnedItems) {
      item.isPinned = true
    }

    return item
  })
}

// 使用示例
// const bigList = generateMockList(1000, { withImages: true, pinnedItems: 3 })