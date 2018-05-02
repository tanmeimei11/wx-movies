import wepy from 'wepy';
import auth from '@/api/auth';
import Template from '@/api/template';
// import tips from '@/utils/tips';
import report from '@/components/report-submit';
// import shareConnectMixin from '@/mixins/shareConnectMixin';
// import receiveFaildModal from '@/components/detail/receiveFaildModal';
// import adBanner from '@/components/adBanner';
import seckill from '@/components/upgrade/seckill';
import goSeat from '@/components/upgrade/goSeat';
import upgradePay from '@/components/detail/upgradePay';
import track from '@/utils/track';
import {getParamV} from '@/utils/common';

export default class upgrade extends wepy.page {
  config = {
    navigationBarTitleText: ''
  }
  components = {report, upgradePay, seckill, goSeat}
  mixins = []
  data = {
    upgrade: {},
    cinema_photos: [],
    videoInfo: {},
    videoShow: false,
    upgradeInfo: {},
    ticketid: 1,
    isShowSeckill: false,
    isShowGoSeat: false,
    countDown: 0
  }

  events = {
    goSeat () {
      this.$invoke( 'upgradePay', 'jumpToSeat' );
    },
    goUpgrade () {
      this.$invoke( 'upgradePay', 'paypiao' );
    },
    openSeatModal () {
      this.isShowGoSeat = true;
    },
    closeGoSeatModal () {
      this.isShowGoSeat = false;
    },
    countDownJian ( seconds ) {
      this.countDown = seconds;
    }
  }

  methods = {
    showVideo () {
      this.videoShow = true;
    },
    videoEnd () {
      this.videoShow = false;
    }
  }

  async init ( options ) {
    var _modules = await Template.getModules();
    this.$apply();
  }
  async onLoad ( options ) {
    console.log( options );
    this.initQrcodeFrom( options );
    await auth.SilReady();
    this.$invoke( 'report', 'change' );
    track( 'fission_ticket_upgrade_page_enter' );
    await this.init( options );
  }

  initData () {

  }

  initQrcodeFrom ( options ) {
    console.log( options );
    var qf = options.qrcode_from || getParamV( options, 'qf' );
    this.$parent.globalData.qrcode_from = qf;
    this.qrcode_from = qf;
    console.log( this.qrcode_from );
  }
}
