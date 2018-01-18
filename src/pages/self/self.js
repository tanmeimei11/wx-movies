import wepy from 'wepy'
import auth from '@/api/auth'
import Self from '@/api/self'

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: '我的'
  }
  components = {
  }

  data = {
    rules: [], // 规则文案
    userInfo: { // 用户信息
      avatar: '',
      name: '',
      phone: ''
    },
    cardInfos: [{ // 卡片信息
      id: '',
      title: '',
      desc: '',
      time: '',
      num: 'NO.'
    }]
  }

  methods = {
    apply() {
      wepy.redirectTo({
        url: '../index/index'
      })
    }
  }

  events = {
  }

  async onLoad() {
    await auth.ready()
    var myInfoRes = await Self.getMyInfo()
    this.cardInfos = Self.initCardInfo(myInfoRes.cards, myInfoRes.default_card)
    this.userInfo = Self.initUserInfo(myInfoRes)
    this.rules = Self.initRules(myInfoRes.texts)
    this.$apply()
  }
}
