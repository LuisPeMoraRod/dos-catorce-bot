const { ToDo } = require("./model/ToDo");
const sendRes = require("./send-response");

// handle '/inicio' command
const startCmd = async (chatID) => {
  const mainMenu = [
    [{ text: "To-Dos List ❤️‍🔥" }],
    [
      {
        text: "Nuestros horarios de U 📚",
      },
    ],
  ];

  try {
    return await sendRes(
      chatID,
      "Escogé una opción del menú principal:",
      mainMenu
    );
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// handle inline keyboard menu for To Dos List
const toDosMenuCmd = async (chatID) => {
  const buttons = [
    [{ text: "Ver lista", callback_data: "fetch_to_dos" }],
    [{ text: "Crear nuevo goal", callback_data: "create_to_do" }],
  ];
  try {
    return await sendRes(chatID, "Escogé una opción:", null, buttons);
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

// default answer when commmand isn't recognized
const unrecognizedCmd = async (chatID) => {
  const mainMenu = [
    [{ text: "To-Dos List ❤️‍🔥" }],
    [
      {
        text: "Nuestros horarios de U 📚",
      },
    ],
  ];

  try {
    return await sendRes(chatID, "No pude reconcer el comando 😵‍💫", mainMenu);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

module.exports = { startCmd, toDosMenuCmd, createToDo, unrecognizedCmd };
