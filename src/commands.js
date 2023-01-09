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
    return await sendRes(chatID, "Escogé una opción:", mainMenu);
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
  return await sendRes(chatID, "Escogé una opción:", null, buttons);
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

module.exports = { startCmd, toDosMenuCmd, unrecognizedCmd };
