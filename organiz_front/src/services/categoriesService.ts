import ICreateCategoryAPI from "../interfaces/ICreateCategoryAPI"
import IDeleteCategoryAPI from "../interfaces/IDeleteCategoryAPI"
import IFindAllCategoriesAPI from "../interfaces/IFindAllCategoriesAPI"
import IFindOneCategoryByIdAPI from "../interfaces/IFindOneCategoryByIdAPI"
import IUpdateCategoryAPI from "../interfaces/IUpdateCategoryAPI"

const URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/categories`

const create = ({token, newCategory} : ICreateCategoryAPI) => {
    return fetch(URL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
    })
}

const findAll = ({token}: IFindAllCategoriesAPI) => {
    return fetch(URL, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

const findOneById = ({token, id}: IFindOneCategoryByIdAPI) => {
    return fetch(`${URL}/${id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

const modifyById = ({token, id, modifiedCategory}: IUpdateCategoryAPI) => {
    return fetch(`${URL}/${id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(modifiedCategory)
    })
}

const deleteById = ({token, id}: IDeleteCategoryAPI) => {
    return fetch(`${URL}/${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export default {create, findAll, findOneById, modifyById, deleteById}