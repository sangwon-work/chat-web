'use client';

import {useEffect, useState} from "react";
import {postCreateChatRoom} from "@/lib/api/services/chat-api";
import {toast} from "@/lib/toast";
import {AxiosError} from "axios";
import {useRouter} from "next/navigation";
import FriendListItem from "@/components/friend/FriendListItem";
import {useFriendList} from "@/hooks/friend/useFriendList";

export default function ChatAddPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>('');

  const { friends, friendCount, fetchFriendList } = useFriendList();

  const router = useRouter();

  useEffect(() => {
  }, []);

  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  const handleCheck = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('채팅방 이름은 필수 입니다.');
      return;
    }
    if (selected.length === 0) {
      toast.error('채팅할 친구를 선택해주세요.');
      return;
    }

    // 1. api 요청으로 채팅방 및 채팅방 회원 추가 (roomid return)
    // 2. websocket join
    try {
      const response = await postCreateChatRoom(newRoomName, selected);
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

    setNewRoomName('');
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📂 채팅방 생성</h1>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="채팅방 이름을 입력하세요"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={handleAddRoom}
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
        >
          추가
        </button>

        <div className='border-b-[1.8] border-gray-300 pt-2'/>
      </div>
      {/* 친구 목록 */}
      <div className='flex pt-2'>
        <p className='pe-1 ps-2 text-[13px] text-gray-400'>친구</p>
        <p className='text-[13px] text-gray-400'>{friendCount}</p>
      </div>
      {friends.map((friend) => (
        <FriendListItem
          key={friend.frienduserpkey}
          nickname={friend.nickname}
          profileImageUrl={friend.profileimageurl}
          isChecked={selected.includes(friend.frienduserpkey)}
          onCheckChange={() => handleCheck(friend.frienduserpkey)}
          showCheckbox
        />
      ))}
    </main>
  );
}
