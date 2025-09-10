'use client'

import PageHeader from "@/components/common/header/Header";

export default function Calender() {
  return (
    <div className="flex flex-col h-[calc(100dvh-var(--nav-h)-env(safe-area-inset-bottom,0px))] p-4 bg-gray-100">
      <PageHeader
        title={'일정관리'}
      />
    </div>
  )
}
