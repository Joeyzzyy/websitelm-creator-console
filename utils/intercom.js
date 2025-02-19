import Intercom from '@intercom/messenger-js-sdk';

// 初始化匿名访客
export const initAnonymousIntercom = () => {
  Intercom({
    app_id: 'aqhtwkc5',
  });
};

// 初始化已登录用户
export const initIntercom = (user) => {
  Intercom({
    app_id: 'aqhtwkc5',
    user_id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt
  });
};

// 关闭/重置 Intercom
export const shutdownIntercom = () => {
  Intercom('shutdown');
}; 