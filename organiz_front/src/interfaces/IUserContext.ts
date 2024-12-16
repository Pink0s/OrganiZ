import IUser from './IUser'

export default interface IUserContext {
  user?: IUser
  token?: string
  login?: (token_payload: string) => void
  logout?: () => void
}
