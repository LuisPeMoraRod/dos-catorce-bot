const { ToDo } = require("./model/ToDo");
const { CREATE_TO_DO_MSSG } = require("./constants");

const sendRes = require("./send-response");

// retrieve to-dos list as buttons
const fetchToDos = async (chatID) => {
  try {
    const toDos = await ToDo.find(
      { isCompleted: false, isActive: true },
      { title: 1, description: 1 }
    );

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

// retrieve completed goals list as buttons
const fetchAllCompleted = async (chatID) => {
  try {
    const toDos = await ToDo.find(
      { isCompleted: true, isActive: true },
      { title: 1, description: 1 }
    );

    const buttons = toDos.map((toDo) => {
      return [
        { text: toDo.title, callback_data: `fetch_completed@${toDo.title}` },
      ];
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

// send response with title and description of a specific to-do. Also, send options buttons
const fetchToDo = async (chatID, title) => {
  try {
    const toDo = await ToDo.findOne(
      { title: title },
      { title: 1, description: 1 }
    );
    const buttons = [
      [
        {
          text: "Marcar como completado ✅",
          callback_data: `close_to_do@${toDo.title}`,
        },
      ],
      [
        { text: "Editar ✏️", callback_data: `edit_to_do@${toDo.title}` },
        { text: "Eliminar ❌", callback_data: `delete_to_do@${toDo.title}` },
      ],
    ];

    const message = !!toDo.description
      ? `*${toDo.title}*\n${toDo.description}`
      : toDo.title;

    return await sendRes(chatID, message, null, buttons);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// send response with title and description of a specific completed goal. Also, send options buttons
const fetchCompleted = async (chatID, title) => {
  try {
    const toDo = await ToDo.findOne(
      { title: title },
      { title: 1, description: 1 }
    );

    const message = !!toDo.description
      ? `*${toDo.title}*\n${toDo.description}`
      : toDo.title;

    return await sendRes(chatID, message);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

const closeToDo = async (chatID, title) => {
  try {
    const toDo = await ToDo.findOne({ title: title });
    toDo.isCompleted = true;
    await toDo.save();

    return await sendRes(chatID, "El _to-do_ se completó con éxito!");
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

const deleteToDo = async (chatID, title) => {
  try {
    const toDo = await ToDo.findOne({ title: title });
    toDo.isActive = false;
    await toDo.save();

    return await sendRes(chatID, "El _to-do_ se eliminó con éxito!");
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

module.exports = {
  fetchToDos,
  fetchToDo,
  closeToDo,
  deleteToDo,
  setIsCreatingToDo,
  fetchAllCompleted,
  fetchCompleted,
};
