export const setToken = (token: string) => sessionStorage.setItem('token', token);

export const getToken = () => sessionStorage.getItem('token');

export const removeToken = () => sessionStorage.removeItem('token');

// @ts-ignore
export const serverUrl = API_URL;

export const dalImg = (url: string) => {
  if (url) {
    if (url.startsWith('http')) return url;
    return serverUrl + url;
  }
  return 'https://img2.baidu.com/it/u=2054960836,3417775757&fm=253&fmt=auto&app=120&f=JPEG?w=636&h=636';
};

export const uploadUrl = serverUrl + '/api/v1/common/upload';
