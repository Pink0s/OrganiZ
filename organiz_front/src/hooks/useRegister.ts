import { useMutation } from "@tanstack/react-query";
import React from "react";
import IError from "../interfaces/IError";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthenticationService from "../services/authenticationService";
import { useNavigate } from "react-router";
import IRegisterAPI from "../interfaces/IRegisterAPI";

export const useRegister = () => {
    const [isError, setIsError] = React.useState(false);
    const [errorContent, setErrorContent] = React.useState<IError>({errors: [], title : ''});
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: (values: IRegisterAPI) => {
            return AuthenticationService.register(values);
        },
        onSuccess: async (data) => {
            if (data.status === 201) {             
                await navigate("/login")
            } else {
                setIsError(true);
                setErrorContent({title: "Connection error", errors: ['Bad username or password']});
                setTimeout(() => {
                    setIsError(false);
                }, 6000);
            }
        }
    })

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            firstname: Yup.string()
                .required('Firstname is required')
                .min(1, 'Firstname must be at least 1 character')
                .max(25, 'Firstname must be at most 25 characters'),
            lastname: Yup.string()
                .required('Lastname is required')
                .min(1, 'Lastname must be at least 1 character')
                .max(25, 'Lastname must be at most 25 characters'),
            email: Yup.string()
                .required('Email is required')
                .email('Invalid email format')
                .min(1, 'Email must be at least 1 character')
                .max(35, 'Email must be at most 35 characters'),
            password: Yup.string()
                .required('Password is required')
                .min(14, 'Password must be at least 14 characters long')
                .max(80, 'Password must be at most 80 characters long')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-]).{14,}$/,
                    'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
                ),
        }),
        onSubmit: (values) => {
            mutation.mutate(values)
        }
    })

    return {
        formik,
        isError,
        errorContent
      }
    
}
