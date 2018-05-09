module.exports = {
  "timestamp": "1516246003",
  "succ": true,
  "data": {
    "ad_info_list":[
      {
        img_url: "http://itugo.jiuyan.info/2017/09/08/27F49AF2-12FD-7C42-DE2A-A6ABBDB5465D.jpg?imageMogr2/format/jpg/quality/80",
        type: "h5",  // "miniprogram", "path",
        app_id: "xwwds589548w5dw",
        landing_path: "pages/index/index?a=1"
      }
    ],
    "act_rules":["xxxxxx","xxxxx","xxxxx"],
    "tickets":[
      {
        share_code:"1QBrIN",//分享code
        ticket_status:0,//初始未分享的状态
        id:45
      },
      {
        ticket_status:1,//分享之后的状态
        id:46
      },
      {
        ticket_status:2,//抽完电影票的状态
        id:48,
        title:"上午场电影通用票",
        remark:"仅3月4日至3月8日上午使用，合作影院均可用",
        btn_txt:"去使用",//按钮文案
        tips: "这里有全天场电影票" //悬浮文案,这个字段如果为空则不显示悬浮文案
      },
      {
        ticket_status:5,//电影票已过期的状态
        id:48,
        title:"上午场电影通用票",
        remark:"仅3月4日至3月8日上午使用，合作影院均可用",
        btn_txt:"去升级",//按钮文案
        tips: "全天可用并延长有效期" //悬浮文案,这个字段如果为空则不显示悬浮文案
      },
      {
        ticket_status:6,//已经为全天场
        id:48,
        title:"全天场电影通用票",
        remark:"仅3月4日至3月8日全天使用，合作影院均可用",
        btn_txt:"去使用",//按钮文案
        tips: "全天可用并延长有效期" //悬浮文案,这个字段如果为空则不显示悬浮文案
      },
      {
        ticket_status:3,//电影票升级之后的状态
        id:48,
        btn_txt:"已升级",//按钮文案
      },
      {
        ticket_status:4,//电影票已使用的状态
        id:49,
        btn_txt:"已使用",//按钮文案
      }
    ],
    "ab_test":"0", //0表示走原方案, 1表示走新方案
    "location_info": {
        gps_authorized: true,
        tip_txt: "ssss",
        tip_desc: "该票仅限「上海用户」使用，请开启授权"
    },
    "receive_ticket_bg_img":"",
    "receive_ticket_empty_desc":"很可惜，该时段免费票已领完",
    "receive_ticket_subscribe_desc_one":"已为您预约",
    "receive_ticket_subscribe_desc_two":"【13点场】",
    "receive_ticket_subscribe_desc_three":"送票活动",
    "receive_ticket_try_desc":"你也可以尝试",
    "receive_ticket_cut_btn_desc_one":"砍价0元得电影票",
    "receive_ticket_cut_btn_desc_two":"(4312已得)",
    "receive_ticket_cut_remind_desc":"提醒：砍价票与免费票活的可叠加哦！",
    "receice_ticket_rules_desc":"【每天1/3/5/8点 送1000张】" ,
    "ticket_switch":"true" 
  },
  "code": "0",
  "msg": ""
}