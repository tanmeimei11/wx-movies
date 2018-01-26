import wepy from 'wepy';
import auth from '@/api/auth';
import Detail from '@/api/detail';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import shareWindow from '@/components/shareWindow';
import shareConnectMixin from '@/mixins/shareConnectMixin';
import loadingMixin from '@/mixins/loadingMixin';
import track from '@/utils/track';

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: 'in同城趴·电影王卡'
  }
  components = { report, shareWindow }
  mixins = [shareConnectMixin, loadingMixin]
  data = {
    toView: '',
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
    shareInfo: {}
  }
  computed = {}
  methods = {
    toIndex () {
      console.log(11)
      wepy.switchTab( {
        url: `/pages/index/index`
      } );
    },
    gotoBottom () {
      this.toView = '';
      this.$apply();
      this.toView = 'details';
      this.$apply();
    },
    scroll: function(e) {
      console.log(e)
    },

    async normalPay () {
      try {
        if ( !this.isPay ) {
          this.isPay = true;
          track( 'page_buy' , {"from":this.$parent.globalData.qrcode_from});
          await this.pay();
          this.isPay = false;
        }
      } catch ( e ) {
        this.isPay = false;
      }
    },
    backIndex () {
      wepy.reLaunch( {
        url: '/pages/index/index'
      } );
    },
    shareCode() {
      track( 'page_share_buy' , {"from":this.$parent.globalData.qrcode_from});
    },
    async sharePay () {
      // await tips.loading()
      this.showShareWindow = true;
      // var shareInfo = await Detail.getShareInfo()
      // this.shareInfo = shareInfo
      // this.$apply()
    },
    closeShareWindow () {
      this.showShareWindow = false;
    },
    trackContact () {
      track( 'page_custom_service' );
    },
    async initShare () {
      var shareInfo = await Detail.getShareInfo()
      this.shareInfo = shareInfo
      this.$apply();
    }
  }
  onShareAppMessage ( res ) {
    return {
      title: this.shareInfo.share_txt,
      path: `/pages/index/index?directTo=detail&qrcode_from=${this.shareInfo.qrcode_from}`,
      imageUrl: 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg'
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
    track( 'page_enter' , {"from":this.$parent.globalData.qrcode_from});
    await auth.ready();
    track( 'page_entry' , {"from":this.$parent.globalData.qrcode_from});
  }
  async init () {
    var res = await Detail.getDetailData();
    this.cinemas = Detail.initCinemas( res.cinemas, res.all_cinema_addr_img );
    this.movies = Detail.initMovies( res.movies );
    var initCardNumRes = Detail.initCardNum( res );
    this.cardNumInfo.num = initCardNumRes.num;
    this.cardNumInfo.percent = initCardNumRes.percent;
    this.$apply();
    await auth.ready();
    var statusRes = await Detail.getDetailStatus();
    this.detailStatus = statusRes;
    this.detailText = statusRes.desc;
    this.rules[0] = {
      title: statusRes.desc.desc17,
      desc: statusRes.desc.desc18
    }
    this.rules[1] = {
      title: statusRes.desc.desc19,
      desc: statusRes.desc.desc20
    }
    this.rules[2] = {
      title: statusRes.desc.desc21,
      desc: statusRes.desc.desc22
    }
    this.rules[3] = {
      title: statusRes.desc.desc23,
      desc: statusRes.desc.desc24
    }
    var shareInfo = await Detail.getShareInfo()
    this.shareInfo = shareInfo
    this.$apply();
  }
  initOptions ( options ) {
    if (options.qrcode_from) {
      this.$parent.globalData.qrcode_from = options.qrcode_from;
    }
    this.data.shareId = options.share_uid || '';
    this.data.qrcode_from = options.qrcode_from;
  }
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

    if ( this.detailStatus.is_buy === '1' ) {
      return;
    }
    try {
      var createRes = await Detail.creatOrder( shareTicketInfo );
      if ( createRes.code === '4000032129' || createRes.code === '4000031814' ) {
        tips.error( createRes.msg );
        return;
      }
      var getOrderRes = await Detail.getOrderDetail( createRes );
      await wepy.requestPayment( getOrderRes.sign );
      this.paySucc(createRes.order_no);
    } catch ( e ) {

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
  paySucc (order_no) {
    wepy.navigateTo( {
      url: `../result/result?orderNo=${order_no}`
    } );
  }
  payFail () {

  }
}
