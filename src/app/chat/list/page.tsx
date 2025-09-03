'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {getChattingRoomList} from "@/lib/api/services/chat-api";
import { toast } from '@/lib/toast';
import { AxiosError } from 'axios';
import { PlusIcon } from '@heroicons/react/24/solid';

interface ChatRoom {
  chatroompkey: number;
  roomid: string;
  roomname: string;
  lastmessage: {
    messagetype: 'text' | 'image' | 'file';
    message: string;
    nickname: string;
    sendat: string;
  };
  updatedat: string;
}

export default function ChatListPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRoomList();
  }, []);

  const getRoomList = async () => {
    try {
      const response = await getChattingRoomList();
      setChatRooms(response.data.body.roomlist);
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

  const handleRoomClick = (chatroompkey: number, roomid: string) => {
    router.push(`/chat/room?chatroompkey=${chatroompkey}&roomid=${roomid}`);
  };

  const handleChatAddPage = () => {
    router.push('/chat/add');
  }

  return (
    <div
      // 네비 높이를 CSS 변수로 (레이아웃에서 이미 내려줬다면 생략 가능)
      style={{
        '--nav-h': '100px',
      } as React.CSSProperties}
      className="max-w-2xl mx-auto p-6"
    >
      {/* 화면 전체 높이에서 네비 높이만큼 뺀 컨테이너 */}
      <div className="flex flex-col h-[calc(100dvh-var(--nav-h)-env(safe-area-inset-bottom,0px))]">
        {/* 헤더 영역(고정 높이) */}
        <div className="shrink-0 mb-6 h-16 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">📂 채팅방 목록</h1>
          <button
            onClick={handleChatAddPage}
            className="p-2 rounded-full hover:bg-blue-700 transition shadow"
            title="새 채팅방 만들기"
          >
            <PlusIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* 스크롤 되는 리스트 영역 */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4">
            {chatRooms.map((room) => (
              <div
                key={room.chatroompkey}
                onClick={() => handleRoomClick(room.chatroompkey, room.roomid)}
                className="cursor-pointer bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{room.roomname}</h2>
                  <span className="text-sm text-gray-500">
                    {format(new Date(room.updatedat), 'yyyy.MM.dd HH:mm')}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-1">
                  {room.lastmessage.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
