<template>
    <FormWrapper>
        <PageTitle title="My PQ Email Update"  slot="title" />

        <p>To change your email id, we will send a verification link to your secondary email id mentioned in your PQ form. You will be able to change email id after clicking the verification link.</p>

        <p>Please note that the primary email id of your PQ form is also the registered email or username of your account. When you change your primary email id, your login username would be changed too. </p>

        <p>If you are sure you want to change the email id, click the link below:</p>
        <br />
        <FormButton type="success" @click="sendLink()">Send Verification Link</FormButton>

        <Popup :value="successModal.visible" title="Success" type="success" :closable="false" :mask-closable="false" @close="() => successModal.visible = false">
            <p>{{ successModal.message }}</p>
            <FormButton  slot="footer" @click="backToList" left-icon="md-arrow-round-back">Back to Home</FormButton>
        </Popup>
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import {
        getMyPq,
        sendPqEmailUpdate
    } from '../config/requests';

    export default {
        name: 'PQEmailUpdate',
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle
        },
        data() {
            return {
                pqData: null,
                successModal: {
                    visible: false,
                    message: ''
                },
            }
        },
        created() {
            this.getPQDetails();
        },
        methods: {
            backToList(){
                this.successModal.visible = false;
                setTimeout(() => this.$router.push('/dashboard'))
            },
            getPQDetails() {
                this.showLoader()
                getMyPq().then(res => {
                    this.pqData = res.data;
                    this.hideLoader();
                });
            },
            sendLink() {
                sendPqEmailUpdate({pq_id: this.pqData.id}).then(
                    res => {
                        this.successModal.message = res.message;
                        this.successModal.visible = true;
                    }
                )
            }
        }
        
    }
</script>