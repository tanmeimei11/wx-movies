import wepy from 'wepy';
import auth from '@/api/auth';
import Detail from '@/api/detail';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import shareWindow from '@/components/shareWindow';
import receiveGiftModal from '@/components/detail/receiveGiftModal';
import receiveTicketModal from '@/components/detail/receiveTicketModal';
import buyMutiModal from '@/components/detail/buyMutiModal';
import receiveFaildModal from '@/components/detail/receiveFaildModal';
import channelModal from '@/components/detail/channelModal';
import notice from '@/components/detail/notice';
import moviePart from '@/components/detail/moviePart';
import adBanner from '@/components/adBanner';
// import seckill from '@/components/detail/seckill';
import lekeReceiveModal from '@/components/leke/lekeReceiveModal';
import shareLekeMixin from '@/mixins/shareLekeMixin';
import loadingMixin from '@/mixins/loadingMixin';
import track from '@/utils/track';
import {getParamV} from '@/utils/common';

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: 'in同城趴·电影王卡'
  }
  components = {report, shareWindow, receiveGiftModal, buyMutiModal, receiveFaildModal, receiveTicketModal, channelModal, notice, moviePart, adBanner, lekeReceiveModal}
  mixins = [loadingMixin, shareLekeMixin]
  data = {
    windowWidth: 375,
    a: 1,
    promoPrice: '', // 活动价格
    payPrice: '', // 原价 159
    toView: '',
    bannerInfo: [],
    videoConf: {},
    videoShow: false,
    videoShow2: false,
    getMyInfo: {},
    detailCode: {},
    cinemas: {
      img: '',
      list: []
    },
    movies: [
      { name: '',
        url: ''
      }
    ],
    moviesSections: [],  // 电影模块的list
    movieImg: '', // 电影模块的底图
    cardImg: '', // 支付卡片的图片
    rules: [],
    detailStatus: {
      is_buy: '0',
      fetch_ticket: false
    },
    isPay: false,
    detailText: {},
    qrcode_from: '',
    shareInfo: {},  // 分享信息
    showShareWindow: false,
    buyMutiModalInfo: {  // 购买多张的信息
      show: false,
      number: 1,
      basePrice: '',
      baseDesc: ''
    },
    receiveGiftInfo: {  // 接收卡片
      btnStatus: false,
      phoneNum: '',
      show: false,
      cardInfo: {}
    },
    receiveFaildInfo: { // 失败弹窗
      type: '',
      show: false,
      msg: ''
    },
    receiveTicketInfo: { // 接收电影票
      show: false,
      fetch_ticket: false,
      shareCode: '',
      userInfo: {}
    },
    channelModalInfo: { // 渠道优惠券弹窗
      rp_code: null,
      show: false,
      imgUrl: ''
    },
    noticeInfo: { // 右下角提示信息
      show: false,
      rp_notice: []
    },
    discountInfo: { // 优惠抵扣信息
      show: false,
      ticketId: '',
      detail: []
    },
    cardCode: '', // 分享进来的转赠卡的卡片code
    bgImages: [], // 背景图
    icon: [],
    course: {},
    onTop: false,
    tabbar: [],
    tabbarID: 0,
    tabHeight: '',
    partHeight: [500, 1500, 3000, 3500],
    loadHeight: [],
    content: {},
    partBg: '',
    shareImage: '',
    bgStyle: '',
    statusQuery: {}, // 状态参数
    fixBtnText: ['', ''], // fix按钮的文案
    // seckillInfo: { // 秒杀信息
    //   enabled: false
    // },
    unionInfo: { // 拼团信息

    },
    tabText: [],
    lekePromoInfo: {  // leke活动信息
      isShow: false
    }
  }
  events = {
    closeLekeModal () {
      this.lekePromoInfo.isShow = false;
    },
    closeBuyMutiModal () {
      this.buyMutiModalInfo.show = false;
    },
    changeBuyNum ( num ) {
      this.buyMutiModalInfo.number = num;
    },
    changeReceBtnStatus ( val, phoneNum ) {
      this.receiveGiftInfo.btnStatus = val;
      phoneNum && ( this.receiveGiftInfo.phoneNum = phoneNum );
    },
    closeRecevieFaild () {
      this.receiveFaildInfo.show = false;
      if ( this.receiveFaildInfo.type === 'notGetTicket' ) {
        track( 'fission_other_soldout_iknow' );
      }
    },
    closeReceiveModal () {
      this.receiveGiftInfo.show = false;
    },
    closeRecevieTicket () {
      this.receiveTicketInfo.show = false;
    },
    // 关闭渠道红包弹窗
    closeChannelModal () {
      // this.channelModalInfo.show = false;
      // if ( !this.seckillInfo.enabled || ( this.seckillInfo.enabled && this.seckillInfo.status !== '1' ) ) {
      //   this.noticeInfo.show = true;
      // }
    },
    // // 秒杀开始 支付信息初始化
    // seckill () {
    //   if ( this.seckillInfo.status === '1' ) {
    //     this.seckillPay();
    //   }
    // },
    // // 修改秒杀信息
    // changeSeckill ( status ) {
    //   if ( typeof status === 'string' ) { status = {status: status}; }
    //   this.seckillInfo = {
    //     ...this.seckillInfo,
    //     ...status
    //   };
    //   this.changeToSecKillInfo();
    //   this.$apply();
    // },
    async receive () {
      try {
        track( 'page_receive_box_confirm' );
        await Detail.receiveCard( this.cardCode, this.receiveGiftInfo.phoneNum );
        wepy.switchTab( {
          url: `/pages/self/self`
        } );
      } catch ( e ) {
        // 接收失败
        this.receiveGiftInfo.show = false;
        this.receiveFaildInfo = {
          ...this.receiveFaildInfo,
          show: true,
          msg: '领取失败了'
        };

        this.$apply();
      }
    },
    async payOrder () {
      await this.payOrderReal();
    }
  }
  methods = {
    openGroup () {
      track( 'page_open_group' );
      wepy.navigateToMiniProgram( {
        appId: this.unionInfo.app_id,
        path: this.unionInfo.path
      } );
    },
    showVideo () {
      track( 'page_video_click' );
      this.videoShow = true;
    },
    closeVideo () {
      this.videoShow = false;
    },
    showVideo2 () {
      this.videoShow2 = true;
    },
    closeVideo2 () {
      this.videoShow2 = false;
    },
    videoEnd () {
      console.log( 'end' );
      this.videoShow = false;
      this.videoShow2 = false;
    },
    openBuyMutiModal () {
      this.openPayWin();
    },
    toIndex () {
      wepy.switchTab( {
        url: `/pages/index/index`
      } );
    },
    goDetail ( e ) {
      this.toView = '';
      this.$apply();
      this.toView = e.currentTarget.dataset.tab;
      this.$apply();
      this.tabbarID = e.currentTarget.dataset.id;
    },
    getMovieTicket ( type ) {
      if ( type === 'lingqu' ) {
        // 来自弹窗的领取
        track( 'fission_other_immediately_receive' );
      } else {
        track( 'fission_immediately_get' );
      }

      wepy.navigateTo( {
        url: `/pages/ticket/ticket`
      } );
    },
    async normalPay () {
      this.openBuyMutiModal();
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
    }
  }
  onShareAppMessage ( res ) {
    var fun = () => {};
    if ( res.from === 'button' ) {
      var that = this;
      fun = this.shareCallBack( that );
    }
    return {
      title: this.shareInfo.share_txt,
      path: `/pages/index/index?directTo=detail&qrcode_from=${this.shareInfo.qrcode_from}`,
      imageUrl: this.shareInfo.share_img,
      success: fun
    };
  }
  scroll ( e ) {
    if ( e.detail.scrollTop > this.tabHeight ) {
      this.onTop = true;
    } else {
      this.onTop = false;
    }
    if ( e.detail.scrollTop > this.partHeight[0] && !this.loadHeight[0] ) {
      this.loadHeight[0] = true;
      console.log( 'load1' );
    } else if ( e.detail.scrollTop > this.partHeight[1] && !this.loadHeight[1] ) {
      this.loadHeight[1] = true;
      console.log( 'load2' );
    } else if ( e.detail.scrollTop > this.partHeight[2] && !this.loadHeight[2] ) {
      this.loadHeight[2] = true;
      console.log( 'load3' );
    } else if ( e.detail.scrollTop > this.partHeight[3] && !this.loadHeight[3] ) {
      this.loadHeight[3] = true;
      console.log( 'load4' );
    }
    this.$apply();
  }
  onReachBottom () {
    track( 'page_slide_to_end' );
  }
  async onLoad ( options ) {
    track( 'page_screen' );
    this.initOptions( options );
    this.setShare();
    track( 'page_enter' );
    await this.init();

    // 数据之后的操作
    console.log( 'options', options );
    if ( options.show_pay_win ) {
      this.openPayWin();
    }
    if ( options.promotion ) {
      this.openPayWin(); // 支付信息初始化
      this.payOrderReal();// 立即支付
    }
  }
  async init () {
    // var res = await Detail.getDetailData( this.detailCode );
    var newRes = await Detail.getDetailDataNew( this.detailCode );
    this.cinemas = Detail.initCinemas( newRes.cinemas, newRes.all_cinema_addr_img );
    // this.moviesSections = Detail.initMovies( res.movie_sections );
    // this.detailText = this.initBuyText( res );
    this.rules = this.initRulesText( newRes.desc );
    this.initBannerInfo( newRes );
    this.initVideoInfo( newRes );
    this.initBuyInfo( newRes );
    this.initFixBtnText( newRes );
    // this.initSeckillInfo( newRes );
    this.initBgImages( newRes );
    this.unionInfo = newRes.union_info;
    this.$apply();
    await auth.ready();
    track( 'page_entry1' );
    this.detailStatus = await Detail.getDetailStatus( this.statusQuery );
    this.initReceiveTicketInfo( this.detailStatus );
    this.initChannelDiscount( this.detailStatus );
    this.initLekeInfo( this.detailStatus );
    this.shareInfo = await Detail.getShareInfo();
    if ( this.cardCode ) { await this.initCardStatus(); };
    this.countHeight();
    track( 'page_loading_complete' );
    this.$apply();
  }
  initLekeInfo ( status ) {
    if ( !status.leke_info || this.cardCode ) { return; }
    this.lekePromoInfo = {
      isShow: true,
      ...status.leke_info
    };
  }
  /**
   *
   * 供组件和当前页面使用
  */
  async payOrderReal () {
    try {
      this.isPay = true;
      track( 'page_number_box_pay' );
      await this.pay();
    } catch ( e ) {

    }
  }
  /**
   * 广告位
   *
   * @param {any} res
   * @memberof Index
   */
  initBannerInfo ( res ) {
    // this.bannerInfo = res.ad_info;
    this.bannerInfo = res.ad_info_list || [];
    if ( res.ad_info ) {
      track( 'page_ad_expo' );
    }
  }
  /**
   *
   * 初始化video
   * @param {any} res
   * @memberof Index
   */
  initVideoInfo ( res ) {
    if ( res.video_info ) {
      res.video_info.support = wx.canIUse( 'video' );
      track( 'page_video_expo' );
    }
    this.videoConf = res.video_info;
  }
  // /**
  //  * @memberof Index
  //  */
  // seckillPay () {
  //   this.statusQuery = {
  //     is_seckill: 1
  //   };
  //   this.buyMutiModalInfo.basePrice = this.seckillInfo.price;
  //   this.buyMutiModalInfo.show = true;
  // }
  /**
   * 支付弹窗
   */
  openPayWin () {
    // 活动价格最高
    if ( this.promotion ) {
      track( `${this.promotion}_page_buy` );
      // this.buyMutiModalInfo.basePrice = this.detailStatus.promotion_channel_price || this.payPrice;
    } else {
      // 秒杀
      // if ( this.seckillInfo.enabled && this.seckillInfo.status === '1' ) {
      //   track( 'page_spike_limited_buy' );
      //   this.seckillPay();
      // } else {
      this.buyMutiModalInfo.basePrice = this.payPrice;
      // }
      if ( this.discountInfo.ticketId && this.discountInfo.show ) {
        track( 'fission_minus_50_buy' );
      } else {
        track( 'page_buy' );
      }
    }

    this.buyMutiModalInfo.show = true;
    this.$apply();
  }
  // /**
  //  *
  //  *
  //  * @param {any} res
  //  * @returns
  //  * @memberof Index
  //  */
  // initSeckillInfo ( res ) {
  //   if ( !res.seckill_info ) { return; }
  //   this.seckillInfo = res.seckill_info;
  //   // if ( false ) {
  //   if ( this.seckillInfo.enabled ) {
  //     track( 'page_spike_expo' );
  //     // 这里传值是因为 界面还没有更新 调了组件的方法 所以直接船只过去保证能立刻取到真实的值
  //     this.$invoke( 'seckill', 'countdown', {
  //       start: res.seckill_info.start_countdown,
  //       duration: res.seckill_info.duration
  //     } );
  //     this.changeToSecKillInfo();
  //   }
  // }

  // /**
  //  *
  //  * 秒杀的时候改变支付的状态 清除优惠信息
  //  * @memberof Index
  //  */
  // changeToSecKillInfo () {
  //   // 如果变成立即秒杀的时候修改
  //   // 1.fixbtn的样式和文案
  //   // 2.去掉优惠信息

  //   if ( this.seckillInfo.status === '1' ) {
  //     this.fixBtnText = [
  //       {
  //         price: `${this.seckillInfo.price}立即秒杀`,
  //         text: '限时限量秒杀火热进行中'
  //       }
  //     ];
  //   } else if ( this.seckillInfo.status === '2' ) {
  //     this.fixBtnText = this.tabText;
  //   } else {
  //     this.fixBtnText = [
  //       {
  //         price: `${this.payPrice}立即抢购`
  //       }
  //     ];
  //   }
  //   console.log( this.fixBtnText );
  //   if ( this.seckillInfo.status === '1' ) {
  //     this.discountInfo = {
  //       show: false,
  //       ticketId: '',
  //       detail: []
  //     };
  //   }
  // }

  /**
   * 初始化fixed按钮的文案
   * @param {*} res
   */
  initFixBtnText ( res ) {
    this.tabText = res.union_btn_txts;
    this.fixBtnText = res.union_btn_txts;
  }
  /**
   *  初始化从哪里进来  // 1.立即升级 2.分享送三张电影票 3.红包
   *  返回  createorder cfstatus 接口的参数
   */
  getDetailStatusQuery () {
    var _data = {};
    this.receiveTicketInfo.shareCode && ( _data.share_code = this.receiveTicketInfo.shareCode );
    this.discountInfo.ticketId && ( _data.ticket_id = this.discountInfo.ticketId );
    this.channelModalInfo.rp_code && ( _data.rp_code = this.channelModalInfo.rp_code );
    this.promotion && ( _data.promotion = this.promotion );
    this.statusQuery = _data;
    this.$apply();
    return _data;
  }
  /**
   * 初始化接收卡的信息
   * @param {*} res
   */
  initReceiveTicketInfo ( res ) {
    if ( this.discountInfo.ticketId ) {  // 升级点进来
      this.discountInfo.show = true;
      this.noticeInfo.show = true;
      return;
    }

    // 分享三张电影票点进来
    if ( res.ticket_switch ) { // 票已经领完了
      track( 'fission_other_soldout_expo' );
      this.receiveFaildInfo = {
        type: 'notGetTicket',
        show: true,
        msg: res.ticket_desc
      };
    } else if ( res.fetch_ticket && res.share_user_info && this.receiveTicketInfo.shareCode ) {  // 送你三张电影票
      track( 'fission_other_receivebox_expo' );
      this.receiveTicketInfo = {
        ...this.receiveTicketInfo,
        show: true,
        userInfo: res.share_user_info
      };
    }
  }
  /**
   * 初始化渠道优惠信息
   */
  initChannelDiscount ( res ) {
    if ( res.rp_bg_img ) {
      this.channelModalInfo.imgUrl = res.rp_bg_img;
      this.channelModalInfo.show = true;
      track( 'movie_fission_redpack_expo' );
    }
    if ( res.rp_notice && res.rp_notice.length ) {
      this.noticeInfo.rp_notice = res.rp_notice;
      !this.promotion && ( this.noticeInfo.show = true );
    }
    if ( res.rp_deduction && res.rp_deduction.length ) {
      this.discountInfo.detail = res.rp_deduction;
      this.discountInfo.show = true;
    }
  }
  /**
   * 初始化背景图
   * @param {*} res
   */
  initBgImages ( res ) {
    this.movieImg = res.movies_bottom_pic;
    this.cardImg = res.card_img;
    this.bgImages = res.bg_imgs;
    this.icon = res.icon;
    this.course = res.course;
    this.tabbar = res.tabbar;
    this.content = res.content;
    this.movies = res.movies;
    // this.bgStyle = `background-image:url(${this.bgImages[0]}),url(${this.bgImages[1]}),url(${this.bgImages[2]})`;
    this.partBg = res.bg_img_01;
  }

   /**
   * 初始化支付信息
   * @param {*} res
   */
  initBuyInfo ( res ) {
    this.payPrice = res.pay_price;
    this.buyMutiModalInfo = {
      ...this.buyMutiModalInfo,
      basePrice: parseInt( res.pay_price ),
      baseDesc: res.pay_notice
    };
  }
  /**
   * 初始化接收卡
   * @param {*} statusRes
   */
  async initCardStatus () {
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
  initQrcodeFrom ( options ) {
    console.log( options );
    var qf = options.qrcode_from || getParamV( options, 'qf' );
    this.$parent.globalData.qrcode_from = qf;
    this.qrcode_from = qf;
    console.log( this.qrcode_from );
  }
  /**
   * 初始化计算内容高度
   */
  countHeight () {
    this.windowWidth = wx.getSystemInfoSync().windowWidth;
    var hasBanner = !!this.bannerInfo;
    var tabHeight = hasBanner ? 1900 : 1720;
    this.tabHeight = this.windowWidth / 750 * tabHeight;
    this.partHeight.forEach( ( e, i ) => {
      if ( hasBanner ) {
        e += 180;
      }
      this.partHeight[i] = this.windowWidth / 750 * e;
    } );
  }
  /**
   * 初始化连接上的参数
   * @param {*} options
   */
  initOptions ( options ) {
    this.detailCode = options;
    this.initQrcodeFrom( options );
    this.shareId = options.share_uid || '';
    this.cardCode = options.cardCode || '';
    if ( options.ticketId ) {  // 立即升级点过来
      this.discountInfo.ticketId = options.ticketId;
      this.discountInfo.show = true;
    }
    if ( options.shareCode ) { // 由别人分享电影票点进来
      this.receiveTicketInfo.shareCode = options.shareCode;
    }
    if ( options.rp_code ) {
      this.channelModalInfo.rp_code = options.rp_code;
    } else {
      this.channelModalInfo.rp_code = getParamV( options, 'rc' );
    }
    if ( options.show_pay_win ) {
      this.show_pay_win = options.show_pay_win;
      // this.openPayWin(); // 这里授权之后的数据还没有回来 会出现问题
    }
    if ( options.promotion ) {
      this.promotion = options.promotion;
      // 这里授权之后的数据还没有回来 会出现问题
      // this.openPayWin(); // 支付信息初始化
      // this.payOrderReal();// 立即支付
    } else {
      this.promotion = getParamV( options, 'promo' );
    }

    this.getDetailStatusQuery();
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
  async pay ( ) {
    try {
      await auth.ready();
      var createRes = await Detail.creatOrder( this.buyMutiModalInfo.number, this.statusQuery );
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
      // this.buyMutiModalInfo.show = false;
      this.$apply();
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
    this.clearCutInfo();
    wepy.navigateTo( {
      url: `../result/result?orderNo=${orderNo}`
    } );
  }
  payFail () {
  }
  /**
   *  清除优惠信息
   */
  clearCutInfo () {
    this.noticeInfo.show = false;
    this.discountInfo.show = false;
    this.discountInfo.ticketId = '';
    this.buyMutiModalInfo.show = false;
    this.$apply();
  }

  async getCardByLekePromo () {
    this.lekePromoInfo.isShow = false;
    this.initQrcodeFrom( {
      qrcode_from: 'leke_reward_01'
    } );
    this.cardCode = this.lekePromoInfo.leke_code;
    this.$apply();
    await this.init();
  }
}
