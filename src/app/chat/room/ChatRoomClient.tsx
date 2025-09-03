'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

export default function ChatRoomClient() {
  const searchParams = useSearchParams();
  const chatroompkey = searchParams.get('chatroompkey') ?? '';
  const roomid = searchParams.get('roomid') ?? '';

  const [messages, setMessages] = useState<{ sender: string; message: string; sendat: string }[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState('');
  const [roomname, setRoomname] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!roomid) return;

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${localStorage.getItem('accesstoken')}`,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', roomid);

      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = setInterval(() => {
        if (socket.connected) socket.emit('pingCheck');
      }, 30000);
    });

    socket.on('pongCheck', () => {
      // optional: console.log('📥 pong');
    });

    socket.on('message', (msg: { sender: string; message: string; sendat: string }) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('joined', (room: { roomId: string; roomname: string; messagelist: { sender: string; message: string; sendat: string }[] }) => {
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
      socketRef.current.emit('chat', { roomId: roomid, message: input });
      setInput('');
    }
  };

  const handleBack = () => router.back();

  return (
    <div className="flex flex-col h-[100svh] w-full max-w-full overflow-hidden">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm flex-shrink-0">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-base font-semibold">{roomname}</div>
        <div style={{ width: '60px' }} />
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <ul className="space-y-2">
          {messages.map((m, i) => (
            <li key={i} className="p-2 text-sm">
              <div>
                <strong>{m.sender}</strong>
                <div className='flex items-end'>
                  <p className='p-2 bg-gray-100 rounded-xl'>{m.message}</p>
                  <p className='ms-1 text-xs text-gray-400'>{dayjs(m.sendat).tz('Asia/Seoul').format('A h:mm')}</p>
                </div>
              </div>
              {/*<div className="text-xs text-gray-400 mt-1 text-right" suppressHydrationWarning>*/}
              {/*  {dayjs(m.sendat).tz('Asia/Seoul').format('A h:mm')}*/}
              {/*</div>*/}
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
            if (e.key === 'Enter' && !isComposing) sendMessage();
          }}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 shrink-0">
          Send
        </button>
      </div>
    </div>
  );
}
