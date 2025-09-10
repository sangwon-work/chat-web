'use client';

import {Suspense, useEffect, useState} from 'react';
import {LogOutIcon, UserPlus} from 'lucide-react';
import {useRouter} from "next/navigation";
import {AxiosError} from "axios";
import {toast} from "@/lib/toast";
import {getUserInfo} from "@/lib/api/services/user-api";
import FriendListItem from "@/components/friend/FriendListItem";
import {useFriendList} from "@/hooks/friend/useFriendList";
import Image from 'next/image';
import PageHeader from "@/components/common/header/Header";

interface User {
  userpkey: number;
  nickname: string;
  profileimageurl: string;
}

export default function FriendListPage() {
  const [user, setUser] = useState<User>({ userpkey: 0, nickname: '', profileimageurl: '' });

  const { friends, friendCount, fetchFriendList } = useFriendList();

  const router = useRouter();

  useEffect(() => {
    // 내 정보 조회
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setUser(response.data.body.user);
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

  const handleFriendAdd = () => {
    router.push('/friend/add');
  }

  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('refreshToken');
    router.replace('/login');
  }

  const handelProfilePage = (userpkey: number, ismeyn: boolean) => {
    router.push(`/profile?userpkey=${userpkey}&ismeyn=${ismeyn}`);
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-var(--nav-h)-env(safe-area-inset-bottom,0px))] p-4">
      <PageHeader
        title="친구"
        actions={
          <>
            <div onClick={handleFriendAdd} className="p-2 rounded-full cursor-pointer">
              <UserPlus className="w-5 h-5 text-black" />
            </div>
            <div onClick={handleLogout} className="p-2 rounded-full cursor-pointer">
              <LogOutIcon className="w-5 h-5 text-black" />
            </div>
          </>
        }
      />

      <ul className="space-y-1 overflow-y-auto flex-1 pb-[64px]">
        <Suspense fallback={<div>Loading...</div>}>
          <li
            className="flex items-center gap-2 ps-2 pt-2 pe-2 bg-white hover:bg-gray-50 transition"
            onClick={() => handelProfilePage(user.userpkey, true)}
          >
            <Image
              src={'/default-profile.png'}
              width={40}
              height={40}
              className="w-12 h-12 rounded-full object-cover"
              alt={''}/>
            <div className="flex-1 ps-1">
              <p className="text-base font-medium">{user.nickname}</p>
              <p className="text-sm text-gray-500">{''}</p>
            </div>
          </li>
        </Suspense>
        <div className='border-b-[1.8] border-gray-100 pt-2'/>
        {/* 친구 목록 */}
        <div className='flex pt-2'>
          <p className='pe-1 ps-2 text-[13px] text-gray-400'>친구</p>
          <p className='text-[13px] text-gray-400'>{friendCount}</p>
        </div>
        {friends.map((friend, idx) => (
          <div key={idx}>
            <Suspense fallback={<div>Loading...</div>}>
              <FriendListItem
                nickname={friend.nickname}
                profileImageUrl={friend.profileimageurl}
                onClick={() => {handelProfilePage(friend.frienduserpkey, false)}}
              />
            </Suspense>
          </div>
        ))}
      </ul>
    </div>
  );
}
