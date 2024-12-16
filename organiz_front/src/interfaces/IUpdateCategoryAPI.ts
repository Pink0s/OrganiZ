import IUpdatedCategory from './IUpdatedCategory'

export default interface IUpdateCategoryAPI {
  token: string
  id: string
  modifiedCategory: IUpdatedCategory
}
