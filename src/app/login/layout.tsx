import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-screen h-[calc(100dvh-var(--nav-h)-env(safe-area-inset-bottom,0px))] flex items-center justify-center'>
      {children}
    </div>
  );
}
