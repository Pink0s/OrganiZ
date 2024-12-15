import IFindAllProjectsAPI from "../interfaces/IFindAllProjectsAPI";
import IProject from "../interfaces/IProject";

const URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/projects`

const createAPI = () => {}

const findAllProjectsAPI = async (values: IFindAllProjectsAPI): Promise<IProject[]> => {
    
    let FINAL_URL = `${URL}`

    if(values.category) {
        FINAL_URL = `${URL}?category=${values.category}`
    }

    const response = await fetch(FINAL_URL, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${values.token}`
        }
    })

    return response.json()
}

const findOneByIdAPI = () => {}
const udpateByIdAPI = () => {}
const deleteByIdAPI = () => {}
const AddUserAPI = () => {}

export default {
    createAPI,
    findAllProjectsAPI,
    findOneByIdAPI,
    udpateByIdAPI,
    deleteByIdAPI,
    AddUserAPI
}