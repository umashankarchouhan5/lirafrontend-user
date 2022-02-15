<template>
    <FormWrapper>
        <PageTitle title="My PQ Passport Update"  slot="title" />

        <Loader v-if="isLoading" />

        <ValidationObserver ref="validator" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText  v-model="newPassport" rules="required|alphaNumCustom" label="New Passport Number" :readonly="readonly" />
                </div>
            </FormRow>
        </ValidationObserver>
        
        <FormButton type="success" @click="submitPassport" >Submit</FormButton>

        <Popup :value="successModal.visible" title="Success" type="success" :closable="false" :mask-closable="false" @close="() => successModal.visible = false">
            <p>{{ successModal.message }}</p>
            <FormButton  slot="footer" @click="backToHome" left-icon="md-arrow-round-back">Go to Home</FormButton>
        </Popup>
        
        <Popup title="Information" :value="warningModal.visible" :mask-closable="false" :closable="false" @close="() => warningModal.visible = false">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton  @click="() => backToHome()">Go to Home</FormButton>
            </div>
        </Popup>
    </FormWrapper>
</template>
<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { getMyPq, updatePqPassport } from '../config/requests';
    import loadingMixin from 'Mixins/loadingMixin';
    import Loader from 'Components/layout/Loader';
    import { ValidationObserver } from 'vee-validate'

    export default {
        name: 'VerifyEmailPQ',
        mixins: [loadingMixin],
        components:{
            FormWrapper,
            PageTitle,
            Loader,
            ValidationObserver
        },
        data(){
            return{
                newPassport: '',
                successModal: {
                    visible: false,
                    message: ''
                },
                readonly: false,
                warningModal: {
                    visible: false,
                    message: ''
                },
                pq_id: null,
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user;
            },
        },
        created(){
            this.getPQDetails();
        },
        methods:{
            getPQDetails() {
                getMyPq().then(res => {
                    if(res.data.id !== undefined && res.data.id !== null) {
                        this.pq_id = res.data.id;
                        
                    }
                    else{
                        this.warningModal.message = 'No My PQ associated yet.'
                        this.warningModal.isVisible = true;
                    }
                });
            },
            backToHome() {
                this.successModal.visible = false;
                setTimeout(() => this.$router.push('/dashboard'),200);
            },
            submitPassport() {
                this.$refs.validator.validate().then(results => {
                    if(results){
                        updatePqPassport({passport: this.newPassport, pq_id: this.pq_id}).then(
                            res => {
                                this.readonly = true;
                                this.newPassport = '';
                                this.successModal.message = "Passport has been changed."
                                this.successModal.visible = true;
                            }
                        )
                    }
                })
            },
        }
    }
</script>