<template>
    <FormWrapper>
        <PageTitle :title="licenseName ? details[licenseName].title : ''" slot="title" :link="`/help/${licenseName ? details[licenseName].process_id : ''}`" />
        <div>
            <div v-html="instructionData" ></div>
            <br />
            <!-- //summary component  -->
            <!-- uncomment when needed -->
            <!-- <DynamicSummary v-if="showSummary" :stepsData="steps" :licenseData="licenseData" @stepToGo="gotoStep" :documents="documentsData" :generatePdf="generatePdf" /> -->

            <br />
            <ButtonGroup>
                <FormButton type="success" @click="proceed"  left-icon="md-checkmark-circle-outline">Proceed</FormButton>
                <FormButton type="primary" @click="backToList" left-icon="ios-close-circle-outline">Cancel</FormButton>
            </ButtonGroup>
            
        </div>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { fetchInstructions, 

    //for summary component
    getDynamicDatabyID, createNewForm, fetchLicenseApplicantCompany, getTaskDocuments, generateSecuritiesPDF } from '../APIRequests';
    
    //for summary component
    import details from './InstructionData'

    export default {
        name:'InstructionComponent',
        //for summary component

        components:{
            PageTitle,
            FormWrapper,
        },
        props: {
            steps:{ 
                type: Array,
                default: () => []
            },
            licenseName: {
                type: String,
                required: true
            }
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
                showSummary: false,
                details,
                documentsData: [],
                reference_id: null,
            }
        },
        created(){
            this.fetchInstruction();

            // for summary  component

            // uncomment when summary is needed

            // fetchLicenseApplicantCompany({process_id: details[this.licenseName].process_id}).then(
            //     res => {
            //         if(res.data[0].company_id === 0){
            //             this.showSummary = false;
            //         }
            //         else{
            //             this.company_id = res.data[0].company_id;
            //             this.generateDraft();
            //         }
            //     },
            //     err => {
            //         this.licenseData = []
            //     }
            // )
        },
        methods:{
            generatePdf(){
                const formData = new FormData();
                formData.append('form_id',this.reference_id);
                formData.append('process_id', details[this.licenseName].process_id);
                formData.append('prefix',this.licenseName);
                generateSecuritiesPDF(formData).then(
                    res => {
                        
                        window.open(res.data.url,'_blank');
                    }
                )
            },
            //for summary component
            gotoStep(step) {
                this.$store.commit('setUserDefinedStep', step);
                this.$router.push(details[this.licenseName].url)
            },
            //for summary component
            generateDraft(){
                createNewForm({process_id: details[this.licenseName].process_id, company_id: this.company_id}).then(
                    res => {
                        this.reference_id = res.data[0].reference_id;
                        this.getDataForSummary(res.data[0].reference_id);
                    }
                )
            },
            //for summary component
            getDataForSummary(val){
                Promise.all([
                    getDynamicDatabyID({process_id: details[this.licenseName].process_id, reference_id: val}),
                    getTaskDocuments({process_id: details[this.licenseName].process_id, reference_id: val})
                ]).then(this.handleSummaryResposne)
            },
            handleSummaryResposne(response){
                this.licenseData = response[0].data;
                this.documentsData = response[1].data.mandatory;
                this.showSummary = true;
            },
            proceed(){
                this.$router.push(details[this.licenseName].url);
            },
            backToList(){
                this.$router.push('/dashboard')
            },
            fetchInstruction(){
                fetchInstructions({process_id: details[this.licenseName].process_id }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            }
        }
    }
</script>