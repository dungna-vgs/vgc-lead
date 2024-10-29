import axios, { AxiosResponse } from "axios";

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT!!,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data;
  },
  async function (error) {
    return Promise.reject(error.response);
  },
);

class HttpClient {
  get<T>(endpoint: string, query?: any, headers?: any): Promise<T> {
    return Axios.get(endpoint, { params: query, headers });
  }
  post<T>(endpoint: string, body: any, query?: any): Promise<T> {
    return Axios.post(endpoint, body, { params: query });
  }
  put<T>(endpoint: string, body: any): Promise<T> {
    return Axios.put(endpoint, body);
  }
  delete<T>(endpoint: string, body: any, query?: any): Promise<T> {
    return Axios.delete(endpoint, { data: body, params: query });
  }
}

export const api = new HttpClient();

export const CLOUD_URL = process.env.NEXT_PUBLIC_CLOUD_API_ENDPOINT || 'https://cloud.vgcorp.vn';

export const BUSINESS_URL = process.env.NEXT_PUBLIC_BUSINESS_API_ENDPOINT || 'https://business.vgcorp.vn';