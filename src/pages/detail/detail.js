import wepy from 'wepy';
import auth from '@/api/auth';
import Detail from '@/api/detail';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import shareConnectMixin from '@/mixins/shareConnectMixin';
import loadingMixin from '@/mixins/loadingMixin';

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: 'in同城趴·电影王卡'
  }
  components = { report }
  mixins = [shareConnectMixin, loadingMixin]
  data = {
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
    rules: [
      {
        class: 'pre',
        title: '【in同城趴电影王卡—功能介绍】',
        desc: [
          '1.本卡功能：使用本卡，可以在指定影院，通过“in同城趴电影”小程序免费选座，不限次数。',
          '2.使用时间：周一至周四任意时段，法定节假日除外。',
          '3.有效期限：本卡有效期3个月，即从2018年3月1日至2018年5月31日'
        ]
      },
      {
        class: 'pre',
        title: '【in同城趴电影王卡—使用方式】',
        desc: [
          '1.选座：点击“in同城趴电影”小程序［选座］功能进行影院选择及选座。',
          '2.验票：到达选择影厅后点击小程序［我的］出示二维码验证身份。'
        ]
      },
      {
        class: 'bold',
        title: '温馨提示：',
        desc: [
          '· 此次活动为in同城趴电影王卡预购活动，当预购人数不足4万人时将在活动结束后3-10个工作日内全额退款。',
          '· 活动最终解释权归九言科技所有'
        ]
      }
    ],
    detailStatus: {
      is_buy: '0'
    },
    isPay: false,
    detailText: {}
  }
  computed = {}
  methods = {
    async pay () {
      // tips.loading();
      try {
        if ( !this.isPay ) {
          this.isPay = true;
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
    }
  }

  events = {}
  onShareAppMessage ( res ) {
    return {
      title: '惊天福利！3个月杭州15大影院任意看 仅需109元！！！',
      path: '/pages/detail/detail',
      imageUrl: 'https://inimg01.jiuyan.info/in/2018/01/22/3B9691ED-096C-0D31-E2B9-F455D216E6AD.jpg',
      success: this.shareCallBack( res )
    };
  }
  async onShow () {
    if ( !this.data.isNotQun ) {
      this.init();
    } else {
      this.data.isNotQun = false;
    }
  }
  async onLoad ( options ) {
    this.initOptions( options );
    this.setShare();
    await auth.ready();
    await this.getIdFromQrcode(); // 两个小时没有购买之后 推送
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
    this.rules[0].title = statusRes.desc.desc07;
    this.rules[0].desc = statusRes.desc.desc08;
    this.rules[1].title = statusRes.desc.desc09;
    this.rules[1].desc = statusRes.desc.desc10;
    this.rules[2].title = statusRes.desc.desc11;
    this.rules[2].desc = statusRes.desc.desc12;
    this.$apply();
  }
  initOptions ( options ) {
    this.$parent.globalData.qrcode_from = options.qrcode_from;
    this.data.shareId = options.share_uid || '';
    this.data.qrcode_from = options.qrcode_from;
  }
  setShare () {
    wepy.showShareMenu( {
      withShareTicket: true // 要求小程序返回分享目标信息
    } );
  }
  getIdFromQrcode () {
    if ( !this.data.shareId ) {
      return;
    }
    Detail.request( {
      url: '/index/qrscan',
      data: {
        share_uid: this.data.shareId
      }
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
      this.paySucc();
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
  paySucc () {
    wepy.navigateTo( {
      url: '../result/result'
    } );
  }
  payFail () {

  }
}
