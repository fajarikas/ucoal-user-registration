import { AxiosResponse, isAxiosError } from "axios";
import { baseAxios } from "./base-axios";
import {
  User,
  RegisterPayload,
  RegisterResponse,
  UsersResponse,
  SmtpInfo,
  ApiErrorResponse,
} from "../types/user";

export const getUsers = async (): Promise<UsersResponse> => {
  try {
    const response: AxiosResponse<UsersResponse> = await baseAxios.get("/api/users");
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorResponse>(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Gagal mengambil data user");
  }
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const response: AxiosResponse<RegisterResponse> = await baseAxios.post(
      "/api/register",
      payload
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorResponse>(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Gagal melakukan pendaftaran");
  }
};

export const getSmtpInfo = async (): Promise<SmtpInfo> => {
  try {
    const response: AxiosResponse<SmtpInfo> = await baseAxios.get("/api/smtp-info");
    return response.data;
  } catch (error) {
    if (isAxiosError<ApiErrorResponse>(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Gagal mengambil informasi SMTP");
  }
};
