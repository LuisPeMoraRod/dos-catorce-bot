const axios = require("axios").default;

module.exports = async (e) => {
  console.log("Received an update from Telegram!", e.body);

  await axios
    .post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: JSON.parse(e.body).message.chat.id,
        text: "I got your message!",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Button", callback_data: "callback string" }],
          ],
        },
      }
    )
    .catch((error) => {
      console.log(error.toJSON());
      return { statusCode: 500 };
    });

  return { statusCode: 200 };
};
