<template>
    <div :class="$style.menu">
        <!-- Change License Button -->
        <div :class="$style.menuItem" v-if="user.sso && user.sso == 1 && user.icsp_id && user.icsp_id !== null">
            <span :class="$style.name" @click="warningModal.isVisible = true" style="cursor:pointer" :title="`Change`">
                <span v-if="user.LastLicense_id !== undefined && user.LastLicense_id !== null">{{user.license_name}}</span>
                <span v-else>Change License</span>
            </span>
        </div>
        <LicenseSelect v-if="user.sso && user.sso == 1 && showLicenseSelection == true && user.icsp_id && user.icsp_id !== null" @licenseSelected="changeLicenseSelection" cancelButton />

        <router-link :to="routeToGo.path" :class="$style.menuItem">
            <span :class="$style.name">{{ routeToGo.name }}</span>
        </router-link>

        <Dropdown :class="$style.dropdown" trigger="click"  placement="bottom-end">
            <a href="javascript:void(0)" :class="$style.menuItem">
                <div :class="$style.notifCount" v-if="count !== 0">{{count}}</div>
                <img src="../../../assets/images/ring.png">
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(notif,index) in notifications" :key="index"><p @click="readNotification(notif)" :class="notif.ReadDate !== null ? $style.readed : ''">{{notif.Subject}}</p></DropdownItem>

                <DropdownItem divided v-if="notifications.length > 0" :class="$style.seeAllBackground"><p @click="goToNotification">See All</p></DropdownItem>
                <DropdownItem :class="$style.seeAllBackground" v-else><p >No notifications yet </p></DropdownItem>

            </DropdownMenu>
        </Dropdown>

        <Dropdown :class="$style.dropdown" trigger="click"  placement="bottom-end">
            <a href="javascript:void(0)" :class="$style.menuItem">
                <img src="../../../assets/images/info.png">
            </a>
            <DropdownMenu slot="list">
                <DropdownItem><a href="#"><img  :class="$style.dropDownImage" src="../../../assets/images/mobile.png" alt="User Image">+248-4380800</a></DropdownItem>
                <DropdownItem><a href="mailTo:lira@xyz.com"><img  :class="$style.dropDownImage" src="../../../assets/images/mail.png" alt="User Image">info@fsa.com</a></DropdownItem>
                <!-- <DropdownItem disabled><a href="#">Inbox</a></DropdownItem> -->
                <!-- <DropdownItem><a href="#"><Icon type="md-cloud" :class="$style.dropDownImage"></Icon>Chat</a></DropdownItem> -->
            </DropdownMenu>
        </Dropdown>

        <Dropdown v-if="user" :class="$style.dropdown" @on-click="handleClick" trigger="click" placement="bottom-end">
            <a href="javascript:void(0)" :class="$style.menuItem" >
                <span :class="$style.name">{{ userName }}</span>
                <img src="../../../assets/images/user.png" class="user-image" alt="User Image">
            </a>
            <DropdownMenu slot="list">
                <DropdownItem>
                    <router-link to="/profile">Profile</router-link>
                </DropdownItem>
                <DropdownItem v-if="user.is_primary === true && user.icsp_id && user.icsp_id !== null">
                    <router-link to="/users">User Management</router-link>
                </DropdownItem>
                <DropdownItem v-if="user.is_primary === true && user.icsp_id && user.icsp_id !== null">
                    <router-link to="/legalEntities">Legal Entities</router-link>
                </DropdownItem>
                <DropdownItem v-if="user.is_primary === true && user.icsp_id && user.icsp_id !== null">
                    <router-link to="/myWallet">My Wallet</router-link>
                </DropdownItem>
                <DropdownItem>
                    <router-link to="/change-password">Change Password</router-link>
                </DropdownItem>
                <!-- <DropdownItem>
                    <router-link to="/tasks">My Tasks</router-link>
                </DropdownItem> -->
                <DropdownItem >
                    <router-link to="/login">Logout</router-link>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <Popup :value="warningModal.isVisible"
            type="info"
            title="Warning"
            :closable="false"
            :mask-closable="false"
            @close="() => warningModal.isVisible = false"
        >
            <p>Before proceeding save any unsaved data. Unsaved data will be lost after license change.</p>
            
            <ButtonGroup slot="footer">
                <FormButton @click="() => openChangeLicense()">Confirm</FormButton>
                <FormButton @click="() => warningModal.isVisible = false">Cancel</FormButton>
            </ButtonGroup>
        </Popup>
    </div>
</template>

