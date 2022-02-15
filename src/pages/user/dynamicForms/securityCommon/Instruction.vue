<template>
    <FormWrapper>
        <PageTitle title="Representive License - Instruction" slot="title" link="/help/701" />
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
    import { fetchInstructions} from '../../components/APIRequests';
    import { REPRESENTATIVE_LICENSE, SECURITY_IA_COMPANY, SECURITY_IA_INDIVIDUAL, SECURITY_EXCHANGE, SECURITY_FACILITY, SECURITY_CLEARING, SECURITY_EXEMPT  } from 'Config/processIds';
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
        computed:{

        },
        created(){
            this.fetchInstruction();
        },
        methods:{
            nextStep(){
                
            },
            proceed(){
                this.$router.push('/representativelicenseForm');
            },
            backToList(){
                this.$router.push('/dashboard')
            },
            fetchInstruction(){
                fetchInstructions({process_id: REPRESENTATIVE_LICENSE }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            }
        }
    }
</script>