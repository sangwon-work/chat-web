'use client';

import React from 'react';

interface FriendListItemProps {
  nickname: string;
  profileImageUrl?: string;
  isChecked?: boolean; // 체크박스용
  onDoubleClick?: () => void;
  onCheckChange?: () => void; // 체크박스 토글
  showCheckbox?: boolean;
}

export default function FriendListItem({
  nickname,
  profileImageUrl = '/default-profile.png',
  isChecked = false,
  onDoubleClick,
  onCheckChange,
  showCheckbox = false,
}: FriendListItemProps) {
  return (
    <li
      className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50 transition"
      onDoubleClick={onDoubleClick}
    >
      <img
        src={profileImageUrl || '/default-profile.png'}
        alt={nickname}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 ps-1">
        <p className="text-base font-medium">{nickname}</p>
      </div>

      {showCheckbox && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckChange}
          className={`
            appearance-none w-5 h-5 border-2 border-gray-400 rounded-full 
            checked:bg-blue-500 checked:border-blue-500
            transition-all duration-200
          `}
        />
      )}
    </li>
  );
}
