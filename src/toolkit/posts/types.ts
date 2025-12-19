export interface Post {
  _id: string
  title: string
  content: string
  categories: string[]
  link?: string
  date: Date
}
