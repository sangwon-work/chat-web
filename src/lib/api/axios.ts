// lib/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {postRefreshToken} from "@/lib/api/services/user-api";

let isRefreshing = false;
let refreshQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

// Access Token 저장소 → localStorage
function getAccessToken() {
  return typeof window !== "undefined" ? localStorage.getItem("accesstoken") : null;
}

function setAccessToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("accesstoken", token);
  }
}

function clearAccessToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accesstoken");
  }
}

// Refresh API → RT는 쿠키에서 자동 전송됨
async function refreshAccessToken(): Promise<string> {
  const response = await postRefreshToken();
  const newAT = response.data?.body?.accesstoken ?? response.data?.accesstoken;
  if (!newAT) throw new Error("No access token in refresh response");
  setAccessToken(newAT);
  return newAT;
}


function attachAuthHeader(config: AxiosRequestConfig) {
  const at = getAccessToken();
  if (at) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${at}` };
  }
  return config;
}

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // .env.local에서 관리
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송
});

// 요청 인터셉터 (예: 인증 토큰 자동 첨부)
// @ts-expect-error: 라이브러리 타입 정의 오류 (임시 우회)
authInstance.interceptors.request.use((config) => attachAuthHeader(config));

// 응답 인터셉터: 401 → refresh 후 재시도
authInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!error.response) throw error;
    const status = error.response.status;

    if (status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: () => {
              try {
                const cfg = attachAuthHeader(originalConfig);
                resolve(authInstance(cfg));
              } catch (e) {
                reject(e);
              }
            },
            reject,
            config: originalConfig,
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();

        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];

        return authInstance(attachAuthHeader(originalConfig));
      } catch (refreshErr) {
        refreshQueue.forEach(({ reject }) => reject(refreshErr));
        refreshQueue = [];
        clearAccessToken();
        // 필요 시 → window.location.href = "/login";
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export const refreshAuthInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // .env.local에서 관리
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송
});

refreshAuthInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
refreshAuthInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    return Promise.reject(error);
  }
);


// 👉 인터셉터 없는 인스턴스 (토큰 없이 요청)
const unAuthInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 인터셉터
unAuthInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    return Promise.reject(error);
  }
);

const instance = {
  authInstance, unAuthInstance
}

export default instance;
