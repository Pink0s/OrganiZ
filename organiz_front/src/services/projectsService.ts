import AddUserToProjectAPI from '../interfaces/IAddUserToProjectAPI'
import ICreateProjectAPI from '../interfaces/ICreateProjectAPI'
import IDeleteProjectByIdAPI from '../interfaces/IDeleteProjectByIdAPI'
import IFindAllProjectsAPI from '../interfaces/IFindAllProjectsAPI'
import IFindOneByIdAPI from '../interfaces/IFindOneByIdAPI'
import IProject from '../interfaces/IProject'

const URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/projects`

const createProjectAPI = (values: ICreateProjectAPI) => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
    body: JSON.stringify(values.newProject),
  })
}

const findAllProjectsAPI = async (
  values: IFindAllProjectsAPI
): Promise<IProject[]> => {
  let FINAL_URL = `${URL}`

  if (values.category) {
    FINAL_URL = `${URL}?category=${values.category}`
  }

  const response = await fetch(FINAL_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
  })

  return response.json()
}

const findOneByIdAPI = async (values: IFindOneByIdAPI): Promise<IProject> => {
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

const updateByIdAPI = (values: {
  id: string
  updatedProject: any
  token: string
}) => {
  return fetch(`${URL}/${values.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
    body: JSON.stringify(values.updatedProject),
  })
}

const deleteProjectByIdAPI = (values: IDeleteProjectByIdAPI) => {
  return fetch(`${URL}/${values.id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
  })
}

const addUserToProjectAPI = (values: AddUserToProjectAPI) => {
    return fetch(`${URL}/${values.projectId}?email=${values.email}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${values.token}`,
        }
    })
}

export default {
  createProjectAPI,
  findAllProjectsAPI,
  findOneByIdAPI,
  updateByIdAPI,
  deleteProjectByIdAPI,
  addUserToProjectAPI,
}
