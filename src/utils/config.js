
// var _station = '02'; // 上海
var _station = '2101'; // 杭州
module.exports = {
  _v: '0.6.8',
  isMock: false,
  isTrack: false,
  station: _station,
  DOMAIN: 'https://crowdfunding.in66.com',
  // DOMAIN: 'http://qacrowd-zf.in66.com',
  trackId: _station === '02' ? 'UA-117482838-1' : 'UA-113017547-1',
  // DOMAIN: 'http://qacrowd-zf.in66.com',
  qnTokenUrl: 'https://www.in66.com/promo/commonapi/qiniutoken',
  // qnUploadUrl: "http://upload.qiniup.com/",
  qnUploadUrl: 'https://upload.qiniup.com/',
  qnResUrl: 'https://inimg07.jiuyan.info/',
  // payUrl: 'http://qainlove.in66.com/api/payment/signature',
  payUrl: 'https://love.in66.com/api/payment/signature',
  // businessParty: 'incrowdfunding_sh',
  businessParty: _station === '02' ? 'incrowdfunding_sh' : 'incrowdfunding',
  paymentChannel: 'weapppay', // wechatpay weapppay
  token: ''
};