<script>

    import { Dropdown, DropdownMenu, DropdownItem } from 'view-design'
    import { getNotification, getNotificationCount, readNotificationWeb, ticketToProcess } from './HeaderMenuApi';
    import LicenseSelect from 'Pages/master/LicenseComponent'

    export default {
        name: "HeaderMenu",
        components: {
            Dropdown,
            DropdownMenu,
            DropdownItem,
            LicenseSelect
        },
        data() {
            return {
                routesToGo: {
                    tasks: {
                        name: 'Dashboard',
                        path: '/dashboard'
                    },
                    dashboard: {
                        name: 'My Tasks',
                        path: '/tasks'
                    }
                },
                notifications: [],
                count: 0,
                notificationData: [],
                notifInterval: '',
                showLicenseSelection: false,
                warningModal: {
                    isVisible: false
                }
            }
        },
        computed: {
            routeToGo() {
                if(this.$route.name == 'tasks'){
                    return this.routesToGo[this.$route.name];
                }else{
                    return this.routesToGo['dashboard'];
                }
            },
            userName() {
                return this.$store.state.user.user !== null ? this.$store.state.user.user.user_name : ''
            },
            user(){
                return this.$store.state.user.user;
            },
            menu() {
                return this.$store.state.menu.menu
            },
        },
        
        created(){
            if(this.user !== undefined && this.user !== null)
            {
                this.getNotifs();
            }
            // this.notifInterval = setInterval(this.getNotifs,60000);
            // setInterval(this.getNotifs,10800000);

        },
        methods: {
            openChangeLicense() {
                this.warningModal.isVisible = false;
                this.showLicenseSelection = true
            },
            changeLicenseSelection(val){
                this.showLicenseSelection = !val;
            },
            goToNotification(){
                this.$router.push('/notifications');
            },
            handleClick() {

            },
            getNotifs(){
                if(this.user !== undefined && this.user !== null && this.user.user_id){
                    getNotification({"filterjson":{"sort":[{"key":"id","order":"Desc"}],"paging":[{"startindex":1,"pagesize":10}]}}).then(
                        res => {
                            this.notifications = res.data[0];
                        }
                    )
                    getNotificationCount().then(
                        res => {
                            this.count = res.data[0].Count;
                        }
                    )
                    setTimeout(() => {
                        this.getNotifs();
                    },(3*60*60*1000))
                }
            },
            readNotification(notif){
                
                readNotificationWeb({notification_id:notif.notification_id}).then(
                    res => {
                        this.getNotifs();
                    }
                )
                if(notif.notificationType_id && notif.notificationType_id == 2){
                    this.$router.push(`/invoice/${notif.invoice_id}`)
                }
                // else if(notif.notificationType_id && notif.notificationType_id == 3){
                //     this.$router.push(`/rfi/${notif.TicketReference}`)
                // }
                else{
                    ticketToProcess({TicketReference: notif.TicketReference}).then(
                        res => {
                            this.$store.dispatch('setParent',res.data[1][0]);
                            this.$store.dispatch('setTicketReference', notif.TicketReference);

                            this.$router.push({
                                name:'tasks', 
                                query: { TicketReference: notif.TicketReference}
                            });

                        }
                    )
                }
            },
        },
        // beforeDestroy(){
        //     clearInterval(this.notifInterval);
        // }
    }
</script>

<style lang="scss" module>
    
    .readed{
        background: lightgray;
    }
    .dropDownImage{
        width: 12px;
        margin-right: 10px;
    }
    .menu {
        position: absolute;
        right: 15px;
        top: 0;
        display: flex;
        height: 100%;
        img {
            vertical-align: middle;
        }
    }
    .menuItem {
        line-height: 52px;
        padding: 0 6px;
        display: block;
        position: relative;
        z-index: 1;
        img{
            z-index: 1;
        }
        .notifCount{
            position: absolute;
            background: #ff3547;
            // background: #6da2f9;
            top: 7px;
            right: -3px;
            color: white;
            // color: black;
            padding: 2px 2px;
            z-index: -1;
            height: 15px;
            min-width: 15px;
            font-size: 10px;
            display: flex;
            font-weight: 700;
            justify-content: center;
            // text-shadow: 1px 1px white;
            align-items: center;
            border-radius: 35px;
        }
    }
    .name {
        font-size: 14px;
        color: #6da2f9;
        font-weight: 600;
        line-height: 15px;
        margin-right: 5px;
        text-align: right;
        text-transform: capitalize;
    }

    .dropdown {
        :global {
            .ivu-select-dropdown {
                margin: 0;
                border: 1px solid rgba(0,0,0,.15);
                border-radius: 4px;
                .ivu-dropdown-item-divided {
                    margin-top: 9px;
                    padding-top: 9px;
                    border-top: 1px solid #eee;
                }
                .ivu-dropdown-item {
                    a {
                        padding: 6px 10px;
                        transition: background-color 200ms ease;
                        font-size: 14px;
                        font-weight: 300;
                        color: #000;
                        display: block;
                        min-width: 160px;
                        cursor: pointer;
                        &:hover {
                            background-color: #e1e3e9;
                            color: #333;
                        }
                    }
                    p{
                        padding: 6px 10px;
                        transition: background-color 200ms ease;
                        font-size: 14px;
                        font-weight: 300;
                        color: #000;
                        display: block;
                        min-width: 160px;
                        cursor: pointer;
                        &:hover {
                            background-color: #e1e3e9;
                            color: #333;
                        }
                    }
                }
            }
        }
    }
    
    .seeAllBackground {
        background: #fafafa;
    }
</style>
