<template>
    <div>
        <ValidationObserver ref="PQPassword"  v-if="!forgot">
            <FormRow>
                <div class="col-sm-3">
                    <InputText v-model="validationData.PQID" label="PQ ID" rules="required" :readonly="uniqueRef !== null" />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="validationData.passportNo" label="Passport Number" rules="required|alphaNumCustom"  />
                </div>
                
                <div class="col-sm-4">
                    <InputText v-model="validationData.password" label="Password" passwordOff  type="password" rules="required"/>
                </div>
            </FormRow>
            <a :class="$style.forgot" v-on:click.prevent="sendMail()"><p>Forgot Password</p></a>
            <br />
            <ButtonGroup>
                <FormButton type="success" @click="() => validatePQ()" left-icon="md-checkmark-circle-outline">Submit</FormButton>
                <FormButton v-if="closePopup" @click="closeModal()">Close</FormButton>
                <FormButton v-if="backButton" @click="backTo()">Back</FormButton>
            </ButtonGroup>
        </ValidationObserver>

        <ValidationObserver ref="PQPasswordForgot"  v-if="forgot">
            <FormRow>
                
                <div class="col-sm-3">
                    <InputText v-model="forgotValidationData.PQID" label="PQ ID" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="forgotValidationData.passportNo" label="Passport Number" rules="required"  />
                </div>
            </FormRow>
            <br />
            <ButtonGroup>
                <FormButton   type="success" @click="() => submitForgot()" left-icon="md-checkmark-circle-outline">Reset Password</FormButton>
                <FormButton  v-if="closePopup" @click="closeModal()">Close</FormButton>
                <FormButton   @click="backToLogin()">Back</FormButton>
            </ButtonGroup>
        </ValidationObserver>
        <Popup :value="isPopupVisible" title="Success" type="success">
            {{ message }}
            <FormButton slot="footer" @click="closePopupSuccess">Ok</FormButton>
        </Popup>
    </div>
</template>

<script>

    import { validatePQpwd, pqForgotPassword} from './api'
    import { ValidationObserver } from 'vee-validate'


    export default {
        name: "PQPassword",
        components: {
            ValidationObserver
        },
        props: {
            closePopup: { 
                type: Boolean,
                default: false,
            },
            backButton: { 
                type: Boolean,
                default: false,
            },
            status,
            uniqueRef: {
                type: [Number, String],
                default: null
            }
        },
        data() {
            return {
                validationData : {
                    PQID: '',
                    passportNo: '',
                    password: '',
                },
                forgotValidationData : {
                    PQID: '',
                    passportNo: '',
                },
                forgot: false,
                isPopupVisible: false,
                message: '',
            }
        },
        watch: {
            back(val) {
                if(val===false) {
                    this.backToLogin();
                }
            },
            uniqueRef(val) {
                if(val !== undefined && val !== null) this.validationData.PQID = val;
            }
        },
        created() {
            if(this.uniqueRef !== undefined && this.uniqueRef !== null) this.validationData.PQID = this.uniqueRef;
        },
        methods: {
            
            closeModal(){
                this.backToLogin();
                this.$emit('closeModal');
                this.$emit('backTo');
            },
            backTo(){
                this.$emit('backTo');
            },
            backToLogin(){
                this.forgot = false;
                this.$emit('resetScreen');
                this.closePopup = true;
                this.backButton = false;
            },
            resetValidationData(){
                this.validationData = {
                    PQID: '',
                    passportNo: '',
                    password: '',
                }
            },
            resetForgotValidationData(){
                this.forgotValidationData = {
                    PQID: '',
                    passportNo: '',
                }
            },
            closePopupSuccess(){
                this.closeModal();
                this.isPopupVisible = false;
            },
            sendMail(){
                this.forgot = true;
                this.closePopup = false;
                this.backButton = true;
                const data = {
                    title: "Forgot Password",
                    message: "Please enter PQ ID and Passport number and click Submit. On submitting, a link to reset password will be sent to the PQ Person whose details are entered here.",
                };
                this.$emit('forgotClicked', data);
                this.$emit('clicked', data);
            },
            async submitForgot() {
                const result = await this.$refs.PQPasswordForgot.validate();
                if (result) {
                    await pqForgotPassword(this.forgotValidationData).then((result)=>{
                        this.resetForgotValidationData();
                        this.message = result.message;
                        this.isPopupVisible = true;
                        this.forgot=false;
                    });
                }
            },
            validatePQ(){
                if(typeof this.status !== "undefined")
                {
                    this.validationData.statusCheck = this.status;
                }
                this.$refs.PQPassword.validate().then(
                    res=> {
                        if(res){
                            validatePQpwd(this.validationData).then(
                                res => {
                                    this.$emit('pqValidation',res.data[0])
                                    this.resetValidationData();
                                }
                            )
                        }
                    }
                )
                
            },
        }
    }
</script>

<style lang="scss" module >

    .forgot {
        margin-left: auto;
        font-size: 13px;
        color: #919496;
    }

</style>