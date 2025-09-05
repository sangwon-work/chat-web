// app/chat/page.tsx (Next.js 13/14 App Router 기준 예시)
'use client';
import {useEffect, useState} from 'react';
import {postLogin} from "@/lib/api/services/user-api";
import { toast } from '@/lib/toast';
import { AxiosError } from 'axios';
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState('');
  const [isSavePhone, setIsSavePhone] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setPhone(localStorage.getItem('phone') || '');
    setIsSavePhone(localStorage.getItem('isSavePhone') === 'true');
  }, [])

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('핸드폰 번호와 비밀번호를 입력해주세요.');
      return;
    }
    setError('');
    // 로그인 처리 로직 (API 호출 등)

    try {
      const response = await postLogin(phone, password);
      if (response.data.resCode === '0000') {
        localStorage.setItem('accesstoken', response.data.body.accesstoken);
        if (isSavePhone) {
          localStorage.setItem('phone', phone);
        } else {
          localStorage.removeItem('phone');
        }
        localStorage.setItem('isSavePhone', isSavePhone.toString());
        router.replace('/friend/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        toast.error(axiosError.message);
        router.replace('/login');
      } else {
        console.error('API Error:', axiosError);
      }
    }
  };

  const handleSignupPage = () => {
    router.push('/login/signup');
  }

  const handleSavePhone = () => {
    setIsSavePhone(!isSavePhone);
  }

  return (
    <div className='w-screen flex items-center justify-center'>
      <div className="w-full max-w-md bg-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-6">로그인</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">📱 핸드폰 번호</label>
          <input
            type="tel"
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">🔒 비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-amber-300 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          로그인
        </button>
        <div className="flex items-center mt-4 gap-3">
          <input type='checkbox' checked={isSavePhone} onChange={handleSavePhone} className="w-4 h-4 text-amber-300 border-gray-300 rounded focus:ring-amber-300" />
          <p>전화번호 저장하기</p>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-600">아직 계정이 없으신가요?</span>
          <br />
          <button
            onClick={handleSignupPage}
            className="mt-2 inline-block text-amber-300 hover:underline text-sm font-medium"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
