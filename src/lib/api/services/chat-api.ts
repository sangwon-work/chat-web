import { authInstance } from '../axios';

// 채팅방 목록 조회
export const getChattingRoomList = async () => {
  return authInstance.get('/chatting/room/list');
};

export const postCreateChatRoom = async (roomname: string, frienduserpkeylist: number[]) => {
  return authInstance.post('/chatting/room/create', { roomname, frienduserpkeylist });
}

export const postCreateOneToOneChatRoom = async (userpkey: number) => {
  return authInstance.post('/chatting/room/one-to-one', { userpkey });
}
