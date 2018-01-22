import {DOMAIN, payUrl} from '@/utils/config';
module.exports = {
  [`${DOMAIN}/mnp/order/create`]: 'orderCreate',
  [`${DOMAIN}/mnp/user/my`]: 'my',
  [`${DOMAIN}/mnp/product/cfStatus`]: 'cfStatus',
  [`${DOMAIN}/info/cinemas`]: 'detail',
  [`${DOMAIN}/index/info`]: 'info',
  [`${DOMAIN}/mnp/product/cfStatus`]: 'cfStatus',
  [`${DOMAIN}/mnp/order/result`]: 'result',
  [`${payUrl}`]: 'signature'
};
