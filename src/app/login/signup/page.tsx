'use client';

import { useState } from 'react';
import {postSignup} from "@/lib/api/services/user-api";
import {AxiosError} from "axios";
import {toast} from "@/lib/toast";
import {useRouter} from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    nickname: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nickname || !form.phone || !form.password) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    // 실제 API 연동은 이곳에 추가
    try {
      const response = await postSignup(
        form.phone,
        form.password,
        form.nickname,
      );

      if (response.data.resCode === '0000') {
        router.push('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring focus:ring-blue-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="핸드폰 번호"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-amber-300 text-white py-3 rounded-2xl transition"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}
