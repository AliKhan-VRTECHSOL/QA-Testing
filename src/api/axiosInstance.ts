import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { OverlayContextType } from '../context/OverlayContext';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
}

let overlayContext: OverlayContextType | null = null;
export const setOverlayContext = (context: OverlayContextType) => {
  overlayContext = context;
};

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// Store interval ref for fake progress
let fakeProgressInterval: NodeJS.Timeout | null = null;

// Fake progress for non-file requests
const startFakeProgress = () => {
  overlayContext?.setProgress(10);
  fakeProgressInterval = setInterval(() => {
    overlayContext?.setProgress(prev => {
      if (typeof prev === 'number' && prev < 90) {
        return Math.min(prev + Math.random() * 10, 90);
      }
      return prev;
    });
  }, 200);
};

const stopFakeProgress = () => {
  if (fakeProgressInterval) {
    clearInterval(fakeProgressInterval);
    fakeProgressInterval = null;
  }
  overlayContext?.setProgress(100);
  setTimeout(() => {
    overlayContext?.setShowLoading(false);
    overlayContext?.setProgress(0);
  }, 200);
};

// Real byte progress for uploads/downloads
const handleProgress = (event: ProgressEvent) => {
  if (overlayContext && event.total && event.total > 0) {
    const loaded = Math.min(event.loaded, event.total);
    const percent = Math.round((loaded * 100) / event.total);
    overlayContext.setProgress(Math.min(Math.max(percent, 0), 100));
  }
};

axiosInstance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  const shouldShowLoading = config.showLoading !== false;

  if (overlayContext && shouldShowLoading) {
    overlayContext.setShowLoading(true);
    overlayContext.setProgress(0);
  }

  if (shouldShowLoading) {
    // If it's a file upload/download, attach real progress
    if (config.onUploadProgress || config.onDownloadProgress) {
      config.onDownloadProgress = handleProgress;
      config.onUploadProgress = handleProgress;
    } else {
      // Otherwise, start fake progress
      startFakeProgress();
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomAxiosRequestConfig;

    if (overlayContext && config.showLoading !== false) {
      if (!config.onUploadProgress && !config.onDownloadProgress) {
        // Non-file → stop fake progress
        stopFakeProgress();
      } else {
        // File requests → finish with real progress
        overlayContext.setProgress(100);
        setTimeout(() => {
          overlayContext?.setShowLoading(false);
          overlayContext?.setProgress(0);
        }, 200);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig;
    console.log('errororororro', error?.message ?? 'Unknown error');

    if (overlayContext && config?.showLoading !== false) {
      if (!config?.onUploadProgress && !config?.onDownloadProgress) {
        stopFakeProgress();
      } else {
        overlayContext.setShowLoading(false);
        overlayContext.setProgress(0);
      }
    }

    // 🔐 Always reject with a proper error object
    return Promise.reject(error instanceof Error ? error : new Error(JSON.stringify(error)));
  },
);

export default axiosInstance;
