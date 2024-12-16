import { useMutation } from '@tanstack/react-query'
import React from 'react'
import IError from '../interfaces/IError'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AuthenticationService from '../services/authenticationService'
import ILoginAPI from '../interfaces/ILoggingAPI'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router'

export const useLogin = () => {
  const [isError, setIsError] = React.useState(false)
  const [errorContent, setErrorContent] = React.useState<IError>({
    errors: [],
    title: '',
  })
  const navigate = useNavigate()
  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: (values: ILoginAPI) => {
      return AuthenticationService.login(values)
    },
    onSuccess: async (data) => {
      if (data.status === 200) {
        const result = await data.json()
        login!(result.token)
        await navigate('/')
      } else {
        setIsError(true)
        setErrorContent({
          title: 'Connection error',
          errors: ['Bad username or password'],
        })
        setTimeout(() => {
          setIsError(false)
        }, 6000)
      }
    },
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      mutation.mutate(values)
    },
  })

  return {
    formik,
    isError,
    errorContent,
  }
}
