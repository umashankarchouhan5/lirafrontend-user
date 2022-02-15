<template>
    <FormWrapper >
        <PageTitle title="Dashboard" slot="title" />
        <FormRow>
            <div class="col-lg-4">
                <Card title="My Tasks">
                    <Tasks :items="tasks" @onClick="setStatusId"/>
                </Card>
            </div>
            <div class="col-lg-4">
                <Card title="Reminders">
                    <Reminds :items="reminders" />
                </Card>
            </div>
            <div class="col-lg-4">
                <Card title="Annual Renewals" class="no-padding">
                    <Renewals :data="renewals" height="175px" />
                </Card>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-lg-4">
                <Card title="My Requests">
                    <Requests :items="requests" @onClick="setStatusId"/>
                </Card>
            </div>
            <div class="col-lg-4 ">
                <Card title="My Entities" class="no-padding">
                    <Entities :data="entities" height="175px" />
                </Card>
            </div>
            <div class="col-lg-4">
                <Card title="Notices">
                    <Notices :items="notices" />
                </Card>
            </div>
        </FormRow>
        
        <Popup :value="modals.financial.visible"
            type="information"
            title="Financial Year Date"
            :closable="false"
            :mask-closable="false"
            @close="() => modals.financial.visible = false"
        >

            <DayMonthSelect :errors="errors" is-required label="Financial Year Date" @onSelect="onSelectFD"></DayMonthSelect>

            <ButtonGroup slot="footer">
                <FormButton @click="submitFinancialYear">Submit</FormButton>
            </ButtonGroup>

        </Popup>
        
        <Popup :value="modals.success.visible"
            type="success"
            title="Success"
            :closable="true"
            :mask-closable="true"
            @close="() => modals.success.visible = false"
        >

            {{modals.success.message}}

            <ButtonGroup slot="footer">
                <FormButton @click="() =>  modals.success.visible = false">Ok</FormButton>
            </ButtonGroup>

        </Popup>

    </FormWrapper>
</template>
<script>
    import FormWrapper from 'Components/form/FormWrapper'
    import PageTitle from 'Components/layout/PageTitle'
    import { Card, Tasks, Reminds, Requests, Renewals, Entities, Notices } from './components'
    import { getDashboard, updateFinancialYear  } from './config/requests'
    import DayMonthSelect from 'Components/dayMonthSelect/dayMonthSelect'

    export default {
        name: 'dashboard',
        components:{
            FormWrapper,
            PageTitle,
            Card,
            Tasks,
            Reminds,
            Requests,
            Renewals,
            Entities,
            Notices,
            DayMonthSelect
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        async mounted() {
          const { data } = await getDashboard();

          [ this.notices = [], this.reminders = [], this.tasks = [], this.renewals = [], this.entities = [], this.requests = [] ] = data;
        },
        data() {
            return {
                notices: [],
                reminders: [],
                tasks: [],
                renewals: [],
                entities: [],
                requests: [],
                modals: {
                    financial:{
                        visible: false,
                    },
                    success: {
                        visible: false,
                        message: '',
                    }
                },
                day: null,
                year: null,
                errors: [],
                
            };
        },
        created(){
            // if(this.userData.icsp_FinYearEndDateAvailable === 0 && this.userData.icsp_id !== null){
            //     this.modals.financial.visible = true;
            // }
        },
        methods: {
            setStatusId() {
                this.$router.push({ path: '/tasks' });
            },
            
            onSelectFD(date) {
                this.FD = date;
            },
            submitFinancialYear(){
                
                this.errors = [];
                if (!this.FD) {
                    this.errors.push('fd')
                }
                else{
                    updateFinancialYear({mm: this.FD.month, dd: this.FD.day}).then(
                        res => {
                            this.modals.financial.visible = false;
                            this.modals.success.message = res.message;
                            this.modals.success.visible = true;
                        }
                    );
                }
            },
        },
    }
</script>

<style lang="scss" module>
</style>
