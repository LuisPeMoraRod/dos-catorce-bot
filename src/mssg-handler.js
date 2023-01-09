const sendRes = require("./send-response");
const axios = require("axios").default;
const BOT_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

module.exports = async (e) => {
  const req = JSON.parse(e.body);
  console.log("Received an update from Telegram: \n", req);
  const chatID = req.message.chat.id;
  const mainMenu = [
    [{ text: "To-Dos List ❤️‍🔥" }],
    [
      {
        text: "Nuestros horarios de U 📚",
      },
    ],
  ];

  let buttons;

  if (isCommand(req)) {
    // await axios
    //   .post(BOT_URL, {
    //     chat_id: req.message.chat.id,
    //     text: "I got your message!",
    //     reply_markup: {
    //       inline_keyboard: [
    //         [{ text: "Button", callback_data: "callback string" }],
    //       ],
    //     },
    //   })
    //   .catch((error) => {
    //     console.log(error.toJSON());
    //     return { statusCode: 500 };
    //   });
    const cmd = req.message.text;
    switch (cmd) {
      case "/inicio":
        return await sendRes(chatID, "Escogé una opción:", mainMenu);

      default:
        return await sendRes(
          chatID,
          "No pude reconcer el comando 😵‍💫",
          mainMenu
        );
    }
  } else if (isCallback(req)) {
    return await sendRes(chatID, "I got your button callback!");
  }
};

const isCallback = (req) => {
  return !!req.callback_query;
};

const isCommand = (req) => {
  return !!req.message;
};
