<template>
    <FormWrapper>
        <PageTitle title="Personal Questionnaire Form" :link="`/help/${currentProcessId}/${activeStep.id}`" slot="title" />
        <template >
            <Wizard :steps="steps" @changeStep="setActiveStep"/>
            <component :is="activeStep.component"
                ref="component"
                :stepId="activeStep.id"
                :value="form"
                :reference_id="form.data.id"
                :class="$style.formContent"
                :readonly="readonly"
            />
        </template>
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" v-if="showButtons.prev" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" v-if="showButtons.next" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper'
    import Wizard from 'Components/wizard/Wizard.vue'
    import PageTitle from 'Components/layout/PageTitle'

    import STEPS from './steps'
    import data from '../config/data'
    import formStepsMixin from 'Mixins/formStepsMixin'
    import DateUtil from 'Utils/dateUtil';

    import {
        getIdentificationTypes,
        getQualificationTypes,
        addUpdatePQForm,
        createNewForm,
        addUpdatePQRecord,
        getPQformDetails,
        getPQRecordByPQid,
        addUpdatePQFormChecklistData,
        getPQChecklistDataByPQId
    } from '../config/requests'

    export default {
        name: 'PQReadonly',
        mixins: [formStepsMixin],
        data() {
            return {
                readonly: true,
                popupSuccess: {
                    isVisible: false,
                },
                mode: 1,
                form: {
                    data,
                    records: {
                        AQual: [],
                        Addrs: [],
                        Bank: [],
                        CMemb: [],
                        Direc: [],
                        Emplr: [],
                        KPer: [],
                        PQual: [],
                        Partn: [],
                        PrevA: [],
                        Train: [],
                        Trust: [],
                        Natnl: [],
                        Psprt: [],
                    },
                    declaration: {
                        DeclarationDate: DateUtil.formatDate(Date.now()),
                        Name: '',
                        Place: '',
                        isChecked: false,
                        DisplayText: '',
                    },
                    checkList: []
                },
                identificationTypes: null,
                qualificationTypes: null,
                checkIfPQExist: false,
            }
        },
        computed: {
            showButtons() {
                const activeStep = this.activeStep;
                if (activeStep) {
                    return {
                        next: activeStep.id < this.steps.length,
                        submit: activeStep.id === this.steps.length,
                        prev: activeStep.id > 1
                    }
                }
                return false
            },
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            }
        },
        created() {
            this.mode = 1;
            getIdentificationTypes().then(response => this.$store.commit('setIdentificationType', response.data));
            getQualificationTypes().then(response => this.$store.commit('setQualificationTypes', response.data));

            this.$store.commit('setProcessId', 702);

            const { id: formId } = this.$route.params;

            if (formId === 'check') {
                this.checkIfPQExist = true;
            } else {
                this.setSteps(STEPS);
                this.setActiveStep(1);
                this.form.data.id = formId;
                this.getDataRequest()
                    .then(this.handleDataRequest)
            }
        },
        components: {
            FormWrapper,
            Wizard,
            PageTitle,
        },
        methods: { 
            resetActivatedSteps(){   
                this.steps.forEach(item => {
                    if(item.id !== 1){
                        item.isDisabled = true;
                    }
                })
            },
            createNewPQ(data) {
                const { Fname, Lname, DOB, PassportNo } = data;
                this.form.data.Fname = Fname;
                this.form.data.Lname = Lname;
                this.form.data.DOB = DOB;
                this.form.data.PassportNo = PassportNo;
                createNewForm({
                    process_id: this.currentProcessId,
                    ...this.form.data
                }).then((response)=> {
                    this.checkIfPQExist = false;
                    this.setSteps(STEPS);
                    this.setActiveStep(1);
                    this.form.data.id = response.data[0].reference_id;
                    this.$router.replace({ path: `/pq-forms/${this.form.data.id}` });
                    this.getDataRequest(true).then(this.handleDataRequest);

                })
            },
            nextStep() {
                this.updateForm(this.activeStep.id + 1)
            },
            prevStep() {
                this.updateForm(this.activeStep.id - 1,'prev')
            },
            pqFormDataRequest() {
                return getPQformDetails({
                    pq_id: this.form.data.id,
                    webuser_id: this.userData.user_id
                })
            },
            getDataRequest() {
                const requests = [
                    this.pqFormDataRequest(),
                    getPQRecordByPQid(this.form.data.id),
                    getPQChecklistDataByPQId(this.form.data.id)
                ];
                return Promise.all(requests)
            },
            handleDataRequest(response) {
                this.form.data = response[0].data[0];
                this.setActiveStep(1);
                if (response[1].data) {
                    this.form.records = response[1].data
                }
                if (response[2].data) {
                    this.form.checkList = response[2].data
                }
            },
            updateForm(nextStep,dir) {
                this.handleUpdate(nextStep)
            },
            handleUpdate(nextStep){
                this.setActiveStep(nextStep);
            },
        },
        beforeDestroy(){
            this.resetActivatedSteps();
        }
    }
</script>

<style lang="scss" module>
    .formContent {
        h6 {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        p {
            text-align: justify;
            margin-bottom: 20px;
        }
        ol {
            padding-left: 40px;
            margin-bottom: 20px;
            li {
                margin-bottom: 10px;
            }
        }
    }
</style>
