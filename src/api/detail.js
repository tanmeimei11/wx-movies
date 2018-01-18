import wepy from 'wepy'
import Pagebase from './page'
import { paymentChannel, businessParty, payUrl, token } from '@/utils/config'
// import mockConfig from '@/mock/mockConfig'
// import axios from '@/utils/axios'

export default class Detail extends Pagebase {
  /**
   * 创建订单接口
   */
  static async creatOrder() {
    return await this.request({
      url: '/mnp/order/create',
      data: {
        product_id: 159,
        pay_channel: paymentChannel
      }
    })
  }

  /**
   * 获取订单信息接口
   * @param {*} createRes  创建订单的res
   */
  static async getOrderDetail(createRes) {
    var _data = {
      _token: wepy.$instance.globalData.xToken || token,
      payment_channel: paymentChannel,
      business_party: businessParty,
      order_detail: createRes.order_detail,
      extend_params: JSON.stringify({
        open_id: createRes.open_id
      })
    }
    return await this.request({
      url: payUrl,
      data: _data
    })
  }
}
