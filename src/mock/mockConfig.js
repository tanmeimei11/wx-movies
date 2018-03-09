import {DOMAIN, payUrl} from '@/utils/config';
module.exports = {
  [`${DOMAIN}/mnp/order/create`]: 'orderCreate',
  [`${DOMAIN}/mnp/order/create_tu`]: 'createTu',
  [`${DOMAIN}/mnp/user/my2`]: 'my',
  [`${DOMAIN}/mnp/product/cfStatus`]: 'cfStatus',
  [`${DOMAIN}/info/cinemas`]: 'detail',
  [`${DOMAIN}/info/newcinemas`]: 'newDetail',
  [`${DOMAIN}/info/research`]: 'research',
  [`${DOMAIN}/index/newinfo`]: 'info',
  [`${DOMAIN}/promotion/channel/ticket`]: 'upgrade',
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
  [`${DOMAIN}/mnp/ticket/my2`]: 'ticketInfo',
  [`${DOMAIN}/mnp/ticket/share`]: 'share',
  [`${DOMAIN}/mnp/ticket/fetch`]: 'fetch',
  [`${DOMAIN}/mnp/seckill/attach2remind`]: 'attach2remind',
  [`${DOMAIN}/mnp/custom/leke_reply`]: 'example',
  [`${DOMAIN}/mnp/card/has_card`]: 'example',
  [`${payUrl}`]: 'signature'
};
