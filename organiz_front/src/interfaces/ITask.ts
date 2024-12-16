import IStatus from './IStatus'

export default interface ITask {
  name: string
  description: string
  status: IStatus
  id: string
  createdAt: string
  updatedAt: string
}
