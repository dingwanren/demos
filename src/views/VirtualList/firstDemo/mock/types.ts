// types.ts
export interface ListItem {
  id: string
  title: string
  description: string
  image: string
  likes: number
  comments: number
  isPinned?: boolean
  createdAt: Date
}