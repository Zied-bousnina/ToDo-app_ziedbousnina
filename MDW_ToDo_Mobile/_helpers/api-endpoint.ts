/* eslint-disable prettier/prettier */
function server() {
  return "https://mdw-backend-todo.vercel.app/api/api/";}

export const ApiConfigs = {
  base_url: server(),
  /* -------------------------------- */

  apis: {
    auth: {
      user: { register: "user/create" },
      login: "user/login",
      currentUserLogin: "user",
    },

    user:{
      getAllTask:"read",
      addTask : "task",
      deleteTask: "delete",
      updateTask: "update",
      getStatistique: "getStatistiqueByUser",
      getTasksSortedBy :  "readWithSortBy",
      SendMailResetPassword: "password/email",
      checkCode: "password/code/check",
      ResetPassword: "password/reset",

    }
  },
};
