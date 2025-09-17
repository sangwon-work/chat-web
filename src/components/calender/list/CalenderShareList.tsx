'use client'

import {Share2, ChevronRight} from "lucide-react";

const mineCalenderList: { calenderpkey: number; title: string; memo: string; role: 'viewer' | 'editor' | 'owner' }[] = [
    {
        calenderpkey: 1,
        title: '프로젝트 팀 일정',
        memo: '개인',
        role: 'viewer',
    },
    {
        calenderpkey: 2,
        title: '스터디 모임 켈린더',
        memo: '개인',
        role: 'editor'
    },
    {
        calenderpkey: 3,
        title: '스터디 모임 켈린더',
        memo: '개인',
        role: 'editor'
    },
    {
        calenderpkey: 4,
        title: '스터디 모임 켈린더',
        memo: '개인',
        role: 'editor'
    },
    {
        calenderpkey: 5,
        title: '스터디 모임 켈린더',
        memo: '개인',
        role: 'editor'
    },
    {
        calenderpkey: 6,
        title: '스터디 모임 켈린더',
        memo: '개인',
        role: 'editor'
    },
    {
        calenderpkey: 7,
        title: '스터디 모임 켈린더',
        memo: '개인',
        role: 'editor'
    },
    {
        calenderpkey: 8,
        title: '스터디 모임 켈린더1',
        memo: '개인',
        role: 'editor'
    },
    {
        calenderpkey: 9,
        title: '스터디 모임 켈린더1',
        memo: '개인',
        role: 'editor'
    }
]

export default function CalenderShareList() {
    return (
        <>
            <div className='ps-4 pe-4'>
                <div className='flex justify-between items-center mb-3 pt-2 pb-2 ps-3 pe-3 rounded-2xl bg-white'>
                    <div className='flex flex-1 gap-3 items-center'>
                        <Share2 className="w-7 h-7" />
                        <p className='text-2xl font-[700]'>공유받은 켈린더</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    {mineCalenderList.map((calender, idx) => (
                        <div
                            key={idx}
                            className='flex items-center bg-white pt-2 pb-2 ps-3 pe-3 rounded-2xl'
                            onClick={() => {console.log('켈린더 상세 이동')}}
                        >
                            <div className='flex-1'>
                                <p className='text-[1.2rem] font-[600]'>{calender.title}</p>
                                <span className='font-[600]'>권한 : </span><span>{calender.role === 'viewer' ? '보기' : calender.role === 'editor' ? '쓰기' : '소유자'}</span>
                            </div>
                            <button>
                                <ChevronRight/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}