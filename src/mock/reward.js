module.exports = {
  'msg': '',
  'code': '0',
  'succ': true,
  'data': {
    'reward_code': 'mjhdh_jaj', // 卡片转赠码
    'prompt_txt': [
      '将卡赠送给朋友后你们可以一起选座观影',
      '每张卡只允许赠送给一个朋友',
      '朋友接收到你的卡之后将无法撤回',
      '收到的卡不能再次赠送给他人'
    ],
    'reward_status': 3, // 转赠状态0：未赠送，1：已送出，2：已领取，3：已取消
    'reward_btn_txt': '转赠', // 赠送按钮文案
    'card': {
      'name': '戏精卡',
      'id': '1YSDF',
      'card_no': 'afksdfkjsdfk',
      'desc': '啦啦啦这是一张戏精卡',
      'start_date': 1502246614,
      'end_date': 1502246614,
      'buy_time': 1502246614,
      'reward_btn': '转赠他人',
      'reward_from_info': {
        'user_id': '929', // 用户ID
        'avatar': 'http://xxxx.jpg', // 用户头像
        'nick_name': '一休'
      }, // 转赠来源, 可能不返回给字段
      'reward_to_info': {
        'user_id': '929', // 用户ID
        'avatar': 'http://xxxx.jpg', // 用户头像
        'nick_name': '一休'
      }
    },
    'btn_txt': [
      '赠送他人',
      '',
      '',
      '取消赠送'
    ]
  },
  'timestamp': '1516094687'
};
