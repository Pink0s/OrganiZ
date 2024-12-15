import { useQuery } from "@tanstack/react-query";
import categoriesService from "../services/categoriesService";
import { useAuth } from "./useAuth";

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
