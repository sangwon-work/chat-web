'use client'

import {Calendar, ChevronRight} from "lucide-react";

export default function CalenderMineList() {
    return (
        <>
            <div className='p-3'>
                <div
                    className='flex justify-between items-center mb-3 pt-2 pb-2 ps-3 pe-3 bg-opacity-50 rounded-2xl bg-gray-50'
                    onClick={() => {console.log('캘린더 상세 이동')}}
                >
                    <div className='flex flex-1 gap-3 items-center'>
                        <Calendar className="w-11 h-11" />
                        <div className=''>
                            <p className='text-xl font-[600]'>내 켈린더</p>
                            <p>개인</p>
                        </div>
                    </div>
                    <ChevronRight/>
                </div>
            </div>
        </>
    )
}