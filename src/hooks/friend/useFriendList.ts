'use client';

import { useCallback, useState } from 'react';
import { getFriendList } from '@/lib/api/services/friend-api';
import { toast } from '@/lib/toast';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export interface Friend {
  friendkey: number;
  frienduserpkey: number;
  nickname: string;
  profileimageurl: string;
}

export function useFriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendCount, setFriendCount] = useState<number>(0);
  const router = useRouter();

  const fetchFriendList = useCallback(async () => {
    try {
      const response = await getFriendList();
      setFriends(response.data.body.friendlist);
      setFriendCount(response.data.body.friendcount);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        toast.error(axiosError.message);
        router.replace('/login');
      } else {
        console.error('API Error:', axiosError);
      }
    }
  }, [router]);

  return { friends, friendCount, fetchFriendList };
}
