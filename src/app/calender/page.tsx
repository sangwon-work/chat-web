'use client'

import CalenderMineList from "@/components/calender/list/CalenderMineList";
import CalenderShareList from "@/components/calender/list/CalenderShareList";
import {Plus} from "lucide-react";

export default function Calender() {
  return (
    <div className="flex flex-col bg-gray-100 overflow-y-auto">
        <div className='bg-[#FFE812]'>
            <div className="flex items-center justify-between mb-4 p-4">
                <h1 className="text-3xl font-[600]">일정관리</h1>
                <div className="flex gap-2"></div>
            </div>
            <CalenderMineList/>
        </div>
        <div className=''>
            <div className='p-4'>
                <div
                    className='flex justify-center items-center gap-1 p-2 rounded-xl bg-[#FFE812] text-[1.5rem] font-[600]'
                    onClick={() => {console.log('캘린더 만들기')}}
                >
                    <Plus strokeWidth={3}/>
                    <p className=''>새 캘린더 만들기</p>
                </div>
            </div>
            <CalenderShareList/>
        </div>
    </div>
  )
}
