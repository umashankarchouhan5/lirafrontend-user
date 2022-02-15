<template>
    <FormWrapper>
        <PageTitle title="Licence Renewal  and Submission of Compliance Form - Instructions" slot="title" link="/help/117" />
        <div  >
            <div v-html="instructionData"> </div>
            <br />
            <ButtonGroup>
                <FormButton type="success" @click="nextStep"  left-icon="md-checkmark-circle-outline">Next</FormButton>
                <FormButton type="primary" @click="backToList" left-icon="ios-close-circle-outline">Back to Dashboard</FormButton>
            </ButtonGroup>
            
            <Popup :value="popupSuccess.isVisible" title="Continue" :mask-closable="false" :closable="false">
                <p>Please read the disclaimer and instructions completely before proceeding to the form.</p>
                <p>Are you sure you want to proceed?</p>
                <FormButton type="success" slot="footer" @click="proceed">Yes</FormButton>
                <FormButton slot="footer" @click="() => { popupSuccess.isVisible = false }">No</FormButton>
            </Popup>
        </div>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { fetchInstructions } from '../APIRequests';
    import { ANNUAL_COMPLIANCE } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';

    export default {
        name:'Instruction',
        components:{
            PageTitle,
            FormWrapper
        },
        data(){
            return{
                instructionData:[],
                popupSuccess: {
                    isVisible: false,
                },
            }
        },
        created(){
            this.fetchInstruction();
        },
        methods:{
            
            nextStep(){
                // this.$router.push('/annualComplianceView');
                this.popupSuccess.isVisible = true;
            },
            proceed(){
                this.popupSuccess.isVisible = false;
                setTimeout(() => { this.$router.push('/annualComplianceView'); },300)
            },
            backToList(){
                
                this.$router.push('/dashboard')
            },
            fetchInstruction(){
                fetchInstructions({process_id: ANNUAL_COMPLIANCE }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            }
        }
    }
</script>