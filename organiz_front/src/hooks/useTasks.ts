import { useMutation, useQuery } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import taskService from "../services/taskService"
import React from "react"
import IError from "../interfaces/IError"
import { useNavigate } from "react-router"
import ICreateTaskAPI from "../interfaces/ICreateTaskAPI"
import { useFormik } from "formik"
import * as Yup from "yup"

export const useTasks = ({projectId}: {projectId: string}) => {
  const { token } = useAuth()
  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.findAllTasksAPI({ token: token!!, projectId: projectId }),
  })
  return { data, isError, error, isLoading, isSuccess }
}


export const useCreateTask = ({projectId}:{projectId: number}) => {
    const [isError, setIsError] = React.useState(false)
    const [errorContent, setErrorContent] = React.useState<IError>({
      errors: [],
      title: '',
    })
    const navigate = useNavigate()
    const { token } = useAuth()
  
    const mutation = useMutation({
      mutationFn: (values: ICreateTaskAPI) => {
        return taskService.createTaskAPI(values)
      },
      onSuccess: async (data) => {
        if (data.status === 201) {
          await navigate(`/projects/${projectId}`)
        } else {
          setIsError(true)
          const result = await data.json()
          console.log(result)
          setErrorContent({
            title: 'Error while creating task',
            errors: [result.reason],
          })
          setTimeout(() => {
            setIsError(false)
          }, 6000)
        }
      },
    })
  
    const formik = useFormik({
      initialValues: {
        name: '',
        description: ''
      },
      validationSchema: Yup.object({
        name: Yup.string()
          .required('Task name is required')
          .min(1, 'Task must be at least 1 character')
          .max(35, 'Task must be at most 35 characters'),
        description: Yup.string().required('Task description is required'),
      }),
      onSubmit: (values) => {

        const data: ICreateTaskAPI = {
            token: token!!,
            projectId: projectId,
            name: values.name,
            description: values.description
        }
  
        mutation.mutate(data)
      },
    })
  
    return {
      formik,
      isError,
      errorContent,
    }
  }