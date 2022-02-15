import { refreshToken, logoutRequest } from 'Pages/master/masterActions';
import Ajax from 'Utils/ajax'
import Auth from 'Utils/auth'
import Event from 'Utils/event'
import { RefreshTime } from 'Config/defaultData';
import moment from 'moment';

export default {
    data() {
        return {
            idleState: false,
            count: 0,
            refreshTask: null,
            timeAtRefreshed: 0,
        }
    },
    computed: {
        isIdle() {
            return this.$store.state.idleVue.isIdle;
        },        
        userData() {
            return this.$store.state.user.user;
        },
    },
    watch: {
        userData(val) {
            if(val == null) {
                this.clearTimer();
            }
            else{
                Ajax.setToken(val.token);
                this.refreshMethod();
            }
        }
    },
    created() {
        window.addEventListener("storage", this.localStorageReactiveEvent);



        // const removeItem = window.localStorage.removeItem;
        // localStorage.removeItem = (key) => {
        //     console.info("removing", key);
        //     if(key == 'userData') {

        //     }
        //     return removeItem.call(localStorage, key);
        // };

        Event.subscribe('idleState', this.setIdleState);
        if(this.userData !== null) {
            refreshToken().then(
                res => {
                    var date = new Date();
                    this.timeAtRefreshed = moment(date).valueOf();
                    var newDateObj = moment(date).add(RefreshTime/(60000), 'm').toDate().valueOf();
                    localStorage.setItem('timeOfNewRefresh', newDateObj);
                    var user = JSON.parse(localStorage.getItem('userData'))
                    user.token = res.token;
                    this.$store.commit('setUser', user);
                    Auth.logUser(user)
                    Ajax.setToken(res.token);
                    this.refreshMethod();
                },
                // err => {
                //     this.clearTimer();
                //     this.logout();
                // }
            );
        }
    },
    methods: {
        localStorageReactiveEvent(event){
            var self = this;
            if(event.key == 'userData' && event.newValue == null){
                
                this.clearTimer();
                this.logout();
                // if(l)
            }
            else if(event.key == 'userData' && event.newValue !== null && event.oldValue == null && this.$route.name == 'login'){
                Auth.logUser(JSON.parse(localStorage.userData))
                Ajax.setToken(JSON.parse(localStorage.userData).token);
                function callNavigation(){
                    if(self.userData !== null){
                        setTimeout(() => {self.$router.push({'name': 'dashboard'}).catch(e => {console.log(e)});},500)
                    }
                    else{
                        setTimeout(() => {callNavigation()},500)
                    }
                }
                callNavigation()
            }
            else if(event.key == 'userData' && event.newValue !== null && event.oldValue !== null && this.$route.name !== 'login'){
                self.$store.commit('setUser', JSON.parse(localStorage.userData));
            }
        },
        refreshMethod() {
            var self = this;
            clearInterval(self.refreshTask);
            self.refreshTask = setInterval(() => {
                Auth.checkUser();
                if(Auth.isUserLogged()){
                    if (self.idleState == false) {
                        const date = new Date();
                        self.timeAtRefreshed = moment(date).valueOf();
                        var newDateObj = moment(date).add(RefreshTime/(60000), 'm').toDate().valueOf();
                        localStorage.setItem('timeOfNewRefresh', newDateObj);
                    }
                    if(localStorage.timeOfNewRefresh){
                        var getTimeOfRefresh = JSON.parse(localStorage.getItem('timeOfNewRefresh'));
                        var getTimeDifference = (getTimeOfRefresh - self.timeAtRefreshed);
                    }
                    if(localStorage.timeOfNewRefresh == undefined || getTimeDifference == RefreshTime){
                        if (self.idleState == false) {
                            refreshToken().then(
                                res=> {
                                    var date = new Date();
                                    self.timeAtRefreshed = moment(date).valueOf();
                                    var newDateObj = moment(date).add(RefreshTime/(60000), 'm').toDate().valueOf();
                                    localStorage.setItem('timeOfNewRefresh', newDateObj);
                                    var user = JSON.parse(localStorage.getItem('userData'));
                                    user.token = res.token;
                                    self.$store.commit('setUser', user);
                                    Auth.logUser(user)
                                    Ajax.setToken(res.token);
                                },
                                err => {
                                    this.clearTimer();
                                    this.logout();
                                }
                            )
                        }
                        else {
                            this.clearTimer();
                            this.logout();
                        }
                    }
                }
                else{
                    this.clearTimer();
                    this.logout();

                }
            },RefreshTime)
        },
        clearTimer() {
            var self = this;
            clearInterval(self.refreshTask);
        },
        setIdleState(val) {
            this.idleState = val;
        },
        logout(){
            if(localStorage.userData){
                logoutRequest().then(
                    res => {
                        
                        if(localStorage.timeOfNewRefresh){
                            localStorage.removeItem('timeOfNewRefresh');
                        }
                        Auth.logoutUser();
                        Ajax.removeToken();
                        if(this.$route.name !== 'login'){
                            this.$router.push('/login')
                        }

                    },
                    err => {
                        Auth.logoutUser();
                        Ajax.removeToken();
                        if(this.$route.name !== 'login'){
                            this.$router.push('/login')
                        }
                    }
                )
            }
            if(!localStorage.userData && this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                if(this.$route.name !== 'login'){
                    this.$router.push('/login')
                }
            }
        },
    }
};



