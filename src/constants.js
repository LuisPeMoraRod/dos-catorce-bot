const CREATE_TO_DO_MSSG =
  "Para añadir un nuevo _to-do_ a la lista, enviá un mensaje con el siguiente formato:\n*<Título>*\n_<Descripción (opcional)>_\n\nPor ejemplo:\nSantiago Bernabéu\nIr a ver un partido del mejor club de Europa en su casa: el Santiago Bernabéu... Halá Madrid! Siuuuuuuu! 🤍";

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

module.exports = { CREATE_TO_DO_MSSG, MAIN_MENU, TO_DOS_MENU };
