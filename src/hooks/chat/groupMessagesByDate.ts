// utils/groupMessagesByDate.ts
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {Message} from "@/types/MessageTypes";
dayjs.locale('ko');

export type Row =
  | { type: 'date'; label: string }  // 날짜 헤더
  | { type: 'msg'; message: Message };

export function groupByDate(messages: Message[], tz: string = 'Asia/Seoul'): Row[] {
  // messages는 서버에서 이미 createdAt ASC 정렬되어 있다고 가정
  const rows: Row[] = [];
  let lastDateKey: string | null = null;

  for (const m of messages) {
    const local = dayjs(m.sendat).tz ? dayjs(m.sendat).tz(tz) : dayjs(m.sendat); // dayjs-timezone 쓸 경우
    const dateKey = local.format('YYYY-MM-DD');
    if (dateKey !== lastDateKey) {
      rows.push({
        type: 'date',
        label: local.format('YYYY년 M월 D일 dddd'), // 예: 2025년 9월 4일 목
      });
      lastDateKey = dateKey;
    }
    rows.push({ type: 'msg', message: m });
  }

  return rows;
}
