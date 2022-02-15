<template>
    <FormWrapper>
        <PageTitle title="Surrender - Instruction" slot="title" link="/help/701" />
        <div>
            <div v-html="instructionData"></div>
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
    import { fetchInstructions} from './api';
    import { SURRENDER, SURRENDER_GAMBLING, SURRENDER_INSURANCE, SURRENDER_SECURITY } from 'Config/processIds';
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
            if( this.$route.name == 'SurrenderLicense'){
                this.$store.commit('setProcessId', SURRENDER);
                this.fetchInstruction(SURRENDER);
            }
            else if( this.$route.name == 'SurrenderLicenseSecurity'){
                this.$store.commit('setProcessId', SURRENDER_SECURITY);
                this.fetchInstruction(SURRENDER_SECURITY);
            }
            else if( this.$route.name == 'SurrenderLicenseInsurance'){
                this.$store.commit('setProcessId', SURRENDER_INSURANCE);
                this.fetchInstruction(SURRENDER_INSURANCE);
            }
            else if( this.$route.name == 'SurrenderLicenseGambling'){
                this.$store.commit('setProcessId', SURRENDER_GAMBLING);
                this.fetchInstruction(SURRENDER_GAMBLING);
            }
        },
        methods:{
            proceed(){
                if( this.$route.name == 'SurrenderLicense' ){
                    this.$router.push({name:'SurrenderLicenseForm'})
                }
                else if( this.$route.name == 'SurrenderLicenseSecurity'){
                    this.$router.push({name:'SurrenderLicenseSecurityForm'})
                }
                else if( this.$route.name == 'SurrenderLicenseInsurance'){
                    this.$router.push({name:'SurrenderLicenseInsuranceForm'})
                }
                else if( this.$route.name == 'SurrenderLicenseGambling'){
                    this.$router.push({name:'SurrenderLicenseGamblingForm'})
                }
            },
            backToList(){
                this.$router.push('/dashboard')
            },
            fetchInstruction(process_id){
                fetchInstructions({process_id: process_id }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            }
        }
    }
</script>