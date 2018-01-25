import wepy from 'wepy';
import Pagebase from './page';
import { paymentChannel, businessParty, payUrl, token } from '@/utils/config';

export default class Detail extends Pagebase {
  /**
   *  获取众筹状态接口
   */
  static async getDetailStatus ( qrcode_from ) {
    return await this.request( {
      url: '/mnp/product/cfStatus2',
      data: {
        product_id: 159,
        qrcode_from: qrcode_from || ''
      }
    } );
  }
  /**
   *  获取详情页数据接口
   */
  static async getDetailData () {
    return await this.request( {
      url: '/info/cinemas'
    } );
  }
  static initCardNum ( data ) {
    return {
      num: `${data.current_person_count}/${data.total_person_count}`,
      percent: ( data.current_person_count / data.total_person_count * 100 ) + '%'
    };
  }
  /**
   * 初始化影院
   */
  static initCinemas ( data, img ) {
    if ( !data.length ) {
      return [];
    }
    return {
      img: img,
      list: data.map( ( item ) => {
        return {
          address: item.address,
          addressImg: item.address_img,
          gps: item.gps,
          name: item.name
        };
      } )
    };
  }
  /**
   * 获取分享信息
   */
  static async getShareInfo () {
    return await this.request({
      url: '/mnp/share/wechat/img'
    });
  }
  /**
   *
   * 初始化电影
   * @static
   * @memberof Detail
   */
  static initMovies ( data ) {
    if ( !data.length ) {
      return [];
    }

    return data.map( ( item ) => {
      return {
        name: item.name,
        url: item.movie_img_url
      };
    } );
  }
  /**
   * 创建订单接口
   */
  static async creatOrder ( shareTicketInfo, shareUserId ) {
    var _data = shareTicketInfo || {};
    return await this.request( {
      url: '/mnp/order/create',
      data: {
        ..._data,
        product_id: 159,
        pay_channel: paymentChannel,
        qrcode_from: shareUserId
      }
    } );
  }

  /**
   * 获取订单信息接口
   * @param {*} createRes  创建订单的res
   */
  static async getOrderDetail ( createRes ) {
    var _data = {
      _token: wepy.$instance.globalData.xToken || token,
      payment_channel: paymentChannel,
      business_party: businessParty,
      order_detail: createRes.order_detail,
      extend_params: JSON.stringify( {
        open_id: createRes.open_id
      } )
    };
    return await this.request( {
      url: payUrl,
      data: _data
    } );
  }
}
