import { useQuery } from '@tanstack/react-query'
import statusService from '../services/statusService'
import { useAuth } from './useAuth'

export const useStatus = () => {
  const { token } = useAuth()
  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['status'],
    queryFn: () => statusService.findAllStatusAPI({ token: token!! }),
  })

  return { data, isError, error, isLoading, isSuccess }
}
