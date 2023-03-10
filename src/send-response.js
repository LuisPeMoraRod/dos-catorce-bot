const axios = require("axios").default;
const BOT_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

module.exports = async (chatID, text, keyboard, inlineKeyboard = null) => {
  let body = {
    chat_id: chatID,
    text: text,
    parse_mode: "markdown",
    reply_markup: {
      one_time_keyboard: false,
      resize_keyboard: true,
      keyboard: keyboard,
    },
  };

  if (!!inlineKeyboard)
    body["reply_markup"] = {
      inline_keyboard: inlineKeyboard,
    }; //set inline buttons if required

  await axios.post(BOT_URL, body).catch((error) => {
    console.log(JSON.parse(error));
    return { statusCode: 500 };
  });

  return { statusCode: 200 };
};
