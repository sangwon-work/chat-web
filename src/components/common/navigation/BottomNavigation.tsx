'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User2Icon, MessageCircleIcon, CircleEllipsis } from 'lucide-react';

const navItems = [
  {
    href: '/friend/list',
    icon: <User2Icon className="w-6 h-6" />,
    label: '친구',
  },
  {
    href: '/chat/list',
    icon: <MessageCircleIcon className="w-6 h-6" />,
    label: '채팅',
  },
  {
    href: '/more',
    icon: <CircleEllipsis className="w-6 h-6" />,
    label: '더보기'
  }
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 h-16 left-0 right-0 bg-gray-100 shadow-sm flex justify-around py-2 border-t border-gray-200">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-sm ${
              isActive ? 'text-black' : 'text-gray-500'
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
