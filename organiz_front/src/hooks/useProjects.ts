import { useMutation, useQuery } from '@tanstack/react-query'
import projectsService from '../services/projectsService'
import { useAuth } from './useAuth'
import React from 'react'
import IError from '../interfaces/IError'
import { useNavigate } from 'react-router'
import * as Yup from 'yup'
import ICreateProjectAPI from '../interfaces/ICreateProjectAPI'
import { useFormik } from 'formik'
import ICreateProject from '../interfaces/ICreateProject'
import { useCategories } from './useCategories'
import IDeleteProjectByIdAPI from '../interfaces/IDeleteProjectByIdAPI'

export const useProjects = ({ category }: { category?: string }) => {
  const { token } = useAuth()
  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      projectsService.findAllProjectsAPI({
        category: category,
        token: token!!,
      }),
  })

  return { data, isError, error, isLoading, isSuccess }
}

export const useCreateProject = () => {
  const [isError, setIsError] = React.useState(false)
  const [errorContent, setErrorContent] = React.useState<IError>({
    errors: [],
    title: '',
  })
  const navigate = useNavigate()
  const { token } = useAuth()

  const useCategoriesHooks = useCategories()

  const mutation = useMutation({
    mutationFn: (values: ICreateProjectAPI) => {
      return projectsService.createProjectAPI(values)
    },
    onSuccess: async (data) => {
      if (data.status === 201) {
        await navigate('/projects')
      } else {
        setIsError(true)
        const result = await data.json()
        setErrorContent({
          title: 'Error while creating project',
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
      description: '',
      categories: [] as number[],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Project name is required')
        .min(1, 'Project name must be at least 1 character')
        .max(25, 'Project name must be at most 55 characters'),
      description: Yup.string(),
      categories: Yup.array()
        .of(Yup.number())
        .required('At least one category is required'),
    }),
    onSubmit: (values) => {
      const newProject: ICreateProject = {
        name: values.name,
        description: values.description,
        categories: values.categories,
      }

      const data: ICreateProjectAPI = {
        token: token!!,
        newProject: newProject,
      }

      mutation.mutate(data)
    },
  })

  return {
    formik,
    isError,
    errorContent,
    useCategoriesHooks,
  }
}

export const useProject = ({ id }: { id: string }) => {
  const { token } = useAuth()
  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsService.findOneByIdAPI({ id: id, token: token!! }),
  })

  return { data, isError, error, isLoading, isSuccess }
}

export const useDeleteProject = () => {
  const { token } = useAuth()
  const [error, setError] = React.useState<string[]>([])
  const [isError, setIsError] = React.useState(false)
  const [success, setIsSuccess] = React.useState(false)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (request: IDeleteProjectByIdAPI) => {
      return projectsService.deleteProjectByIdAPI(request)
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        setIsSuccess(true)
        navigate('/projects')
      } else {
        setError(['Unexpected error'])
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
          setError([])
        }, 6000)
      }
    },
  })

  const deleteProject = (projectId: string) => {
    mutation.mutate({
      token: token!!,
      id: projectId,
    })
  }

  return { deleteProject, success, error, isError }
}

export const useUpdateProject = (initialData: any) => {
  const { token } = useAuth()
  const [error, setError] = React.useState<string[]>([])
  const [isError, setIsError] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const mutation = useMutation({
    mutationFn: (values: { id: string; updatedProject: any }) => {
      return projectsService.updateByIdAPI({
        id: values.id,
        updatedProject: values.updatedProject,
        token: token!!,
      })
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        setIsSuccess(true)
      } else {
        setError(['Unexpected error occurred'])
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
          setError([])
        }, 6000)
      }
    },
    onError: (err: any) => {
      setError([err.message || 'Failed to update the project'])
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
        setError([])
      }, 6000)
    },
  })

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      categories: initialData?.categories?.map((cat: any) => cat.id) || [],
      status: initialData?.status?.id || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Project name is required')
        .min(1, 'Project name must be at least 1 character')
        .max(55, 'Project name must be at most 55 characters'),
      description: Yup.string(),
      categories: Yup.array().of(Yup.number()),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: (values) => {
      mutation.mutate({
        id: initialData?.id,
        updatedProject: {
          ...values,
          status: Number(values.status),
        },
      })
    },
  })

  return {
    formik,
    isError,
    error,
    isSuccess,
  }
}
