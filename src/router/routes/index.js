import publicRoutes from "./public";
import userRoutes from "./user";

export default [
    {
        path: "/",
        name: "home",
        component: () => import("../../pages/master/Master"),
        // component: () => import("Pages/public/login/Login.vue"),
        meta: {
            title: "Home",
            auth: true,
        },
        children: [
            ...publicRoutes,
            ...userRoutes
        ]
    },
    {
        path: "/help/:id",
        name: "Help",
        meta: {
            title: "Help",
        },
        component: () => import("../../pages/user/help"),
    },
    {
        path: "/help/:id/:tab",
        name: "Help with Tab",
        meta: {
            title: "Help",
        },
        component: () => import("../../pages/user/help"),
    },
    {
        path: "/login",
        name: "login",
        meta: {
            title: "LiRA2020 Web Login"
        },
        component: () => import("Pages/public/login/Login.vue")
    },
    {
        path: "/pqReadonly/:id",
        name: "PQReadonly",
        meta: {
            title: "PQ Readonly",
            auth: true
        },
        component: () => import("../../pages/user/PQ/single/pqReadonly")
    },
    {
        path: "/unauthorize",
        name: "Unauthorize",
        meta: {
            title: "Unauthorized"
        },
        component: () => import("../../pages/errorPages/Unauthorized")
    },
    
    {
        path: "*",
        name: "NotFound",
        meta: {
            title: "Not Found"
        },
        component: () => import("../../pages/errorPages/NotFound")
    }
];
