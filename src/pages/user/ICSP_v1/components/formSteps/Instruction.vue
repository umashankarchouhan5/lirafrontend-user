<template>
    <FormWrapper>
        <PageTitle title="ICSP Application Form – Instructions" slot="title" link="/help/700" />
        <div>
            <div v-html="instructionData">
                <!-- <>
                    {{instructionData}}
                </p> -->
            </div>
            <br />
            <ButtonGroup>
                <FormButton type="success" @click="nextStep"  left-icon="md-checkmark-circle-outline">Proceed</FormButton>
                <FormButton type="primary" @click="backToList" left-icon="ios-close-circle-outline">Cancel</FormButton>
            </ButtonGroup>
            
            <Popup :value="popupSuccess.isVisible" title="Are you sure you wish to proceed with the licence application?" :mask-closable="false" :closable="false">
                You have no PQ forms associated with your account. Are you sure you wish to proceed ?
                <FormButton slot="footer" @click="proceed">Yes</FormButton>
                <FormButton slot="footer" @click="backToList">No</FormButton>
            </Popup>
        </div>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { fetchInstructions, validateICSPInitial } from '../../APIRequests';
    import { APPLICATION_OF_ICSP  } from 'Config/processIds';
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
                validateICSPInitial({process_id: APPLICATION_OF_ICSP }).then(
                    res => {
                        localStorage.setItem('personData',JSON.stringify(res.data[1][0]));
                        if(res.data[1][0].PQCount == 0){
                            this.popupSuccess.isVisible = true;
                        }else{
                            this.proceed();
                        }
                    }
                )
            },
            proceed(){
                this.popupSuccess.isVisible = false;
                setTimeout( () => {
                    this.$router.push('/icspForm');
                },100)
            },
            backToList(){
                this.$router.push('/dashboard')
            },
            fetchInstruction(){
                fetchInstructions({process_id: APPLICATION_OF_ICSP }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            }
        }
    }
</script>