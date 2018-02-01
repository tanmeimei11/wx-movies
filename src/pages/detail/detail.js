import wepy from 'wepy';
import auth from '@/api/auth';
import Detail from '@/api/detail';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import shareWindow from '@/components/shareWindow';
import receiveGiftModal from '@/components/detail/receiveGiftModal';
import buyMutiModal from '@/components/detail/buyMutiModal';
import receiveFaildModal from '@/components/detail/receiveFaildModal';
import shareConnectMixin from '@/mixins/shareConnectMixin';
import loadingMixin from '@/mixins/loadingMixin';
import track from '@/utils/track';

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: 'in同城趴·电影王卡'
  }
  components = { report, shareWindow, receiveGiftModal, buyMutiModal, receiveFaildModal }
  mixins = [shareConnectMixin, loadingMixin]
  data = {
    toView: '',
    detailCode: {},
    showShareWindow: false,
    cardNumInfo: {
      title: '专享优惠 名额有限',
      desc: '为保障用户观影体验 限量发售五万张',
      num: '',
      percent: 0
    },
    cinemas: {
      img: '',
      list: [
        {
          address: '',
          addressImg: '',
          gps: '',
          name: ''
        }
      ]
    },
    movies: [
      { name: '',
        URL: ''
      }
    ],
    rules: [],
    detailStatus: {
      is_buy: '0'
    },
    isPay: false,
    detailText: {},
    qrcode_from: '',
    shareInfo: {},
    BuyMutiModalInfo: {  // 购买多张的信息
      show: false,
      number: 1,
      basePrice: '',
      baseDesc: ''
    },
    receiveGiftInfo: {
      btnStatus: false,
      phoneNum: '',
      show: false,
      cardInfo: {}
    },
    receiveFaildInfo: {
      show: false
    },
    cardCode: '', // 分享进来的转赠卡的卡片id
    bgImages: [], // 背景图
    partBg: '',
    shareImage: '',
    bgStyle: ''
  }
  events = {
    closeBuyMutiModal () {
      this.BuyMutiModalInfo.show = false;
    },
    changeBuyNum ( num ) {
      this.BuyMutiModalInfo.number = num;
    },
    changeReceBtnStatus ( val, phoneNum ) {
      this.receiveGiftInfo.btnStatus = val;
      phoneNum && ( this.receiveGiftInfo.phoneNum = phoneNum );
    },
    closeRecevieFaild () {
      this.receiveFaildInfo.show = false;
    },
    closeReceiveModal () {
      this.receiveGiftInfo.show = false;
    },
    async receive () {
      try {
        track( 'page_receive_box_confirm' );
        await Detail.receiveCard( this.cardCode, this.receiveGiftInfo.phoneNum );
        wepy.switchTab( {
          url: `/pages/self/self`
        } );
      } catch ( e ) {
        // 接收失败
        console.log( e );
      }
    },
    async payOrder () {
      try {
        if ( !this.isPay ) {
          this.isPay = true;
          track( 'page_number_box_pay' );
          await this.pay();
          this.isPay = false;
        }
      } catch ( e ) {
        this.isPay = false;
      }
    }
  }
  computed = {}
  methods = {
    openBuyMutiModal () {
      this.BuyMutiModalInfo.show = true;
    },
    toIndex () {
      wepy.switchTab( {
        url: `/pages/index/index`
      } );
    },
    gotoBottom () {
      track( 'page_rule' );
      this.toView = '';
      this.$apply();
      this.toView = 'details';
      this.$apply();
    },
    scroll: function ( e ) {
      console.log( e );
    },

    async normalPay () {
      this.openBuyMutiModal();
    },
    backIndex () {
      wepy.reLaunch( {
        url: '/pages/index/index'
      } );
    },
    shareCode () {
      track( 'page_share_buy' );
    },
    async sharePay () {
      this.showShareWindow = true;
      track( 'page_share_get_cash' );
    },
    closeShareWindow () {
      this.showShareWindow = false;
    },
    trackContact () {
      track( 'page_custom_service' );
    },
    async initShare () {
      var shareInfo = await Detail.getShareInfo();
      this.shareInfo = shareInfo;
      this.$apply();
    }
  }
  onShareAppMessage ( res ) {
    return {
      title: this.shareInfo.share_txt,
      path: `/pages/index/index?directTo=detail&qrcode_from=${this.shareInfo.qrcode_from}`,
      imageUrl: this.shareInfo.share_img
      // 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg'
    };
  }
  onReachBottom () {
    track( 'page_slide_to_end' );
  }
  async onShow () {
    if ( !this.data.isNotQun ) {
      this.init();
    } else {
      this.data.isNotQun = false;
    }
  }
  async onLoad ( options ) {
    track( 'page_screen' );
    this.initOptions( options );
    this.setShare();
    track( 'page_enter' );
    await auth.ready();
    track( 'page_entry' );
    await this.initCardStatus();
  }
  async init () {
    var res = await Detail.getDetailData( this.detailCode );
    this.cinemas = Detail.initCinemas( res.cinemas, res.all_cinema_addr_img );
    this.movies = Detail.initMovies( res.movies );
    this.detailText = this.initBuyText( res );
    this.rules = this.initRulesText( res.desc );
    this.BuyMutiModalInfo = {
      ...this.BuyMutiModalInfo,
      basePrice: res.pay_price,
      baseDesc: res.pay_notice
    };
    this.bgImages = res.bg_imgs;
    this.bgStyle = `background-image:url(${this.bgImages[0]}),url(${this.bgImages[1]}),url(${this.bgImages[2]})`;
    this.partBg = res.bg_img_01;
    var initCardNumRes = Detail.initCardNum( res );
    this.cardNumInfo.num = initCardNumRes.num;
    this.cardNumInfo.percent = initCardNumRes.percent;
    this.$apply();
    await auth.ready();
    this.detailStatus = await Detail.getDetailStatus();
    this.shareInfo = await Detail.getShareInfo();
    this.$apply();
  }
  async initCardStatus () {
    if ( this.cardCode ) {
      this.receiveGiftInfo.cardInfo = await Detail.getCardInfo( this.cardCode );
      var _info = this.receiveGiftInfo.cardInfo;
      if ( !_info.is_owner && _info.can_get ) {
        this.receiveGiftInfo.show = true;
        _info.phone && ( this.receiveGiftInfo.phoneNum = _info.phone );
      } else if ( !_info.is_owner && !_info.can_get ) {
        track( 'page_receive_box_expo' );
        this.receiveFaildInfo.show = true;
        this.receiveFaildInfo.msg = _info.msg;
      }
    }
  }
  /**
   * 初始化购买状态
   * @param {*} statusRes
   */
  initDetailStatus ( statusRes ) {
    return statusRes;
  }
  /**
   * 初始化购买文案
   * @param {*} desc
   */
  initBuyText ( res ) {
    return {
      ...res.desc,
      current_person_count: res.current_person_count
    };
  }
  /**
   * 初始化 规则信息
   * @param {*} desc
   */
  initRulesText ( desc ) {
    var _r = [ 0, 1, 2, 3 ];
    return _r.map( ( item ) => {
      return {
        title: desc[`desc${item * 2 + 17}`],
        desc: desc[`desc${item * 2 + 17 + 1}`]
      };
    } );
  }
  /**
   * 初始化连接上的参数
   * @param {*} options
   */
  initOptions ( options ) {
    console.log( options );
    this.detailCode = options;
    if ( options.qrcode_from ) {
      this.$parent.globalData.qrcode_from = options.qrcode_from;
      this.data.qrcode_from = options.qrcode_from;
    }
    this.data.shareId = options.share_uid || '';
    this.cardCode = options.cardCode || '';
  }
  /**
   * 设置分享的shareticket
   */
  setShare () {
    wepy.showShareMenu( {
      withShareTicket: true // 要求小程序返回分享目标信息
    } );
  }
  /**
   *  支付
   */
  async pay ( shareTicketInfo ) {
    if ( !auth._readyStatus ) {
      await auth.ready();
      await this.changeDetailStatus();
    }

    // if ( this.detailStatus.is_buy === '1' ) {
    //   return;
    // }

    try {
      var createRes = await Detail.creatOrder( shareTicketInfo, this.BuyMutiModalInfo.number );
      if ( createRes.code === '4000032129' || createRes.code === '4000031814' ) {
        tips.error( createRes.msg );
        return;
      }

      var getOrderRes = await Detail.getOrderDetail( createRes );
      track( 'page_wx_pay_start' );
      await wepy.requestPayment( getOrderRes.sign );
      track( 'page_pay_successful' );
      this.paySucc( createRes.order_no );
    } catch ( e ) {
      track( 'page_pay_failed' );
    }
  }
  /**
   *改变购买状态
   */
  async changeDetailStatus () {
    var statusRes = await Detail.getDetailStatus();
    this.detailStatus = statusRes;
    this.$apply();
  }
  /**
   *  支付成功
   */
  paySucc ( orderNo ) {
    wepy.navigateTo( {
      url: `../result/result?orderNo=${orderNo}`
    } );
  }
  payFail () {

  }
}
