import { getPcWeb } from 'Pages/master/masterActions'


export default {
    data() {
        return {
            pcWeb: {},
            readOnly: false,
            readonly: false 
        }
    },
    computed: {
        processId() {
            return this.$store.state.common.currentProcessId;
        },
        userData() {
            return this.$store.state.user.user;
        },

    },
    watch: {
        processId(val) {
            if(val !== undefined && val !== null) {
                this.getPCWebData()
            }
        }
    },
    methods: {
        getPCWebData() {
            getPcWeb({process_id: this.processId}).then( res=> {
                this.pcWeb = res.data[0];
            })
        },
        checkRestricted(){
            console.log(this.userData.isRestricted)
            console.log(this.pcWeb.isRestricted)
            if(this.userData.isRestricted == 1 && this.pcWeb.isRestricted == 1){
                return true;
            }
            else {
                return false;
            }
        }
    }
};