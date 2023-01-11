const mongoose = require("mongoose");
const { ToDo } = require("./model/ToDo");
const { User } = require("./model/User");
const sendRes = require("./send-response");
const {
  startCmd,
  toDosMenuCmd,
  createToDo,
  unrecognizedCmd,
} = require("./commands");
const {
  fetchToDo,
  fetchToDos,
  closeToDo,
  deleteToDo,
  setIsCreatingToDo,
  fetchAllCompleted,
  fetchCompleted,
} = require("./btn-callbacks");

module.exports = async (e) => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_DB_CONN);

  const req = JSON.parse(e.body);
  console.log("Received an update from Telegram: \n", req);

  const user = await authenticateUser(req);

  if (!!user) {
    if (isCommand(req)) {
      // if user sends a message
      const chatID = req.message.chat.id;
      const cmd = req.message.text;

      if (user.isCreatingToDo) return await createToDo(chatID, user, req);

      switch (cmd) {
        case "/inicio":
          return await startCmd(chatID);
        case "To-Dos List ❤️‍🔥":
          return await toDosMenuCmd(chatID);
        default:
          return await unrecognizedCmd(chatID);
      }
    } else if (isCallback(req)) {
      // if users press a button
      const chatID = req.callback_query.from.id;
      const { cmd, id } = getCbCommands(req.callback_query.data);

      switch (cmd) {
        case "fetch_to_dos":
          return await fetchToDos(chatID);
        case "fetch_to_do":
          return await fetchToDo(chatID, id);
        case "create_to_do":
          return await setIsCreatingToDo(chatID, user);
        case "close_to_do":
          return await closeToDo(chatID, id);
        case "delete_to_do":
          return await deleteToDo(chatID, id);
        case "fetch_all_completed":
          return await fetchAllCompleted(chatID);
        case "fetch_completed":
          return fetchCompleted(chatID, id);
        default:
          return await unrecognizedCmd(chatID);
      }
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

/**
 * separate callback command by '@' character
 * e.g.
 * callbackData: 'fetch_to_do@my to-do'
 * returns: {cmd: "fetch_to_do", id: "my to-do"}
 */
const getCbCommands = (callbackData) => {
  const data = callbackData.split("@");
  let cmd, id;
  if (data.length > 1) {
    cmd = data[0];
    id = data[1];
  } else {
    cmd = data[0];
    id = null;
  }
  return { cmd, id };
};

const isCommand = (req) => {
  return !!req.message;
};

const authenticateUser = async (req) => {
  let sender;
  try {
    sender = req.message.from.username;
  } catch (e) {
    sender = req.callback_query.from.username;
  }
  const authUser = await User.findOne({ username: sender });
  return authUser;
};
