// components/PageHeader.tsx
'use client';

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode; // 오른쪽 버튼/아이콘들을 받는 영역
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}
