import IFindAllStatusAPI from '../interfaces/IFindAllStatusAPI'
import IStatus from '../interfaces/IStatus'

const URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/statuses`

const findAllStatusAPI = async (
  values: IFindAllStatusAPI
): Promise<IStatus[]> => {
  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${values.token}`,
    },
  })

  return response.json()
}

export default {
  findAllStatusAPI,
}
