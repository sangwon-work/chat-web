'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {getChattingRoomList} from "@/lib/api/services/chat-api";
import { toast } from '@/lib/toast';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import { MessageCirclePlus } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    getRoomList();
    console.log(format(new Date(now), 'yy/MM/dd'))
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
    <div className="h-[calc(100dvh-var(--nav-h)-env(safe-area-inset-bottom,0px))] max-w-2xl mx-auto p-6">
      {/* 화면 전체 높이에서 네비 높이만큼 뺀 컨테이너 */}
      {/* 헤더 영역(고정 높이) */}
      <div className="shrink-0 mb-6 h-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">채팅</h1>
        <button
          onClick={handleChatAddPage}
          className="p-2 rounded-full hover:bg-blue-700 transition"
          title="새 채팅방 만들기"
        >
          <MessageCirclePlus className="w-5 h-5 text-black" />
        </button>
      </div>
      <div className="flex flex-col">

        {/* 스크롤 되는 리스트 영역 */}
        <div className="min-h-0 flex-1">
          <div className="grid gap-1 overflow-y-auto">
            {chatRooms.map((room) => (
              <div
                key={room.chatroompkey}
                onClick={() => handleRoomClick(room.chatroompkey, room.roomid)}
                className="cursor-pointer bg-white p-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-md font-semibold text-gray-900">{room.roomname}</h2>
                  <span className="text-[12px] text-gray-500">
                    {format(new Date(room.updatedat), 'yyyy') !== '2025'
                      ? format(new Date(room.updatedat), 'yy/MM/dd')
                      : format(new Date(room.updatedat), 'yy/MM/dd') === format(new Date(now), 'yy/MM/dd')
                          ? dayjs(room.updatedat).tz('Asia/Seoul').format('A h:mm')
                          : format(new Date(room.updatedat), 'M/dd HH:mm')}
                  </span>
                  {/*{dayjs(m.sendat).tz('Asia/Seoul').format('A h:mm')}*/}
                </div>
                <p className="text-gray-600 text-sm line-clamp-1">
                  {room.lastmessage.message.length > 15 ? `${room.lastmessage.message.slice(0, 15)}...` : room.lastmessage.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
