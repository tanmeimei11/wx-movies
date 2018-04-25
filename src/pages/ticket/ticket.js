import wepy from 'wepy';
import auth from '@/api/auth';
import Ticket from '@/api/ticket';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import shareConnectMixin from '@/mixins/shareConnectMixin';
import receiveFaildModal from '@/components/detail/receiveFaildModal';
import adBanner from '@/components/adBanner';
import track from '@/utils/track';
import {getParamV} from '@/utils/common';

export default class ticket extends wepy.page {
  config = {
    navigationBarTitleText: '电影票'
  }
  components = { report, receiveFaildModal, adBanner}
  mixins = [shareConnectMixin]
  data = {
    bannerInfo: [], // 头部广告
    rulesShow: false,
    type: '',
    btninfo: {},
    isShowMobile: false,
    isFull: false,
    rules: [], // 规则文案
    tickets: [],
    phone: '',
    isShowUpgrade: false,
    upgradeTicket: '',
    shareIndex: '',
    cardsbg: ['', '', ''],
    cards: [],
    cardInfo: {},
    ticketID: '',
    share_img: '',
    share_code: '',
    share_title: '',
    qrcode_from: '',
    ticket_switch: '',
    upgrade_img: '',
    abtest: '0',

    receiveFaildInfo: {
      msg: '',
      show: false
    }
  }

  onShareAppMessage ( res ) {
    var query = `?shareCode=${this.share_code}&qrcode_from=${this.qrcode_from}`;
    if ( res.target ) {
      this.shareIndex = res.target.dataset.index;
      this.ticketID = res.target.dataset.code;
    }
    var fun = () => {};
    if ( res.from === 'button' ) {
      var that = this;
      fun = this.shareCallBack( that );
    }
    return {
      title: this.share_title,
      path: `/pages/detail/detail${query}`,
      imageUrl: this.share_img,
      // 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg'
      success: fun
    };
  }

  events = {
    closeRecevieFaild () {
      track( 'fission_share_to_group_soldout_iknow' );
      this.receiveFaildInfo.show = false;
    }
  }

  methods = {
    showUpgrade ( item ) {
      var ticketid = item.id;
      if ( item.ticket_status == '6' ) {
        wepy.switchTab( {
          url: '/pages/seat/seat'
        } );
        return;
      }
      if ( item.ticket_status == '2' ) {
        track( 'fission_upgrade' );
        track( 'fission_upgradebox_expo' );
        if ( this.abtest === '1' ) {
          var link = `https://h5.in66.com/inpromo/in-movies/movieList.html?ticketID=${ticketid}&_token=${this.$parent.globalData.xToken}`;
          wepy.navigateTo( {
            url: `/pages/webview/webview?h5url=${encodeURIComponent( link )}`
          } );
          return;
        }
      } else if ( item.ticket_status == '5' ) {
        track( 'ticket_overdue_click' );
      }
      wepy.navigateTo( {
        url: `/pages/upgrade/upgrade?ticketid=${ticketid}`
      } );

      // this.isShowUpgrade = true;
      // this.upgradeTicket = e.currentTarget.dataset.ticket;
    },
    alert () {
      if ( this.ticket_switch ) {
        track( 'fission_share_to_group_soldout_expo' );
        this.receiveFaildInfo.show = true;
      }
    },
    bindKeyInput ( e ) {
      this.phone = e.detail.value;
      if ( e.detail.value.length === 11 ) {
        this.isFull = true;
      } else {
        this.isFull = false;
      }
    },
    async submit () {
      if ( this.isFull ) {
        this.openCard();
        this.isShowMobile = false;
        tips.success( '绑定成功' );
      }
    },
    openRules () {
      this.rulesShow = true;
    },
    close () {
      this.isShowUpgrade = false;
      this.rulesShow = false;
    },
    closePhone () {
      this.isShowMobile = false;
    },
    havePhone ( e ) {
      this.cardInfo = e.currentTarget.dataset;
      if ( this.phone ) {
        this.openCard();
      } else {
        this.isShowMobile = true;
      }
    },
    async receive ( e ) {
      await this.init();
    },
    toDetail () {
      track( 'fission_upgradebox_upgrade' );
      wepy.reLaunch( {
        url: `/pages/detail/detail?ticketId=${this.upgradeTicket}`
      } );
    },
    toSelf () {
      wepy.switchTab( {
        url: `/pages/self/self`
      } );
    }
  }
  /**
   * 设置分享的shareticket
   */
  setShare () {
    wepy.showShareMenu( {
      withShareTicket: true // 要求小程序返回分享目标信息
    } );
  }

  async openCard () {
    var thisTicket = this.cardInfo.ticket;
    var thisIndex = this.cardInfo.index;
    var ticketid = this.cardInfo.ticketid;
    track( 'fission_select_ticket' );
    var card = await Ticket.pickCard( ticketid, thisIndex, this.phone, this.$parent.globalData.shareTicket );
    // await this.init()
    this.cards[thisTicket] = card;
    this.tickets[thisTicket].receive = true;
    this.tickets[thisTicket].countDown = 3;
    this.$apply();
    this.countDown( this.tickets[thisTicket] );
  }

  async countDown ( item ) {
    setTimeout( () => {
      if ( item.countDown === 0 ) {
        this.init();
        return;
      }
      item.countDown --;
      this.$apply();
      this.countDown( item );
    }, 1000 );
  }

  async getShared ( data ) {
    try {
      track( 'fission_share_to_group' );
      var exchangeTicket = await Ticket.exchangeTicket( data, {ticket_id: this.ticketID} );

      this.tickets[this.shareIndex].ticket_status = '1';
      this.$apply();
    } catch ( e ) {
      wx.showToast( {
        title: e.message,
        image: '../../image/fail.png',
        mask: true
      } );
      // setTimeout( () => {
      //   tips.error( e.message );
      // }, 1000 );
    }
  }

  async init () {
    var myInfoRes = await Ticket.getMyInfo();
    this.bannerInfo = myInfoRes.ad_info_list || [];
    this.rules = Ticket.initRules( myInfoRes.act_rules );
    this.tickets = Ticket.initTickets( myInfoRes.tickets );
    this.abtest = myInfoRes.ab_test;
    this.share_img = myInfoRes.share_img;
    this.share_title = myInfoRes.share_title
    this.share_code = myInfoRes.share_code;
    this.qrcode_from = myInfoRes.qrcode_from;
    this.phone = myInfoRes.phone || '';
    this.ticket_switch = myInfoRes.ticket_switch;
    this.receiveFaildInfo.msg = myInfoRes.ticket_desc;
    this.upgrade_img = myInfoRes.upgrade_img;
    this.$apply();
    try{
      var location = await wepy.getLocation({type: 'gcj02'})
      Ticket.sendGPS({
        latitude: location.latitude,
        longitude: location.longitude
      })
    } catch(e) {
      console.log(e.errMsg)
    }
  }
  async onLoad ( options ) {
    // track( 'my_page_enter' );
    this.initQrcodeFrom( options );
    this.setShare();
    if ( options.qrcode_from ) {
      this.$parent.globalData.qrcode_from = options.qrcode_from;
    }
    await auth.SilReady();
    this.$invoke('report', 'change')
    await auth.ready();
    track( 'fission_ticket_page_enter' );
    await this.init();
  }

  initQrcodeFrom ( options ) {
    console.log( options );
    var qf = options.qrcode_from || getParamV( options, 'qf' );
    this.$parent.globalData.qrcode_from = qf;
    this.qrcode_from = qf;
  }
}
