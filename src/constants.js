const CREATE_TO_DO_MSSG =
  "Para añadir un nuevo _to-do_ a la lista, enviá un mensaje con el siguiente formato:\n*<Título>*\n_<Descripción (opcional)>_\n\nPor ejemplo:\nSantiago Bernabéu\nIr a ver un partido del mejor club de Europa en su casa: el Santiago Bernabéu... Halá Madrid! Siuuuuuuu! 🤍";

const EDIT_TO_DO_MSSG =
  "Para editar el _to-do_ seleccionado, enviá un mensaje con el siguiente formato:\n\n*<Nuevo título>*\n_<Nueva descripción (opcional)>_";

const EDIT_SCHEDULE_MSSG =
  "Enviá un mensaje con el nuevo horario de U.\nPor ejemplo:\n\nK:\n15:00-17:00 (B.D.A \n\nM:\n19:00-21:00 (Especif. y Diseño de Software)\n\nJ:\n15:00-17:00 (B.D.A)\n\nV:\n19:00-21:00 (Especif. y Diseño de Software)";

const MAIN_MENU = [
  [{ text: "To-Dos List ❤️‍🔥" }],
  [
    {
      text: "Nuestros horarios de U 📚",
    },
  ],
];

const TO_DOS_MENU = [
  [{ text: "Ver lista 📃", callback_data: "fetch_to_dos" }],
  [{ text: "Ver goals completados ✅", callback_data: "fetch_all_completed" }],
  [{ text: "Crear nuevo goal ⚽️", callback_data: "create_to_do" }],
];

const SCHEDULES_MENU = [
  [{ text: "Kía 👸", callback_data: "schedule@keyrencalderon" }],
  [{ text: "Luispe 🤴", callback_data: "schedule@LuisPeMoraRod" }],
];

module.exports = {
  CREATE_TO_DO_MSSG,
  EDIT_TO_DO_MSSG,
  MAIN_MENU,
  TO_DOS_MENU,
  SCHEDULES_MENU,
  EDIT_SCHEDULE_MSSG,
};
