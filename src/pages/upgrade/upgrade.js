import wepy from 'wepy';
import auth from '@/api/auth';
import Upgrade from '@/api/upgrade';
// import tips from '@/utils/tips';
import report from '@/components/report-submit';
// import shareConnectMixin from '@/mixins/shareConnectMixin';
// import receiveFaildModal from '@/components/detail/receiveFaildModal';
// import adBanner from '@/components/adBanner';
import upgradePay from '@/components/detail/upgradePay';
import track from '@/utils/track';

export default class upgrade extends wepy.page {
  config = {
    navigationBarTitleText: ''
  }
  components = {report, upgradePay}
  mixins = []
  data = {
    upgrade: {},
    cinema_photos: [],
    videoInfo: {},
    videoShow: false,
    upgradeInfo: {},
    ticketid: 1
  }

  events = {
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
    this.ticketid = options.ticketid;
    var myInfoRes = await Upgrade.getUpgradeData( options.ticketid );
    this.upgrade = myInfoRes;
    this.cinema_photos = myInfoRes.cinema_photos;
    this.videoInfo = myInfoRes.video_info;
    this.upgradeInfo = myInfoRes.upgrade_info;
    console.log( this.upgradeInfo, 'jiemo' );
    this.$apply();
  }
  async onLoad ( options ) {
    console.log( options );
    await auth.ready();
    track( 'fission_ticket_upgrade_page_enter' );
    await this.init( options );
  }
}
