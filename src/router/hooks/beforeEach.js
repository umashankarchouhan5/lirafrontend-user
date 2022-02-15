import Auth from 'Utils/auth';

const beforeEach = (to, from, next) => {
    if(to.query.redirect && to.query.redirect == 1 && to.meta.auth && !Auth.isUserLogged()){
        localStorage.setItem('savedRoute',JSON.stringify({url: to.path}))
    }
    if (to.meta.auth && !Auth.isUserLogged()) {
        return next('/login');
    }
    next();
};

export default beforeEach;