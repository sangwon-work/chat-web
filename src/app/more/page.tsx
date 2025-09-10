'use client'

import {Settings} from 'lucide-react';
import MoreMenuGrid from "@/components/more/MoreMenuGrid";
import PageHeader from "@/components/common/header/Header";

export default function More() {

  return (
    <div className="flex flex-col h-[calc(100dvh-var(--nav-h)-env(safe-area-inset-bottom,0px))] p-4 bg-gray-100">
      <PageHeader
        title={'더보기'}
        actions={
          <>
            <div
              className="p-2 rounded-full cursor-pointer"
            >
              <Settings className="w-5 h-5 text-black" />
            </div>
          </>
        }
      />
      <div className='bg-white p-4 rounded-2xl flex justify-center text-center h-85'>
        <MoreMenuGrid/>
      </div>
    </div>
  );
}
