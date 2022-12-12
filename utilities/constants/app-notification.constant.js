const NOTIFICATION = (title, body) =>
  `{
 "to": "/topics/google",
  "notification": {
    "body": "${body}",
    "title": "${title}",
    "click_action": "FCM_PLUGIN_ACTIVITY",
    "sound": "default",
    "badge": 0,
    "alert": "false"
  },
  "data": {
    "click_action": "FCM_PLUGIN_ACTIVITY",
    "body": "${body}",
    "title": "${title}",
    "priority": "high",
    "screen": "/dahboard/feeds",
    "img": "",
    "sound": "default"
  }
} `;

module.exports = { NOTIFICATION };
