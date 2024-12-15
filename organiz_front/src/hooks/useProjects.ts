import { useMutation, useQuery } from "@tanstack/react-query";
import projectsService from "../services/projectsService";
import { useAuth } from "./useAuth";
import React from "react";
import IError from "../interfaces/IError";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import ICreateProjectAPI from "../interfaces/ICreateProjectAPI";
import { useFormik } from "formik";
import ICreateProject from "../interfaces/ICreateProject";
import { useCategories } from "./useCategories";

export const useProjects = ({category}: {category?: string}) => {
    const {token} = useAuth()
    const { data, isError, error, isLoading, isSuccess } = useQuery(
        {
            queryKey: ['projects'],
            queryFn: () => projectsService.findAllProjectsAPI({category: category, token: token!!})
        }
    );
    
    return {data, isError, error, isLoading, isSuccess};
}


export const useCreateProject = () => {
    const [isError, setIsError] = React.useState(false);
    const [errorContent, setErrorContent] = React.useState<IError>({errors: [], title : ''});
    const navigate = useNavigate();
    const {token} = useAuth();

    const useCategoriesHooks = useCategories()
    

    
    const mutation = useMutation({
        mutationFn: (values: ICreateProjectAPI) => {
            return projectsService.createProjectAPI(values);
        },
        onSuccess: async (data) => {
            if (data.status === 201) {
                await navigate("/projects");
            } else {
                setIsError(true);
                const result = await data.json();
                setErrorContent({title: "Error while creating project", errors: [result.reason]});
                setTimeout(() => {
                    setIsError(false);
                }, 6000);
            }
        }
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            categories: [] as number[], // Initialize categories as an empty array
        },
        validationSchema: Yup.object({
            name: Yup
                .string()
                .required('Project name is required')
                .min(1, 'Project name must be at least 1 character')
                .max(25, 'Project name must be at most 55 characters'),
            description: Yup.string(),
            categories: Yup.array()
                .of(Yup.number())
                .required('At least one category is required')
        }),
        onSubmit: (values) => {
            const newProject: ICreateProject = {
                name: values.name,
                description: values.description,
                categories: values.categories, // Include selected categories
            };

            const data: ICreateProjectAPI = {
                token: token!!,
                newProject: newProject
            };

            mutation.mutate(data);
        }
    });

    return {
        formik,
        isError,
        errorContent,
        useCategoriesHooks
    };
};
