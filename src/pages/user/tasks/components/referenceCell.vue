<template>
    <div>
        <!-- <a @click="link" v-if="row.Status_id !== 32 && row.Process_id !== 501">{{ row.TicketReference }}</a> -->
        <p >{{row.TicketReference}}</p>
    </div>
</template>

<script>

    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        computed: {
            menu() {
                return this.$store.state.menu.menu
            },
        },
        methods:{
            link() {
                const processID = this.row.Process_id;
                const referenceID = this.row.reference_id
                this.$store.dispatch('setProcessId', processID);
                this.$store.dispatch('setReferenceId',referenceID);
                var parentMenu = this.menu.find( item => {
                    return item.id === this.row.ProcessType_id;
                })
                if(processID === 109 || processID === 300 || processID === 301 || processID === 302 || processID === 303 || processID === 304 || processID === 305 || processID === 307 || processID === 309 || processID === 310 || processID === 311 || processID === 602 || processID === 603){
                    var subMenu = parentMenu.submenu.find( item => {
                        return item.process_id === 300;
                    })
                }else{
                    var subMenu = parentMenu.submenu.find( item => {
                        return item.process_id === processID;
                    })
                }
                if(processID === 109 || processID === 300 || processID === 301 || processID === 302 || processID === 303 || processID === 304 || processID === 305 || processID === 307 || processID === 309 || processID === 310 || processID === 311 || processID === 602 || processID === 603){
                    sessionStorage.setItem(PROCESS_ID, processID);
                    sessionStorage.setItem(REFERENCE_ID, referenceID);
                    this.$router.push({path:`${subMenu.URL}/${referenceID}`});
                    // this.$router.push({ name: 'changes_edit'})
                }
                else if(processID === 702){
                    this.$router.push({path:`${subMenu.URL}/${this.row.pq_id}`});
                }
                else{
                    if( subMenu.URL.path){
                        this.$router.push({path:`${subMenu.URL.path}/${referenceID}`});

                    }else{
                        this.$router.push({path:`${subMenu.URL}/${referenceID}`});
                    }

                }
            }

        }
    }
</script>
