import { useQuery } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import taskService from "../services/taskService"

export const useTasks = ({projectId}: {projectId: string}) => {
  const { token } = useAuth()
  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.findAllTasksAPI({ token: token!!, projectId: projectId }),
  })
  return { data, isError, error, isLoading, isSuccess }
}