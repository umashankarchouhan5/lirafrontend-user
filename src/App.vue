<template>
    <div id="app" :class="$style.app">
        <Loader v-if="isLoading" />
        <router-view />
        <Popup type="error" title="Error" :value="isModalVisible" @close="hideModal">
            <div :class="$style.errorMessage">
                {{ error.message }}
            </div>
            <div slot="footer" :class="$style.modalButton">
                <FormButton @click="hideModal">OK</FormButton>
            </div>
        </Popup>
    </div>
</template>

<script>

    import Loader from "Components/layout/Loader";
    import Event from 'Utils/event'
    import eventsConfig from './config/events'
    import refreshTokenMixin from 'Mixins/refreshTokenMixin'
    // import loadingMixin from 'Mixins/loadingMixin'

    export default {
        name: "App",
        mixins: [refreshTokenMixin],
        data() {
            return {
                error: {
                    title: '',
                    message: ''
                },
                isModalVisible: false,
                isLoading: false,
            }
        },
        components: {
            Loader
        },
        created() {
            Event.subscribe(eventsConfig.requestError, this.showErrorModal)
            Event.subscribe(eventsConfig.loading, this.showLoader)
            Event.subscribe(eventsConfig.unauthorize, this.showAuthorization)

            // var conn = new WebSocket('ws://192.168.10.183:8094')
            // conn.onopen = (e) => {
            //     console.log('Connection Open')
                
                
            // }
            // setInterval(() => {
                
            //     conn.send('Hi Mr server, connect bhail ki na, bheja jawab')
            //     conn.onmessage = (data) => {
            //         console.log(data)
            //     }
            // },5*1000)
            
        },
        watch: {
            $route(to) {
                document.title = to.meta.title || "Lira";
            }
        },
        methods: {
            showAuthorization(){
                this.$router.push('/unauthorize');
            },
            showErrorModal(data) {
                this.error.auth = data.auth;
                this.error.title = 'Error!';
                this.error.message = data.message;
                
                if ( typeof data.auth === 'boolean' && data.auth === false) {
                    localStorage.removeItem('userData');
                    if(this.$route.name !== 'login'){
                        this.$router.push({ path: '/login' })
                    }
                }else{
                    this.isModalVisible = true;
                }
            },
            hideModal() {
                this.isModalVisible = false;
                if (this.$route.meta.auth && (typeof this.error.auth === 'boolean' && this.error.auth === false)) {
                    localStorage.removeItem('userData');
                    this.$router.push({ path: '/login' })
                }
                this.error = {};
                this.showLoader(false)
                // this.hideLoader();
            },
            showLoader(value) {
                this.isLoading = value;
            },
        }
    };
</script>

<style module lang="scss">
    .app {
        min-height: 100%;
        height: auto;
        position: relative;
    }
</style>
