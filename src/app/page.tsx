'use client'
import {getAccessTokenValidation, postRefreshToken} from '@/lib/api/services/user-api';
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import { AxiosError } from 'axios';
import { toast } from '@/lib/toast';

export default function Home() {
  const router = useRouter();

  // 로그인 여부 체크
  useEffect(() => {
    tokenValidation();
  }, []);

  const tokenValidation = async () => {
    try {
      console.log('process.env.NEXT_PUBLIC_API_BASE_URL : ', process.env.NEXT_PUBLIC_API_BASE_URL);
      const response = await getAccessTokenValidation();
      if (response.data.resCode === '0000') {
        // 메인 페이지로 이동
        router.replace('/chat/list');
      } else {
        // 로그인 페이지로 이동
        router.replace('/login');
      }
    } catch (error) {
      // 로그인 페이지로 이동
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        toast.error('다시 로그인 해주세요.');
        try {
          const response = await postRefreshToken();
          localStorage.setItem('accesstoken', response.data.body.accesstoken);
          localStorage.setItem('refreshtoken', response.data.body.refreshtoken);

          router.replace('/chat/list');
        } catch (error) {
          router.replace('/login');
        }
      } else {
        console.error('API Error:', axiosError);
      }
    }
  }
  return <div></div>;
}
