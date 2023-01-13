const { ToDo } = require("./model/ToDo");
const { User } = require("./model/User");
const {
  CREATE_TO_DO_MSSG,
  EDIT_TO_DO_MSSG,
  EDIT_SCHEDULE_MSSG,
} = require("./constants");

const sendRes = require("./send-response");

/**
 * retrieve to-dos list as buttons
 * @param {Number} chatID
 */
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

/**
 * retrieve completed goals list as buttons
 * @param {Number} chatID
 */
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

/**
 * send response with title and description of a specific to-do. Also, send options buttons
 * @param {Number} chatID
 * @param {String} title
 */
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

/**
 * send response with title and description of a specific completed goal. Also, send options buttons
 * @param {Number} chatID
 * @param {String} title
 */
const fetchCompleted = async (chatID, title) => {
  try {
    const toDo = await ToDo.findOne(
      { title: title },
      { title: 1, description: 1 }
    );

    const message = !!toDo.description
      ? `*${toDo.title}*\n${toDo.description}`
      : toDo.title;

    const buttons = [
      [
        { text: "Editar ✏️", callback_data: `edit_to_do@${toDo.title}` },
        { text: "Eliminar ❌", callback_data: `delete_to_do@${toDo.title}` },
      ],
    ];
    return await sendRes(chatID, message, null, buttons);
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

const editToDo = async (chatID, user, title) => {
  try {
    user.editingToDo = title;
    await user.save();
    return await sendRes(chatID, EDIT_TO_DO_MSSG);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

/**
 * set isCreatingToDo user's flag in DB and respond with instructions message
 * @param {Number} chatID
 * @param {User} user
 */
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

const fetchSchedule = async (chatID, username) => {
  try {
    const user = await User.findOne({ username: username });
    const message = `*Horario de ${user.username}:*\n\n${user.collegeSchedule}`;
    const buttons = [
      [{ text: "Editar ✏️", callback_data: `edit_schedule@${user.username}` }],
    ];
    return await sendRes(chatID, message, null, buttons);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

/**
 * @param {Number} chatID
 * @param {User} user: User that is going to perform the edition
 * @param {String} username: username of the owner of the schedule to be edited
 */
const editSchedule = async (chatID, user, username) => {
  try {
    user.editingSchedule = username;
    await user.save();
    return await sendRes(chatID, EDIT_SCHEDULE_MSSG);
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
  editToDo,
  setIsCreatingToDo,
  fetchAllCompleted,
  fetchCompleted,
  fetchSchedule,
  editSchedule,
};
