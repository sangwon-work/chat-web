'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter, useSearchParams } from 'next/navigation';
import {ArrowLeft, ArrowUp} from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {Message} from "@/types/MessageTypes";
import { groupByDate, Row } from "@/hooks/chat/groupMessagesByDate";

import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

export default function ChatRoomClient() {
  const searchParams = useSearchParams();
  const chatroompkey = searchParams.get('chatroompkey') ?? '';
  const roomid = searchParams.get('roomid') ?? '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState('');
  const [roomname, setRoomname] = useState('');
  const [rows, setRow] = useState<Row[]>([]);
  const [isSendBtnHidden, setIsSendBtnHidden] = useState<boolean>(false);

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
      socket.disconnect();``
      socketRef.current = null;
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [roomid]);

  useEffect(() => {
    setRow(groupByDate(messages, 'Asia/Seoul'));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rows]);

  useEffect(() => {
    setIsSendBtnHidden(input.length === 0);
  }, [input]);

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
      <div className="flex items-center justify-between px-4 py-2 bg-blue-100 flex-shrink-0">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-base font-semibold">{roomname}</div>
        <div style={{ width: '60px' }} />
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-blue-100">
        <ul className="space-y-2">
          {rows.map((row, idx) => {
            if (row.type === 'date') {
              return (
                <li key={idx} className="top-2 flex justify-center my-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
                    {row.label}
                  </span>
                </li>
              );
            }
            const m = row.type === 'msg' ? row.message : null;
            if (!m) return null;
            return (
              <li key={idx} className="px-2 mt-2">
                {/* 예시: 좌/우 버블은 senderId로 분기 */}
                {/*<div className={`max-w-[75%] rounded-2xl px-3 py-2 shadow ${m.senderId === 'me' ? 'ml-auto bg-indigo-500 text-white' : 'mr-auto bg-white border'}`}>*/}
                {/*  <div className="whitespace-pre-wrap">{m.text}</div>*/}
                {/*  <div className="mt-1 text-[10px] opacity-60 text-right">*/}
                {/*    {dayjs(m.createdAt).format('HH:mm')}*/}
                {/*  </div>*/}
                {/*</div>*/}
                <p className='text-[0.8rem]'>{m.sender}</p>
                <div className='flex justify-start items-end gap-2 mt-1'>
                  <div className="whitespace-pre-wrap bg-white p-[0.5rem] text-[0.9rem] rounded-2xl">{m.message}</div>
                  <div className="mt-1 text-[10px] opacity-60 text-right">
                    {dayjs(m.sendat).format('HH:mm')}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-2 bg-white flex items-center w-full flex-shrink-0">
        <input
          type="text"
          className="flex-1 px-3 py-2 mr-2 text-sm w-full text-[16px] bg-gray-100 rounded-2xl"
          value={input}
          placeholder="메세지 입력"
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) sendMessage();
          }}
        />
        <button onClick={sendMessage} hidden={isSendBtnHidden} className="flex justify-center items-center w-10 h-10 bg-amber-300 text-white rounded-full">
          <ArrowUp size={300} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
