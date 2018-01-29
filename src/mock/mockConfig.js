import {DOMAIN, payUrl} from '@/utils/config';
module.exports = {
  [`${DOMAIN}/mnp/order/create`]: 'orderCreate',
  [`${DOMAIN}/mnp/user/my`]: 'my',
  [`${DOMAIN}/mnp/product/cfStatus`]: 'cfStatus',
  [`${DOMAIN}/info/cinemas2`]: 'detail',
  [`${DOMAIN}/info/research`]: 'research',
  [`${DOMAIN}/index/info`]: 'info',
  [`${DOMAIN}/mnp/product/cfStatus`]: 'cfStatus',
  [`${DOMAIN}/mnp/order/result`]: 'result',
  [`${DOMAIN}/mnp/share/wechat/img`]: 'wechatimg',
  [`${DOMAIN}/mnp/account/withdraw`]: 'withdraw',
  [`${DOMAIN}/mnp/card/add_phone`]: 'withdraw',
  [`${payUrl}`]: 'signature'
};
