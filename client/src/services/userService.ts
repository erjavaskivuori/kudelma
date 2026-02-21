import apiClient from "../utils/apiClient";

export type User = {
  id: string;
  name: string;
  email?: string;
};

export const registerUser = async (
  name: string,
  email: string | undefined,
  password: string
): Promise<User> => {
  const response = await apiClient.post<User>(
    '/auth/register', { name, email, password }
  );
  return response.data;
};

export const loginUser = async (name: string, password: string): Promise<User> => {
  const response = await apiClient.post<User>(
    '/auth/login', { name, password }
  );
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const refreshAccessToken = async (): Promise<void> => {
  await apiClient.post('/auth/refresh');
};
