import ICreateCategory from "./ICreateCategory";

export default interface ICreateCategoryAPI {
    token: string;
    newCategory: ICreateCategory;    
}