// app/chat/page.tsx (Next.js 13/14 App Router 기준 예시)
'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {useRouter, useSearchParams} from 'next/navigation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko'; // 한국어 로케일 추가
import { ArrowLeft } from 'lucide-react';

// 플러그인 등록
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

export default function ChatRoomPage() {
  const searchParams = useSearchParams();
  const chatroompkey = searchParams.get('chatroompkey');
  const roomid = searchParams.get('roomid');

  const [messages, setMessages] = useState<{ sender: string; message: string; sendat: string }[]>([]);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [roomname, setRoomname] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!roomid) return;

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${localStorage.getItem('accesstoken')}`,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    }); // NestJS 서버 주소
    socketRef.current = socket;

    // 채팅방 상세 조회

    socket.on('connect', () => {
      // 재입장 처리
      socket.emit('join', roomid);

      // ping 전송 주기 설정
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = setInterval(() => {
        if (socket.connected) {
          socket.emit('pingCheck'); // 서버에서 이 이벤트 수신하도록 구현 필요
        }
      }, 30000); // 30초마다 ping
    });

    // 서버에서 보낸 ping check 수신
    socket.on('pongCheck', () => {
      console.log('📥 Received pongCheck from server');
    });

    // 채팅 수신
    socket.on('message', (msg: { sender: string; message: string; sendat: string }) => {
      setMessages((prev) => {
        const { sender, message, sendat } = msg;
        return [...prev, {sender, message, sendat}];
      });
    });

    // 입장 완료 수신
    socket.on('joined', (room: { roomId: string, roomname: string, messagelist: any[] }) => {
      setRoomname(room.roomname);
      setMessages(room.messagelist);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [roomid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input && socketRef.current) {
      socketRef.current.emit('chat', { roomId: roomid, message: input});
      setInput('');
    }
  };

  const handleBack = () => {
    router.back(); // 또는 router.push('/chat/list') 도 가능
  };

  return (
    <div className="flex flex-col h-[100svh] w-full max-w-full overflow-hidden">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm flex-shrink-0">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-base font-semibold">{roomname}</div>
        <div style={{ width: '60px' }} /> {/* 오른쪽 여백 맞춤용 */}
      </div>
      {/* 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-gray-100">
        <ul className="space-y-2">
          {messages.map((m, i) => (
            <li key={i} className="bg-white p-2 rounded shadow text-sm break-words">
              <div>
                <strong>{m.sender}:</strong> {m.message}
              </div>
              <div className="text-xs text-gray-400 mt-1 text-right" suppressHydrationWarning>
                {dayjs(m.sendat).tz('Asia/Seoul').format('A h:mm')}
              </div>
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-3 bg-white flex items-center w-full flex-shrink-0">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 mr-2 text-sm w-full text-[16px]"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );

}
