export default [
  {
    path: "/forgotPassword",
    name: "forgotPassword",
    meta: {
      title: "Forgot Password"
    },
    component: () => import("../../pages/public/forgotPassword/ForgotPassword.vue")
  },
  {
    path: "/register",
    name: "register",
    meta: {
      title: "Register"
    },
    component: () => import("../../pages/public/register/Register.vue")
  },
  {
    path: "/verifyEmail",
    name: "verifyEmail",
    meta: {
      title: "Verify Email"
    },
    component: () => import("../../pages/public/verifyEmail/VerifyEmail.vue")
  },
  {
    path: "/verifyEmailPQ",
    name: "verifyEmailPQ",
    meta: {
      title: "Verify PQ Email"
    },
    component: () => import("../../pages/public/verifyEmail/VerifyEmailPQ.vue")
  },
  
  {
    path: "/verifyPQEmail",
    name: "verifyPQEmail",
    meta: {
      title: "Verify PQ Email"
    },
    component: () => import("../../pages/public/verifyEmailPQ")
  },
  {
    path: "/createPassword",
    name: "createPassword",
    meta: {
      title: "Create Password"
    },
    component: () => import("../../pages/public/createPassword/CreatePassword.vue")
  },
  {
    path: "/createPasswordPQ",
    name: "createPasswordPQ",
    meta: {
      title: "Create PQ Password"
    },
    component: () => import("../../pages/public/createPassword/createPasswordPQ.vue")
  },
  {
    path: "/helpPublicPage/:id",
    name: "helpPublicPage",
    meta: {
      title: "Help"
    },
    component: () => import("../../pages/public/help")
  }
];
