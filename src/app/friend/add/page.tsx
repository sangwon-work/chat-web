'use client';

import {useEffect, useState} from 'react';
import {getUserSearch} from "@/lib/api/services/user-api";
import {AxiosError} from "axios";
import {toast} from "@/lib/toast";
import {useRouter} from "next/navigation";
import {getFriendDiscoverList, postFriendAccept, postFriendRequest} from "@/lib/api/services/friend-api";
import Image from 'next/image';

interface User {
  userpkey: number;
  nickname: string;
  phone: string;
}

interface RequesterUser {
  userpkey: number;
  nickname: string;
  profileimageurl: string;
}

export default function AddFriendPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [added, setAdded] = useState(false);
  const [requesterUser, setRequestUser] = useState<RequesterUser[]>([]);
  const [isSearchBtn, setIsSearchBtn] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    // 친구 요청 목록 조회
    fetchFriendDiscover();
  }, []);

  useEffect(() => {
    setIsSearchBtn(searchTerm.length > 0);
  }, [searchTerm]);

  const fetchFriendDiscover = async () => {
    try {
      const response = await getFriendDiscoverList();
      setRequestUser(response.data.body.userlist); // 더미 매칭
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

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const response = await getUserSearch(searchTerm);
      setSearchResult(response.data.body.userlist); // 더미 매칭
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        toast.error(axiosError.message);
        router.replace('/login');
      } else {
        console.error('API Error:', axiosError);
      }
    }
    setAdded(false);
  };

  const handleAddFriend = async (userpkey: number) => {
    try {
      const response = await postFriendRequest(userpkey);
      if (response.data.resCode === '0000') {
        router.push('/friend/list');
        setAdded(true);
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

  const handleAcceptFriend = async (userpkey: number) => {
    try {
      const response = await postFriendAccept(userpkey);
      if (response.data.resCode === '0000') {
        router.push('/friend/list');
        setAdded(true);
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
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <button
        onClick={() => {
          router.back();
        }}
          className="text-black"
        >
          X
        </button>
        <h1 className="text-xl font-semibold mb-4">친구 추가</h1>
        <button
          onClick={handleSearch}
          className={`w-9 h-9 ${isSearchBtn ? 'text-black' : 'text-gray-300'}`}
          disabled={!isSearchBtn}
        >
          확인
        </button>
      </div>
      <div className='flex my-2'>
        <input
          type="text"
          placeholder="전화번호 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border-b"
        />
      </div>

      {
        searchResult.map((user) => (
          <div key={user.userpkey} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow mb-4">
            <Image
              src={'/default-profile.png'}
              alt={user.nickname}
              width={40}
              height={40}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-base font-medium">{user.nickname}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </div>
            {!added ? (
              <button
                onClick={() => {
                  handleAddFriend(user.userpkey)
                }}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                추가
              </button>
            ) : (
              <span className="text-sm text-green-600 font-semibold">추가됨</span>
            )}
          </div>
        ))
      }

      <div className='border-gray-400'>
        <p className='pt-2'>추천친구</p>
      </div>
      {
        requesterUser.map((user) => (
          <div key={user.userpkey} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow mb-4">
            <Image
              src={'/default-profile.png'}
              alt={user.nickname}
              width={40}
              height={40}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-base font-medium">{user.nickname}</p>
            </div>
            {!added ? (
              <button
                onClick={() => {
                  handleAcceptFriend(user.userpkey)
                }}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                추가
              </button>
            ) : (
              <span className="text-sm text-green-600 font-semibold">추가됨</span>
            )}
          </div>
        ))
      }
    </div>
  );
}
