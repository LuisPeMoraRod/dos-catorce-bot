const mongoose = require("mongoose");
const { User } = require("./model/User");
const sendRes = require("./send-response");
const {
  startCmd,
  cancelCmd,
  toDosMenuCmd,
  createToDo,
  editToDo,
  schedulesMenuCmd,
  editSchedule,
  unrecognizedCmd,
} = require("./commands");
const {
  fetchToDo,
  fetchToDos,
  closeToDo,
  deleteToDo,
  editToDo: setEditToDo,
  setIsCreatingToDo,
  fetchAllCompleted,
  fetchCompleted,
  fetchSchedule,
  editSchedule: setEditSchedule,
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

      if (cmd === "/cancelar") return await cancelCmd(chatID, user);
      else {
        if (user.isCreatingToDo) return await createToDo(chatID, user, req);
        if (!!user.editingToDo) return await editToDo(chatID, user, req);
        if (!!user.editingSchedule)
          return await editSchedule(chatID, user, req);

        switch (cmd) {
          case "/inicio":
            return await startCmd(chatID);
          case "To-Dos List ❤️‍🔥":
            return await toDosMenuCmd(chatID);
          case "Nuestros horarios de U 📚":
            return await schedulesMenuCmd(chatID);
          default:
            return await unrecognizedCmd(chatID);
        }
      }
    } else if (isCallback(req)) {
      // if users press a button
      const username = user.username;
      const messageID = req.callback_query.message.message_id;
      const messageData = req.callback_query.data;
      // patch: don't respond to repeated callbacks
      if (
        messageID === user.lastMessageID &&
        messageData === user.lastMessageData
      )
        return { statusCode: 200 };
      updateLastMssg(user, messageID, messageData);

      const chatID = req.callback_query.from.id;
      const { cmd, id } = getCbCommands(messageData);

      switch (cmd) {
        case "fetch_to_dos":
          return await fetchToDos(chatID);
        case "fetch_to_do":
          return await fetchToDo(chatID, id);
        case "create_to_do":
          return await setIsCreatingToDo(chatID, username);
        case "close_to_do":
          return await closeToDo(chatID, id);
        case "delete_to_do":
          return await deleteToDo(chatID, id);
        case "edit_to_do":
          return await setEditToDo(chatID, username, id);
        case "fetch_all_completed":
          return await fetchAllCompleted(chatID);
        case "fetch_completed":
          return fetchCompleted(chatID, id);
        case "schedule":
          return fetchSchedule(chatID, id);
        case "edit_schedule":
          return setEditSchedule(chatID, username, id);
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
 * @param {String} callbackData
 * e.g.
 * callbackData: 'fetch_to_do@my to-do'
 * @returns {Object} {cmd: "fetch_to_do", id: "my to-do"}
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

const updateLastMssg = async (user, newMssgID, newMssgData) => {
  user.lastMessageID = newMssgID;
  user.lastMessageData = newMssgData;
  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }
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
