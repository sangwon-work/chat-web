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

type Props = { navHeight?: number };

export default function BottomNavigation({ navHeight = 64 }: Props) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 h-15 left-0 right-0 bg-white border-t shadow-sm flex justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-sm ${
              isActive ? 'text-blue-500' : 'text-gray-500'
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
