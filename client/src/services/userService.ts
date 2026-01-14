import apiClient from "../utils/apiClient";

type RegisterUserResponse = {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
};

export const registerUser = async (name:string, email: string | undefined, password: string) => {
  const response = await apiClient.post<RegisterUserResponse>(
    '/auth/register', { name, email, password }
  );
  return response.data;
};
