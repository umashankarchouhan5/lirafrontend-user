<template>
    <FormWrapper>
        <PageTitle title="Security License - Instruction" slot="title" link="/help/701" />
        <div>
            <div v-html="instructionData" ></div>
            <br />
            <ButtonGroup>
                <FormButton type="success" @click="proceed"  left-icon="md-checkmark-circle-outline">Proceed</FormButton>
                <FormButton type="primary" @click="backToList" left-icon="ios-close-circle-outline">Cancel</FormButton>
            </ButtonGroup>
            
        </div>
        <!-- //summary component  -->
        <DynamicSummary :stepsData="steps" :licenseData="licenseData" />
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { SECURITY_LICENSE} from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import { fetchInstructions, 

    //for summary component
    getDynamicDatabyID, createNewForm, fetchLicenseApplicantCompany,} from '../components/APIRequests';
    
    //for summary component
    import steps from './steps';
    import formStepsMixin from 'Mixins/formStepsMixin';

    export default {
        name:'Instruction',
        //for summary component
        mixins: [formStepsMixin],

        components:{
            PageTitle,
            FormWrapper,
        },
        data(){
            return{
                instructionData:[],
                popupSuccess: {
                    isVisible: false,
                },
                //for summary component
                licenseData: [],
                company_id: null,
            }
        },
        created(){
            this.fetchInstruction();
            // for summary  component
            this.setSteps(steps);
            fetchLicenseApplicantCompany({process_id: SECURITY_LICENSE}).then(
                res => {
                    if(res.data[0].company_id === 0){

                    }
                    else{
                        this.company_id = res.data[0].company_id;
                        this.generateDraft();
                    }
                },
                err => {
                    this.licenseData = []
                }
            )
        },
        methods:{
            //for summary component
            generateDraft(){
                createNewForm({process_id: SECURITY_LICENSE, company_id: this.company_id}).then(
                    res => {
                        this.getDataById(res.data[0].reference_id);
                    }
                )
            },
            //for summary component
            getDataById(val){
                getDynamicDatabyID({process_id: SECURITY_LICENSE, reference_id: val}).then(
                    res => {
                        this.licenseData = res.data;
                    }
                )
            },


            nextStep(){
                
            },
            proceed(){
                this.$router.push('/securityLicenseForm');
            },
            backToList(){
                this.$router.push('/dashboard')
            },
            fetchInstruction(){
                fetchInstructions({process_id: SECURITY_LICENSE }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            }
        }
    }
</script>