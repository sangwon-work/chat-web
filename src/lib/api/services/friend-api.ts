import { authInstance } from '../axios';

// 친구 목록 조회
export const getFriendList = async () => {
  return authInstance.get('/friend/list');
};

export const postFriendRequest = async (userpkey: number) => {
  return authInstance.post('/friend/request', { userpkey });
}

export const getFriendDiscoverList = async () => {
  return authInstance.get('/friend/discover');
}

export const postFriendAccept = async (userpkey: number) => {
  return authInstance.post('/friend/accept', { userpkey });
}
