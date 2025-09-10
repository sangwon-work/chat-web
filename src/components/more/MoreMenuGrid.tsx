'use client'

import {CalendarCheck, Gift, Laugh, Gamepad2} from 'lucide-react';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Swiper, SwiperSlide} from "swiper/react";
import {
  Pagination,
} from 'swiper/modules';

const navItems = [
  {
    href: '',
    icon: <Gift className="w-6 h-6" />,
    label: '선물하기',
  },
  {
    href: '/calender',
    icon: <CalendarCheck className="w-6 h-6" />,
    label: '캘린더',
  },
  {
    href: '',
    icon: <Laugh className="w-6 h-6" />,
    label: '이모티콘',
  },
  // {
  //   href: '',
  //   icon: <Gift className="w-6 h-6" />,
  //   label: '선물하기',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  //
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
  // {
  //   href: '',
  //   icon: <Gamepad2 className="w-6 h-6" />,
  //   label: '게임',
  // },
];

export default function MoreMenuGrid() {
  const pathname = usePathname();

  // 16개 단위로 아이템을 잘라서 페이지 배열 생성
  const PAGE_SIZE = 16;
  const pages = [];
  for (let i = 0; i < navItems.length; i += PAGE_SIZE) {
    pages.push(navItems.slice(i, i + PAGE_SIZE));
  }

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      slidesPerView={1}         // ✅ 페이지 단위로 1장씩
      spaceBetween={20}
      loop={false}
      className="!overflow-hidden"
      // 페이지네이션 위치 조정하고 싶으면 아래처럼:
      // style={{ '--swiper-pagination-bottom': '8px' } as React.CSSProperties}
    >
      {pages.map((page, pageIdx) => (
        <SwiperSlide key={pageIdx}>
          {/* ✅ 각 페이지 내부는 Tailwind로 4x4 고정 */}
          <div className="grid grid-cols-4 gap-y-6 py-2">
            {page.map((item, idx) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <div key={`${pageIdx}-${idx}`} className="flex justify-center items-center">
                  <Link
                    href={item.href}
                    className={`rounded-xl flex flex-col items-center justify-center gap-1 ${
                      isActive ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
