import axiosInstance from './axiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Default API call with loading screen (enabled by default)
 * Automatically sets showLoading = true
 */
export const apiCall = async <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return axiosInstance.request<T>({
    ...config,
    showLoading: true, // ensures loading screen is shown
  });
};

/**
 * Silent API call (no loading screen)
 * Automatically sets showLoading = false
 */
export const silentApiCall = async <T = any>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return axiosInstance.request<T>({
    ...config,
    showLoading: false, // disables loading screen
  });
};
