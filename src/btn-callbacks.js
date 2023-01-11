const { ToDo } = require("./model/ToDo");
const { CREATE_TO_DO_MSSG } = require("./constants");

const sendRes = require("./send-response");

// retrieve to-dos list as buttons
const fetchToDos = async (chatID) => {
  try {
    const toDos = await ToDo.find({}, { title: 1, description: 1 });

    const buttons = toDos.map((toDo) => {
      return [{ text: toDo.title, callback_data: `fetch_to_do@${toDo.title}` }];
    });

    return await sendRes(
      chatID,
      "Escogé una opción para ver más detalles:",
      null,
      buttons
    );
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

const fetchToDo = async (chatID, title) => {
  try {
    const toDo = await ToDo.findOne(
      { title: title },
      { title: 1, description: 1 }
    );
    const buttons = [
      [
        {
          text: "Marcar como completado✅",
          callback_data: `close_to_do@${toDo.title}`,
        },
      ],
      [{ text: "Editar✏️", callback_data: `edit_to_do@${toDo.title}` }],
      [{ text: "Eliminar❌", callback_data: `delete_to_do@${toDo.title}` }],
    ];

    return await sendRes(
      chatID,
      `*${toDo.title}*\n${toDo.description}`,
      null,
      buttons
    );
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// set isCreatingToDo user's flag in DB and respond with instructions message
const setIsCreatingToDo = async (chatID, user) => {
  try {
    user.isCreatingToDo = true;
    await user.save();
    return await sendRes(chatID, CREATE_TO_DO_MSSG);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

module.exports = { fetchToDo, fetchToDos, setIsCreatingToDo };
