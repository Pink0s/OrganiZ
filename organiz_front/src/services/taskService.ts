import ICreateTaskAPI from '../interfaces/ICreateTaskAPI'
import IFindAllTasksAPI from '../interfaces/IFindAllTasksAPI'
import { IModifyTaskAPI } from '../interfaces/IModifyTaskAPI'
import ITask from '../interfaces/ITask'

const URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks`

const findAllTasksAPI = async (values: IFindAllTasksAPI): Promise<ITask[]> => {
  const response = await fetch(`${URL}?projectId=${values.projectId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
  })

  return response.json()
}

const findATaskByIdAPI = async (values: {
  id: number
  token: string
}): Promise<ITask> => {
  const response = await fetch(`${URL}/${values.id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
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
      projectId: values.projectId,
    }),
  })
}

const updateTaskAPI = (values: IModifyTaskAPI) => {
  return fetch(`${URL}/${values.taskId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
    body: JSON.stringify({
      name: values.name,
      description: values.description,
      statusId: values.statusId,
    }),
  })
}

export default {
  findAllTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  findATaskByIdAPI,
}
