import wepy from 'wepy';
import Pagebase from './page';
import tips from '@/utils/tips';
import { paymentChannel, businessParty, payUrl, token } from '@/utils/config';

export default class Detail extends Pagebase {
  /**
   *  获取众筹状态接口
   */
  static async getDetailStatus ( productId, queryObj ) {
    console.log( productId );
    var _data = {
      product_id: productId,
      ...queryObj
    };
    // if ( shareCode ) {
    //   _data.share_code = shareCode;
    // }
    return await this.request( {
      url: '/stc/product/detail_common',
      data: _data
    } );
  }
  /**
   *  获取详情页数据接口
   */
  static async getDetailData ( data ) {
    return await this.request( {
      url: '/info/cinemas',
      data: data
    } );
  }
  /**
   *  获取详情页页面接口
   */
  static async getDetailDataNew ( productId, data ) {
    var _data = {
      product_id: productId,
      ...data
    };
    return await this.request( {
      url: '/stc/info/detail_common',
      data: _data
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
      list: data
      // list: data.map( ( item ) => {
      //   return {
      //     address: item.address,
      //     addressImg: item.address_img,
      //     gps: item.gps,
      //     name: item.name
      //   };
      // } )
    };
  }
  /**
   * 获取分享信息
   */
  static async getShareInfo () {
    return await this.request( {
      url: '/stc/share/wechat/img'
    } );
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
        title: item.title,
        list: item.list
        // name: item.name,
        // url: item.movie_img_url
      };
    } );
  }
  /**
   * 创建订单接口
   */
  static async creatOrder ( buyNumber, _data, product_id ) {
    // ticketId && ( _data.tikect_id = ticketId );
    console.log( wepy.$instance.globalData );
    return await this.request( {
      url: '/mnp/order/create',
      data: {
        ..._data,
        product_id: product_id,
        pay_channel: paymentChannel,
        buy_num: buyNumber,
        qrcode_from: wepy.$instance.globalData.qrcode_from || ''
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
  /**
   * @static 获得卡的信息
   * @param {any} code
   * @memberof Detail
   */
  static async getCardInfo ( code ) {
    return await this.request( {
      url: '/mnp/card/reward_info',
      data: {
        reward_code: code
      }
    } );
  }
  /**
   *
   * @static  接收卡片接口
   * @param {*} code
   * @param {*} phone
   */
  static async receiveCard ( code, phone ) {
    return await this.request( {
      url: '/mnp/card/fetch',
      method: 'POST',
      data: {
        reward_code: code,
        phone: phone
      }
    } );
  }
  /**
   *
   * @static  预约秒杀接口
   * @memberof Detail
   */
  static async setBook () {
    return await this.request( {
      url: '/mnp/seckill/attach2remind',
      method: 'POST'
    } );
  }

  // 获取气泡接口
  static async getBulleInfo ( data ) {
    tips.setLoading();
    return await this.request( {
      url: '/info/detail/bubble',
      data: data
    } );
  }

  // 获取砍价弹窗信息
  static async friendDetail ( cutId ) {
    return await this.request( {
      url: '/mnp/cut/friendDetail',
      data: {
        cut_id: cutId
      }
    } );
  }

  // 获取地理位置和影院信息
  static async getLocationToCinema ( data ) {
    return await this.request( {
      url: '/lbs/cinema/list',
      data: data
    } );
  }
}
