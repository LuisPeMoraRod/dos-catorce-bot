const axios = require("axios").default;

exports.handler = async (event) => {
  console.log("Received an update from Telegram!", event.body);

  await axios
    .post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: JSON.parse(event.body).message.chat.id,
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
    });

  return { statusCode: 200 };
};
