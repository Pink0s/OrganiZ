import { useMutation, useQuery } from "@tanstack/react-query";
import categoriesService from "../services/categoriesService";
import { useAuth } from "./useAuth";
import React from "react";
import IError from "../interfaces/IError";
import { useNavigate } from "react-router";
import ICreateCategoryAPI from "../interfaces/ICreateCategoryAPI";
import { useFormik } from "formik";
import * as Yup from "yup";
import ICreateCategory from "../interfaces/ICreateCategory";

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
