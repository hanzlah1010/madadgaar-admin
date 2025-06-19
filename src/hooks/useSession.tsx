import { useQuery } from "@tanstack/react-query"
import apiController from "../api/apiController"
import { AxiosError } from "axios"

export type User = {
  id: string
  name: string
  phone: string
  cnic: string
  email: string
  role: "DRIVER" | "ASSISTANT" | "OPERATOR" | "MAINTENANCE" | "ADMIN"
  profilePicture: string
  isOnline: boolean
  status: "ACTIVE" | "INACTIVE" | "ONLINE" | "OFFLINE"
}

export function useSession() {
  const { data, ...query } = useQuery<User>({
    queryKey: ["session"],
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error instanceof AxiosError && error.status === 401) {
        return false
      }
      return failureCount < 3
    },
    queryFn: async () => {
      const user = await apiController.get("/auth/profile")
      return user.data
    }
  })

  return { user: data, ...query }
}
