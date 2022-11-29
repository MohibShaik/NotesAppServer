const axios = require('axios');

const {
  NOTIFICATION,
} = require('../constants/app-notification.constant');
const { fcmAuthKey } = require('../../config/config');

exports.send = async (title, body) => {
  try {
    const response = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      JSON.parse(NOTIFICATION(title, body)),
      {
        headers: {
          Authorization: fcmAuthKey,
        },
      }
    );
    return {
      status: response?.status,
      statusText: response?.statusText,
      messageId: response?.data?.message_id,
    };
  } catch (error) {
    console.log(error);
    return error
  }
};
