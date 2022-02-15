<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">

        <PageTitle :title="$route.params.id ? 'Edit Entity' : 'Entity Creation'" slot="title" />
        <FormRow>
            <!-- <SideLogo></SideLogo> -->
            <div class="col-sm-3"></div>
            <div class="col-sm-9">
                <div :class="$style.register">

                    <FormRow>
                        <div class="col-sm-4">
                            <InputText label="Company Name"
                                v-model="form.Name"
                                vid="Name"
                                :readonly="$route.params.id"
                                rules="required" />
                        </div>
                        <div class="col-sm-4">
                            <InputText label="Registration Number"
                                v-model="form.CompanyRegNo"
                                v-bind:readonly="is_readonly"
                                vid="CompanyRegNo" />

                        </div>
                        <div class="col-sm-4">
                            <InputDate  label="Incorporation Date" :options="options" v-model="form.DateOfIncorporation" v-bind:readonly="is_readonly" />
                        </div>
                    </FormRow>

                    <div :class="$style.button">
                        <ButtonGroup>
                            <FormButton type="success" v-if="!$route.params.id" @click="passes(formSubmit)">Create Entity</FormButton>
                            <FormButton type="success" v-if="$route.params.id" @click="passes(formSubmit)">Save</FormButton>
                            <FormButton type="info"  @click="() => backToList()">Cancel</FormButton>
                        </ButtonGroup>
                    </div>
                    <div :class="$style.clearFix"></div>
                </div>

                
            </div>
        </FormRow>
        <TermsAndCondition v-model="terms"></TermsAndCondition>

        <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
            <div>
                {{ successModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => backToList()">Back to List</FormButton>
            </div>
        </Popup>
        <Popup :value="warningModal.visible" :title="warningModal.title" type="info" @close="() => warningModal.visible = false">
            <div>
                {{ warningModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => warningModal.visible = false">Close</FormButton>
            </div>
        </Popup>
        
    </ValidationObserver>
    
</template>

<script>

    import PageTitle from "Components/layout/PageTitle";
    import {createEntity, getLegalEntitiesList } from "../api";
    import { ValidationObserver } from "vee-validate";
    import InputDate from 'Components/form/InputDate';
    // import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import TermsAndCondition from "Components/modal/TermsAndCondition";

    export default {
        name: "Register",
        data() {
            return {
                companyLogo: '',
                onSubmitError: false,
                form: {
                    id: '',
                    DateOfIncorporation: '',
                    CompanyRegNo: '',
                    Name: '',
                },
                warningModal: {
                    visible: false,
                    title: '',
                    message: ''
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityCreated: false,
                is_readonly : false,
                emailSent: false,
                otp: {
                    isModalVisible: false,
                },
                terms: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user; 
            },
        },
        created() {
            if(this.$route.params.id){
                this.getEntityData();
            }
            
        },
        watch:{
        },
        components: {
            PageTitle,
            ValidationObserver,
            // SideLogo,
            TermsAndCondition,
            InputDate
        },
        methods: {
            getEntityData() {
                getLegalEntitiesList({entity_id: parseInt(this.$route.params.id)}).then(
                    res => {
                        this.form = res.data[0];
                        this.is_readonly = res.data[0].is_readonly;
                    }
                )
            },
            formSubmit() {
                
                if(this.$route.params.id){
                    this.form.entity_id = parseInt(this.$route.params.id);
                }
                createEntity(this.form).then(this.handleResponse)
            },
            handleResponse(response) {
                let data = response;
                // if(+data.code === 201){
                    this.entityCreated = true;
                    // this.emailSent = true;
                    this.msgContent = data.message;
                    this.successModal.message = data.message;
                    this.successModal.visible = true;


                // }
            },
            backToList(){
                this.$router.push('/legalEntities');
            }
        }
    };
</script>

<style lang="scss" module>
    .registerSuccess {
        text-align: center;
        img {
            display: block;
            margin: 40px auto;
        }
        h1 {
            margin-bottom: 20px;
        }
        h4 {
            margin-bottom: 15px;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
    }

    .register {
        padding-top: 30px;
        width: 600px;
        margin: 0 auto 0 0;
        h4 {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 25px;
        }
    }

    .na {
        margin-top: 10px;
        display: block;
    }
    .account {
        padding-top: 12px;
    }
    .agreement {
        margin: -10px 0 30px;
    }
    .terms{
        h3{
            margin: 15px 0px;
        }
        p{
            text-align: justify;
        }
    }
    .showPurposeMessage{
        font-size: 11px;
        margin-top: 10px;
        color: #3c8dbc;
    }
    .clearFix{
        clear: both;
        padding: 30px;
    }
</style>
