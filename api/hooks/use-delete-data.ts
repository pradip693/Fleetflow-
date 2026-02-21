import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import instance from "@/api/instance";

const useDeleteData = ({
  url,
  mutationOptions = {},
}: {
  url: string;
  mutationOptions?: UseMutationOptions<any, Error, string>;
}) => {
  return useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const response = await instance.delete(`${url}${String(id)}`);

      if (response?.status === 200 || response?.data?.statusCode === 200) {
        toast.success(response?.data?.message || "Deleted successfully.");
        return response.data?.data;
      }

      throw new Error(response?.data?.message || "Failed to delete resource.");
    },
    ...mutationOptions,
    retry: false,
  });
};

export default useDeleteData;
