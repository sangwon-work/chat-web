'use client';

import React from "react";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/toast/ToastContainer";
import ClientContextBinder from "@/lib/ClientContextBinder";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import {usePathname} from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // 네비게이션을 제외할 경로 목록
  const excludedPaths = ['/chat/room'];
  const shouldShowNavigation = !excludedPaths.includes(pathname);

  // 네비 높이 한 군데서 관리
  const NAV_H = 64; // px (BottomNavigation 높이 + 여유 포함해서 조정)

  return (
    <html lang="ko">
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Chat</title>
      </head>
      <body className="h-full">
      {/* 네비가 있는 일반 페이지들 */}
      {shouldShowNavigation ? (
        <div
          style={{ ['--nav-h' as any]: `${NAV_H}px` }}
          className="relative h-[100dvh]"
        >
          {/* 스크롤되는 주 영역: 뷰포트 - 네비 */}
          <main className="h-[calc(100dvh-var(--nav-h)-env(safe-area-inset-bottom,0px))] overflow-y-auto">
            <ToastProvider>
              <ClientContextBinder />
              <ToastContainer />
              {children}
            </ToastProvider>
          </main>

          <BottomNavigation navHeight={NAV_H} />
        </div>
      ) : (
        // 채팅방 페이지는 각 페이지에서 내부 스크롤을 관리
        <main className="h-[100dvh] overflow-hidden">
          <ToastProvider>
            <ClientContextBinder />
            <ToastContainer />
            {children}
          </ToastProvider>
        </main>
      )}
      </body>
    </html>
  );
}
