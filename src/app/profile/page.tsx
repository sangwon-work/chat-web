'use client'

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {MessageCircle, Pencil} from "lucide-react";
import Link from "next/link";
import {getUserInfo, getUserProfile} from "@/lib/api/services/user-api";
import {AxiosError} from "axios";
import {toast} from "@/lib/toast";
import {postCreateOneToOneChatRoom} from "@/lib/api/services/chat-api";

interface User {
  userpkey: number;
  nickname: string;
  profileimageurl: string;
}

const navItems = [
  {
    href: '/chat/list',
    icon: <MessageCircle className="w-6 h-6 color-black" />,
    label: '채팅',
  },
  {
    href: '/profile',
    icon: <Pencil className="w-6 h-6 color-black" />,
    label: '프로필 편집',
  },
];

export default function Profile() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userpkey = searchParams.get('userpkey') ?? 0;

  const [user, setUser] = useState<User>({ userpkey: 0, nickname: '홍길동', profileimageurl: ''});

  useEffect(() => {
    fetchUserProfile();
    console.log(`${userpkey} 의 프로필 조회`);
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (typeof userpkey === "string") {
        const response = await getUserProfile(parseInt(userpkey));
        setUser(response.data.body.user);
      } else {
        const response = await getUserProfile(0);
        setUser(response.data.body.user);
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
  }

  const handleOneToOneChat = async (userpkey: number) => {
    try {
      const response = await postCreateOneToOneChatRoom(userpkey);
      if (response.data.resCode === '0000') {
        const chatroompkey: number = response.data.body.chatroompkey;
        const roomid: string = response.data.body.roomid;

        router.push(`/chat/room?chatroompkey=${chatroompkey}&roomid=${roomid}`);
      } else {
        toast.error(response.data.body.message.kor);
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
  }

  return (
    <div className='h-screen flex flex-col'>
      <div className='p-4 flex flex-col flex-1'>
        <div className='flex justify-between items-center h-[3rem]'>
          <button
            onClick={() => {
              router.back();
            }}
            className="text-black text-[1.5rem]"
          >
            X
          </button>
        </div>
        <div className='flex-1 flex flex-col-reverse'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={'/default-profile.png'}
              className="w-22 h-22 rounded-4xl object-cover"
              alt={''}/>
            <p className='mt-2'>{user.nickname}</p>
          </div>
        </div>
      </div>
      <nav className="border-t-[1.8] border-gray-100 mt-8 h-[5rem] flex justify-center items-center gap-30">
        <div
          className={`flex flex-1 flex-col items-center text-black`}
          onClick={() => {
            handleOneToOneChat(user.userpkey);
          }}
        >
          <MessageCircle className="w-6 h-6 color-black" />
          <span className="text-xs">채팅</span>
        </div>
        <div
          className={`flex flex-1 flex-col items-center text-black`}
        >
          <Pencil className="w-6 h-6 color-black" />
          <span className="text-xs">프로필 편집</span>
        </div>
      </nav>
    </div>
  )
}
