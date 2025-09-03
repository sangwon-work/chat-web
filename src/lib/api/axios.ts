// lib/axios.ts
import axios from 'axios';

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // .env.local에서 관리
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송
});

// 요청 인터셉터 (예: 인증 토큰 자동 첨부)
authInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accesstoken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
authInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    return Promise.reject(error);
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

export default {authInstance, unAuthInstance};
