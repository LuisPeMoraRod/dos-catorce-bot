const sendRes = require("./send-response");
const { startCmd, toDosMenuCmd, unrecognizedCmd } = require("./commands");

module.exports = async (e) => {
  const req = JSON.parse(e.body);
  console.log("Received an update from Telegram: \n", req);

  if (isValidUsername(req)) {
    if (isCommand(req)) {
      const chatID = req.message.chat.id;
      const cmd = req.message.text;

      switch (cmd) {
        case "/inicio":
          return await startCmd(chatID);
        case "To-Dos List ❤️‍🔥":
          return await toDosMenuCmd(chatID);
        default:
          return await unrecognizedCmd(chatID);
      }
    } else if (isCallback(req)) {
      const chatID = req.callback_query.from.id;
      return await sendRes(chatID, "I got your button callback!");
    }
  } else
    return await sendRes(
      req.message.chat.id,
      "Sorry! You're not authorized to use this bot."
    );
};

const isCallback = (req) => {
  return !!req.callback_query;
};

const isCommand = (req) => {
  return !!req.message;
};

const isValidUsername = (req) => {
  const sender = req.message.from.username;
  return sender === "keyrencalderon" || sender === "LuisPeMoraRod";
};
