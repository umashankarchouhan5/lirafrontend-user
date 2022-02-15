<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Request for Information" slot="title" link="/help/803" />
        
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />
        
        <ValidationObserver ref="validator">
            <FormRow>
                <div class="col-sm-3">
                    <InputText v-model="userData.company" readonly label="Organization" />
                </div>
                <div class="col-sm-2">
                    <InputDate v-model="requestedDate" readonly label="Requested Date" />
                </div> 
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="form.requestLetterReference" rules="required" label="Request Reference" maxlength="100" />
                </div>
                <div class="col-sm-4">
                    <FormSelect label="RFI Type" rules="required" :items="rfiTypes" item-name="Name" item-value="id" v-model="form.RFIType" />
                </div>
                <div class="col-sm-4">
                    <FormSelect label="RFI Nature" rules="required" :items="rfiNatures" item-name="Name" item-value="id" v-model="form.RFINature" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-5">
                    <InputText v-model="form.RFIForName" rules="required" label="Name of Entity/ Individual" maxlength="100" />
                </div>
                <div class="col-sm-5">
                    <InputText v-model="form.requestPurpose" rules="required" label="Purpose of Request" maxlength="100" />
                </div>
                
                <div class="col-sm-2">
                    <InputDate v-model="form.deadline" rules="required" :options="options" label="Deadline" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea v-model="form.RFIBrief" rules="required" label="Requested Information" rows="5" maxlength="1000" />
                </div>
            </FormRow>
        </ValidationObserver>
        <FormButton
            left-icon="md-checkmark-circle-outline"
            type="success"
            @click="() => rfiSubmit()"
        >
            Submit
        </FormButton>
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
        <Popup :value="modals.success.isVisible"
               type="success"
               title="Submitted Successfully"
               :closable="false"
               :mask-closable="false"
               @close="() => modals.success.isVisible = false">
            <div :class="$style.success">
                <template v-if="ticketReference !== null">
                    <template v-if="modals.success.step === 1">
                        <p>Your request has been submitted successfully.</p>
                        <p>Your request # for future reference is <strong>{{ ticketReference }}</strong>.</p>
                    </template>
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ ticketReference }}</strong> has been submitted for further processing.</p>
                    </template>
                </template>
                <template v-if="modals.success.step === 4">
                    <p>{{ modals.success.message }}</p>
                </template>
            </div>
            <ButtonGroup slot="footer">
                <FormButton @click="backToList">Back To Home</FormButton>
            </ButtonGroup>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import { REQUEST_FOR_INFORMATION } from 'Config/processIds';
    import { getRFIType, rfiRequest, generateProcessTicket, getRFINature } from '../api';
    import InputDate from 'Components/form/InputDate';
    import TicketHeader from 'Components/layout/TicketHeader';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "TicketsList",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            InputDate,
            TicketHeader,
            ValidationObserver
        },
        data() {
            return {
                ticketValue: {
                    Referrence: DateUtil.formatDate(Date.now()),
                    CompanyName: '',
                    EntityType: 'Govt'
                },
                rfiTypes: [],
                rfiNatures: [],
                requestedDate: DateUtil.formatDate(Date.now()),
                form: {
                    reference_id: 0,
                    RFIForName: '',
                    RFIType: '',
                    RFINature: '',
                    requestLetterReference: '',
                    requestPurpose: '',
                    RFIBrief: '',
                    deadline: null,
                    organization: '',
                },
                warningModal: {
                    visible: false,
                    message: '',
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false,
                    }

                },
                modals: {
                    success: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    },
                    failure: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    }
                },
                ticketReference: null,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        created() {
            this.getFilterValues();
            this.ticketValue.CompanyName = this.userData.user_name;
            this.ticketValue.Referrence = DateUtil.formatDate(Date.now());
        },
        watch: {
            
        },
        methods: {
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getRFIType(),
                    getRFINature()
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.rfiTypes = response[0].data;
                this.rfiNatures = response[1].data;
                
            },
            rfiSubmit() {
                this.$refs.validator.validate().then((result) => {
                    if(result){
                        this.showLoader();
                        rfiRequest(this.form).then(this.handleResponse);
                    }
                })
            },
            handleResponse(response) {
                const data = {
                    process_id: REQUEST_FOR_INFORMATION,
                    reference_id: response.data[0].reference_id
                }
                generateProcessTicket(data).then(
                    res => {
                        
                        this.ticketReference = res.data[0].TicketReference;
                        this.modals.success.step = 1;
                        this.modals.success.isVisible = true;
                        this.hideLoader();
                    }
                )
            },
            backToList(){
                this.$router.push('/dashboard');
            }
        }
    }
</script>

<style lang="scss" module>
    .success {
        p {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }

 

</style>
