import {authInstance, refreshAuthInstance} from '../axios';

export const postSignup = async (phone: string, password: string, nickname: string) => {
  return authInstance.post('/user/signup', { phone, password, nickname });
};

export const postLogin = async (phone: string, password: string) => {
  return authInstance.post('/user/login', { phone, password });
};

export const getAccessTokenValidation = async () => {
  return authInstance.get('/user/token-validation');
};

export const postRefreshToken = async () => {
  return refreshAuthInstance.get('/user/refresh-token');
};

export const getUserInfo = async () => {
  return authInstance.get('/user/info');
}

export const getUserSearch = async (search: string) => {
  return authInstance.get(`/user/search?search=${search}`);
}
