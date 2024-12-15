import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoriesService from "../services/categoriesService";
import { useAuth } from "./useAuth";
import React from "react";
import IError from "../interfaces/IError";
import { useNavigate } from "react-router";
import ICreateCategoryAPI from "../interfaces/ICreateCategoryAPI";
import { useFormik } from "formik";
import * as Yup from "yup";
import ICreateCategory from "../interfaces/ICreateCategory";
import IUpdateCategoryAPI from "../interfaces/IUpdateCategoryAPI";
import IUpdatedCategory from "../interfaces/IUpdatedCategory";
import IDeleteCategoryAPI from "../interfaces/IDeleteCategoryAPI";

export const useCategories = () => {
    const {token} = useAuth();
    const { data, isError, error, isLoading, isSuccess } = useQuery(
        
        {
            queryKey: ['categories'],
            queryFn: () => categoriesService.findAll({token: token!!})
        }
    );
    
    return {data, isError, error, isLoading, isSuccess};
}

export const useCreateCategory = () => {
    const [isError, setIsError] = React.useState(false);
    const [errorContent, setErrorContent] = React.useState<IError>({errors: [], title : ''});
    const navigate = useNavigate()
    const {token} = useAuth()

    const mutation = useMutation({
        mutationFn: (values: ICreateCategoryAPI) => {
            return categoriesService.create(values);
        },
        onSuccess: async (data) => {
            if (data.status === 201) {
                await navigate("/categories")
            } else {
                setIsError(true);
                const result = await data.json()
                console.log(result)
                setErrorContent({title: "Error while creating category", errors: [result.reason]});
                setTimeout(() => {
                    setIsError(false);
                }, 6000);
            }
        }
    })

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: Yup.object({
            name: Yup
                    .string()
                    .required('Category name is required')
                    .min(1, 'Category must be at least 1 character')
                    .max(25, 'Category must be at most 35 characters')
        }),
        onSubmit: (values) => {
            const newCategory: ICreateCategory = { name: values.name };
            
            const data: ICreateCategoryAPI = {
                token: token!!,
                newCategory: newCategory
            }
            
            mutation.mutate(data)
        }
    })

    return {
        formik,
        isError,
        errorContent
      }

}

export const useCategory = (categoryId: string) => {
    const {token} = useAuth()

    const { data, isError, error, isLoading, isSuccess } = useQuery(
        {
            queryKey: ['category', categoryId],
            queryFn: () => categoriesService.findOneById({ token: token!, id: categoryId})
        }
    );
    
    return {data, isError, error, isLoading, isSuccess};
}

export const useModifyCategory = (categoryId: string, category: any, success: boolean) => {
    const auth = useAuth();
    const [isError, setIsError] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState<string[]>([]);
    const navigate = useNavigate()
    
    const mutation = useMutation({
    mutationFn: (request: IUpdateCategoryAPI) => {
        return categoriesService.modifyById(request);
    },
  
    onSuccess: (data) => {
        if (data.status === 200) {
            setIsSuccess(true)
            navigate("/categories")
        } else if (data.status === 401) {
            setError(["Unhautorized"]);
            setIsError(true)
            setTimeout(() => {
                setIsError(false)
                setError([]);
            }, 6000)
        } else {
            setError(["Unexpected server error"]);
            setIsError(true)
            setTimeout(() => {
                setIsError(false)
                setError([]);
            }, 6000)
        }
    },})
  
    const validationSchema = Yup.object({
        name: Yup
                .string()
                .required('Category name is required')
                .min(1, 'Category must be at least 1 character')
                .max(25, 'Category must be at most 35 characters')
    })
  
    const formik = useFormik({
        initialValues: {
            name: success ? category.name : "",
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            const updatedCategory : IUpdatedCategory = { name: values.name }
            const request: IUpdateCategoryAPI = { 
                token: auth.token!!,
                id: categoryId,
                modifiedCategory: updatedCategory 
            }
            
            if(updatedCategory.name === category) {
                setError(["No changes detected"]);
                setIsError(true)
                setTimeout(() => {
                    setIsError(false)
                    setError([]);
                }, 6000)
            } else {
                mutation.mutate(request)
            }
        },
        enableReinitialize: true
    
    });
    
    return { formik, isError, isSuccess, error};
  }



export const useDeleteCategory = () => {
    const { token } = useAuth();
    const [error, setError] = React.useState<string[]>([]);
    const [isError, setIsError] = React.useState(false);
    const [success, setIsSuccess] = React.useState(false);
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (request: IDeleteCategoryAPI) => {
            return categoriesService.deleteById(request);
        },onSuccess: (data) => {
            if(data.status === 200) {
                setIsSuccess(true);
                queryClient.invalidateQueries({ queryKey: ['categories'] })
            } else {
                setError(["Unexpected error"])
                setIsError(true)
                setTimeout(() => {
                    setIsError(false)
                    setError([])
                }, 6000)
            }
        },}
    
    )
  
    const deleteCategory = (categoryId: string) => {
        mutation.mutate({
            token: token!!, id: categoryId
        });
    }
  
    return {deleteCategory, success, error, isError} 
  }
  