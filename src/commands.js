const { ToDo } = require("./model/ToDo");
const { User } = require("./model/User");
const sendRes = require("./send-response");
const { MAIN_MENU, TO_DOS_MENU, SCHEDULES_MENU } = require("./constants");

// handle '/inicio' command
const startCmd = async (chatID) => {
  try {
    return await sendRes(
      chatID,
      "Escogé una opción de los botones del keyboard:",
      MAIN_MENU
    );
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// handle '/cancel' command
const cancelCmd = async (chatID, user) => {
  try {
    user.isCreatingToDo = false;
    user.editingToDo = null;
    await user.save();
    return await sendRes(chatID, "La operación fue cancelada.", MAIN_MENU);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// handle inline keyboard menu for To Dos List
const toDosMenuCmd = async (chatID) => {
  try {
    return await sendRes(chatID, "Escogé una opción:", null, TO_DOS_MENU);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// add new to-do to collection
const createToDo = async (chatID, user, req) => {
  try {
    user.isCreatingToDo = false;
    await user.save();
    const { title, description } = getToDo(req.message.text);
    await ToDo.create({
      //add to-do to DB
      title: title,
      description: description,
    });
    return await sendRes(chatID, "El nuevo _to-do_ fue agregado exitosamente");
  } catch (error) {
    console.log(error);
    return await sendRes(
      chatID,
      "Error: ya hay un elemento registrado con ese título"
    );
  }
};

// edit existing to-do
const editToDo = async (chatID, user, req) => {
  try {
    const editingTitle = user.editingToDo;
    user.editingToDo = null;
    await user.save();
    const toDo = await ToDo.findOne({ title: editingTitle });
    const { title, description } = getToDo(req.message.text);
    toDo.title = title;
    toDo.description = description;
    await toDo.save();
    return await sendRes(chatID, "El _to-do_ fue actualizado exitosamente");
  } catch (error) {
    console.log(error);
    return await sendRes(
      chatID,
      "Error: ya hay un elemento registrado con ese título"
    );
  }
};

// split title and description of ToDo text message
const getToDo = (text) => {
  const splitted = text.split("\n");
  let title, description;
  if (splitted.length > 1) {
    title = splitted[0];
    description = splitted[1];
  } else {
    title = splitted[0];
    description = null;
  }
  return { title, description };
};

// handle inline keyboard menu for To Dos List
const schedulesMenuCmd = async (chatID) => {
  try {
    return await sendRes(chatID, "Escogé una opción:", null, SCHEDULES_MENU);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

/**
 * @param {Number} chatID
 * @param {User} user: user that is executing the edition
 * @param {Object} req
 */
const editSchedule = async (chatID, user, req) => {
  try {
    let editedUser = user.editingSchedule;
    if (editedUser === user.username) user.collegeSchedule = req.message.text;
    else {
      editedUser = await User.findOne({ username: editedUser });
      editedUser.collegeSchedule = req.message.text;
      await editedUser.save();
    }
    user.editingSchedule = null;
    await user.save();
    return await sendRes(chatID, "El horario fue actualizado exitosamente");
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// default answer when commmand isn't recognized
const unrecognizedCmd = async (chatID) => {
  try {
    return await sendRes(chatID, "No pude reconcer el comando 😵‍💫", MAIN_MENU);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

module.exports = {
  startCmd,
  cancelCmd,
  toDosMenuCmd,
  createToDo,
  editToDo,
  schedulesMenuCmd,
  editSchedule,
  unrecognizedCmd,
};
