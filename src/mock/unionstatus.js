module.exports = {
  'msg': '',
  'code': '200003',
  'succ': true,
  data: {
    joiners: [
      {
        id: 'xxx',
        avatar: 'http://xxx/xxx.jpg',
        role: 1 // 0：参与者，1：发起者
      },
      {
        id: 'xxx',
        avatar: 'http://xxx/xxx.jpg'
      }
    ],
    union_result_desc: '拼团成功',
    union_tips: '请在in同城趴app中查看已获得的电影票',
    union_need_count: 3,
    union_remain_time: 1000, // 倒计时剩余秒数
    unionResult: {
      isShow: false,
      desc: '',
      class: '',
      tips: ''
    },
    btns: [
      {
        btn_name: '去使用',
        btn_color: 'btn-union',
        btn_type: '3', // 0:小程序跳转路径   1:跨小程序跳转路径   2:转发按钮   3:下单支付
        btn_path: '/pages/detail/detail', // 跳转路径   用于0和1状态
        btn_app_id: 'xxxxxxx', // 跳转小程序appid     用于1状态
        btn_share_callback_url: 'http://xxxxxx/xxxx.jpg', // 分享成功之后的回调  用于2状态
        btn_create_order_url: 'http://xxxxxx/xxxx.jpg' // 点击下单接口  用于3状态
      }
    ]
  }
};
