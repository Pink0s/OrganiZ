import { useQuery } from "@tanstack/react-query";
import projectsService from "../services/projectsService";
import { useAuth } from "./useAuth";

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