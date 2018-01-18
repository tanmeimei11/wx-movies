import {DOMAIN, payUrl} from '@/utils/config'
module.exports = {
  [`${DOMAIN}/mnp/order/create`]: 'orderCreate',
  [`${DOMAIN}/mnp/user/my`]: 'my',
  [`${payUrl}`]: 'signature'
}
