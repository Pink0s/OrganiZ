import IUpdatedCategory from "./IUpdatedCategory";

export default interface IUpdateCategoryAPI {
    token: string;
    id: number
    modifiedCategory: IUpdatedCategory;    
}