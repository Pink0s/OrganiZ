import ICategory from './ICategory'
import IProjectStatus from './IProjectStatus'

export default interface IProject {
  name: string
  description: string
  status: IProjectStatus
  categories: ICategory[]
  id: string
  createdAt: string
  updatedAt: string
}
