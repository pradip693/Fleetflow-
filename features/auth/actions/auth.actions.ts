import { API_ENDPOINTS } from "@/api/endpoints";
import usePostData from "@/api/hooks/use-post-data";
import { LoginInput } from "../schemas/login.schema";

export const useLogin = () => {
  return usePostData<LoginInput, any>({
    url: API_ENDPOINTS.AUTH.LOGIN,
  });
};
