module.exports = {
  'msg': '',
  'code': '200003',
  'succ': true,
  'data': {
    'cf_close': '',
    'leke_info': {
      'leke_code': '9kslls', // 乐刻码
      'bgs': [
        'https://inimg01.jiuyan.info/in/2018/03/06/6A67B1AA-76D5-1CFA-7101-F1B25F03BE47.jpg',
        'https://inimg01.jiuyan.info/in/2018/03/06/24AF432F-A19B-9B53-042B-96754983862C.jpg'
      ] // 乐刻抽取王卡的图片
    }, // 这个字段可能为空
    'ticket_switch': false,
    'ticket_desc': '电影票已领完',
    'is_share': '0',                // 用户是否分享过
    'is_buy': '0',                // 用户是否买过该产品
    'fetch_ticket': true, // 是否显示获得电影票 ABtest
    'share_user_info': {
      'is_owner': false,
      'nick_name': '一休', // 分享人昵称
      'avatar': 'https://inimg01.jiuyan.info/in/2018/02/03/4FEB6B74-F97B-063D-148C-C17FCFCB275A.jpg'// 头像
    }, // 分享用户信息可能为空
    'has_union': true,
    'union_path': '/pages/union/union?product_id=202&qrcode_from=wx_union_01',
    // rp_price: 10,
    // rp_deduction: [
    //   {d_price: 50, d_desc: '滴滴红包抵扣'},
    //   {d_price: 100, d_desc: '滴滴红包抵扣'}
    // ],
    rp_notice: [
      {
        img: 'http://xxxx.jpg'
      },
      {
        text: '你有一个'
      },
      {
        text: '50',
        style: 'color:red;'
      },
      {
        text: '的红包可使用'
      }
    ]
    // rp_bg_img: 'http://inimg05.jiuyan.info/in/2018/02/06/FE3DF90F-01EE-40BD-2722-918B87EE862D.png'
  },
  'timestamp': '1512552968'
};
