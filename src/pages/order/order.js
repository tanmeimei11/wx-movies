import wepy from 'wepy';
import { paymentChannel, businessParty } from '@/utils/config';
// import tips from '@/utils/tips';
import qrcodeFromMixin from '@/mixins/qrcodeFromMixin';
import auth from '@/api/auth';
// import track from '@/utils/track';
import Order from '@/api/order';

export default class order extends wepy.page {
  config = {
    navigationBarTitleText: '订单详情'
  }
  data = {
    isLimitNum: false, // 限制购买的数量
    qrcodeFrom: '',
    partnerCode: '', // 合作方的code
    productId: '', // 商品id
    tikectId: '', // 票的id
    isSeckill: 0, // 是否秒杀
    promotion: '', // 活动的渠道
    productInfo: {
      name: '',
      desc: '',
      url: '',
      price: ''
    }, // 商品信息
    discountInfo: [], // 总的买几张票的优惠信息
    explainInfo: {
      name: '',
      content: ''
    }, // 支付文案
    payInfo: {
      money: 0,
      number: 0,
      realMoney: 0
    }, // 支付参数
    targetDiscount: null // 最终的优惠信息
  };
  mixins = [qrcodeFromMixin]
  methods = {
    async pay () {
      try {
        await auth.ready();
        let _orderData = this.getOrderData();
        let _createRes = await Order.getOrderInfo( _orderData );
        // if ( _createRes.code === '4000032129' || _createRes.code === '4000031814' ) {
        //   tips.error( _createRes.msg );
        //   return;
        // }
        console.log( _createRes );

        let _createResData = {
          _token: wepy.$instance.globalData.xToken,
          payment_channel: paymentChannel,
          business_party: businessParty,
          order_detail: _createRes.order_detail,
          extend_params: JSON.stringify( {
            open_id: _createRes.open_id
          } )
        };

        console.log( _createRes, _createResData );

        let _payNetworkRes = await Order.getPayNetwork( _createResData );
        await wepy.requestPayment( _payNetworkRes.sign );
        this.paySucc( _createRes.redirect_info );
      } catch ( e ) {
        console.error( e );
        // track( 'page_pay_failed' );
      }
    },
    opJia () {
      if ( this.payInfo.number > 19 || this.isLimitNum ) {
        return;
      }
      // track( 'page_number_box_plus' );
      this.payInfo.number++;
    },
    opJian () {
      if ( this.payInfo.number < 2 || this.isLimitNum ) {
        return;
      }
      // track( 'page_number_box_minus' );
      this.payInfo.number--;
    }
  };

  watch = {
    payInfo ( newVal, oldVal ) { // 根据购买数量来计算优惠的最大值
      if ( newVal.number === oldVal.number ) {
        return;
      }

      var _num = newVal.number;
      let _discountIdx = Math.min( _num - 1, this.discountInfo.length - 1 );
      this.targetDiscount = this.discountInfo[_discountIdx] || {};
      this.payInfo.money = _num * this.productInfo.price;
      this.payInfo.realMoney = this.payInfo.money - ( this.targetDiscount.price || 0 );
    }
  };
  /**
   *
   * 初始化商品信息
   *
  */
  async initProductInfo () {
    console.log( 'ready' );
    let _data = this.getOrderData();
    let data = await Order.getProductInfo( _data );
    if ( !data ) {
      console.log( 'error' );
    } else {
      this.productInfo = {
        name: data.product_name,
        desc: data.product_desc,
        url: data.product_img_url,
        price: data.origin_price
      };

      this.discountInfo = Object.keys( data.rp_deduction ).map( key => {
        return {
          id: data.rp_deduction[key].id,
          desc: data.rp_deduction[key].d_desc,
          price: data.rp_deduction[key].d_price
        };
      } );

      this.explainInfo = {
        name: data.explain_name,
        content: data.explain_content
      };

      this.payInfo = {
        money: data.origin_price,
        number: 1,
        realMoney: data.origin_price
      }; // 支付参数

      this.$apply();
    }
  }

  getOrderData () {
    return {
      product_id: this.productId,
      pay_channel: paymentChannel,
      buy_num: this.payInfo.number || 1,
      ticket_id: this.ticketId || '',
      is_seckill: this.isSeckill || '',
      promotion: this.promotion || '',
      partner_code: this.partnerCode || ''
    };
  }
  /**
   * 成功之后的跳转
   * @param {*} res
   */
  paySucc ( res ) {
    // 与电信合作 直接跳回他们的小程序
    if ( res ) {
      this.redirect( res );
    }
  }

  showNotSupport () {
    wepy.showModal( {
      title: '提示',
      content: '您的微信暂不支持该功能，请升级您的微信客户端'
    } );
  }

  redirectH5 ( tplData ) {
    if ( !wepy.canIUse( 'web-view' ) ) {
      this.showNotSupport();
      return;
    }
    wepy.navigateTo( {
      url: `/pages/webview/webview?h5url=${encodeURIComponent( tplData.landing_path )}`
    } );
  }

  redirectMiniprogram ( tplData ) {
    if ( !wepy.canIUse( 'navigateToMiniProgram' ) ) {
      this.showNotSupport();
      return;
    }
    wepy.navigateToMiniProgram( {
      appId: tplData.app_id,
      path: tplData.landing_path,
      success ( res ) {
          // 打开成功
      },
      fail: ( err ) => {
        wepy.showModal( {
          title: '提示',
          content: err
        } );
      }
    } );
  }

  redirectPath ( tplData ) {
    var tab = ['index', 'seat', 'self'];
    if ( tab.indexOf( tplData.landing_path.split( '/' )[2] ) > -1 ) {
      wepy.switchTab( {
        url: tplData.landing_path
      } );
    } else {
      wepy.navigateTo( {
        url: tplData.landing_path
      } );
    }
  }

  /**
   * 1，小程序内部 2，跳转起他的小程序 3，跳转h5
   * @param {*} tplData
   */
  redirect ( tplData ) {
    switch ( tplData.type ) {
      case 'h5':this.redirectH5( tplData ); break;
      case 'miniprogram':this.redirectMiniprogram( tplData ); break;
      case 'path':this.redirectPath( tplData ); break;
    }
  }
  /**
   *初始化参数 订单页面 必要参数：1.商品的id product_id 2.渠道promotion
   * @param {*} options
   */
  initOptions ( options ) {
    this.partnerCode = options.partner_code;
    this.productId = options.product_id;
    this.tikectId = options.ticket_id;
    this.promotion = options.promotion;
    this.isSeckill = options.is_seckill;
    this.isLimitNum = options.isLimitNum;
  }

  async onLoad ( options ) {
    this.initOptions( options );
    this.initQrcodeFrom( options );
    await auth.ready( true );
    await this.initProductInfo();
  }
}
