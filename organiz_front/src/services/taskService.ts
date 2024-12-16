import ICreateTaskAPI from "../interfaces/ICreateTaskAPI";
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

const createTaskAPI = async (values: ICreateTaskAPI) => {
    return fetch(URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${values.token}`,
        },
        body: JSON.stringify({
            name: values.name,
            description: values.description,
            projectId: values.projectId
        }),
      })
} 

export default {
    findAllTasksAPI,
    createTaskAPI
}