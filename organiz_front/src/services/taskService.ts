import IFindAllTasksAPI from "../interfaces/IFindAllTasksAPI";
import ITask from "../interfaces/ITask";

const URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks`



const findAllTasksAPI = async (values: IFindAllTasksAPI) : Promise<ITask[]> => {
    const response = await fetch(`${URL}?projectId=${values.projectId}`, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${values.token}`,
        }
    })

    return response.json()
}

export default {
    findAllTasksAPI
}