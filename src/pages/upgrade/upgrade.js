import wepy from 'wepy';
import auth from '@/api/auth';
import Upgrade from '@/api/upgrade';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import track from '@/utils/track';

export default class upgrade extends wepy.page {
  config = {
    navigationBarTitleText: ''
  }
  components = { report }
  mixins = []
  data = {
  }

  events = {
  }

  methods = {
  }

  async init () {
    var myInfoRes = await Upgrade.getUpgradeData();
    this.$apply();
  }
  async onLoad ( options ) {
    await auth.ready();
    await this.init();
  }
}
