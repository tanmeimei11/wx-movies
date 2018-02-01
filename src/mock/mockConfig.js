import {DOMAIN, payUrl} from '@/utils/config';
module.exports = {
  [`${DOMAIN}/mnp/order/create`]: 'orderCreate',
  [`${DOMAIN}/mnp/user/my2`]: 'my',
  [`${DOMAIN}/mnp/product/cfStatus`]: 'cfStatus',
  [`${DOMAIN}/info/cinemas`]: 'detail',
  [`${DOMAIN}/info/research`]: 'research',
  [`${DOMAIN}/index/info`]: 'info',
  [`${DOMAIN}/mnp/product/cfStatus2`]: 'cfStatus',
  [`${DOMAIN}/mnp/order/result`]: 'result',
  [`${DOMAIN}/mnp/share/wechat/img`]: 'wechatimg',
  [`${DOMAIN}/mnp/account/withdraw`]: 'withdraw',
  [`${DOMAIN}/mnp/card/add_phone`]: 'withdraw',
  [`${DOMAIN}/mnp/card/fetch`]: 'receive',
  [`${DOMAIN}/mnp/card/reward_info`]: 'cardInfo',
  [`${DOMAIN}/mnp/user/update_phone`]: 'withdraw',
  [`${DOMAIN}/mnp/card/reward`]: 'reward',
  [`${DOMAIN}/mnp/card/cancelreward`]: 'cancelGift',
  [`${DOMAIN}/mnp/card/gifts`]: 'cancelGift',
  [`${payUrl}`]: 'signature'
};
