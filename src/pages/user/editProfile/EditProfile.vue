<template>
    <FormWrapper>
        <PageTitle title="Edit Profile" slot="title"/>
        <CenterBlock>
            <ValidationObserver ref="validator" tag="div">
                <FormRow>
                    <div class="col-sm-2">
                        <Salutation :disabled="true" v-model="form.Salutation" />
                    </div>
                    <div class="col-sm-5">
                        <InputText type="text" :readonly="true" label="First Name" v-model="form.Fname" />
                    </div>
                    <div class="col-sm-5">
                        <InputText type="text" :readonly="true" label="Last Name" v-model="form.Lname" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-4">
                        <InputText type="email" :readonly="true" label="Email" v-model="form.email" />
                    </div>
                    <div class="col-sm-4">
                        <InputTel v-model="form.Mobile" label="Mobile Number" rules="required" vid="Mobile" />
                    </div>
                    <div class="col-sm-4">
                        <InputText v-model="form.company" rules="required" label="Company Name"  />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <AddressInput :value="form.Address_id" rules="required" label="Address"/>
                    </div>
                    <div class="col-sm-6">
                        <FormSelect v-model="form.ExternalUserCategory_id"
                                    :items="signUpPurposes"
                                    item-value="id"
                                    :disabled="true"
                                    item-name="DisplayName"
                                    label="Select Purpose" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea label="Tell us Briefly About Yourself" v-model="form.BriefProfile" rows="3" maxlength="250" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <FormRow>
                <div class="col-sm-8">
                    <FormButton type="success" @click="submit">Update Profile</FormButton>
                </div>
            </FormRow>
        </CenterBlock>
        <Popup :value="isPopupVisible" title="Success" type="success">
            {{ message }}
            <FormButton slot="footer" @click="closePopup">Ok</FormButton>
        </Popup>
        <br>
    </FormWrapper>
</template>

<script>

    import { ValidationObserver } from 'vee-validate';
    import { fetchSignUpPurposes, fetchUser, updateUser } from './api';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import Salutation from "Components/layout/salutation";
    import InputTel from "Components/form/InputTel";
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name: "ChangePassword",
        data() {
            return {
                form:{
                    Salutation: null,
                    Fname: null,
                    Lname: null,
                    Mobile: null,
                    email: null,
                    company: null,
                    Address_id: null,
                    BriefProfile: null,
                    ExternalUserCategory_id: null
                },
                message: 'Password updated successfully.',
                isPopupVisible: false,
            }
        },
        components: {
            ValidationObserver,
            FormWrapper,
            PageTitle,
            Salutation,
            InputTel,
            AddressInput
        },
        computed:{
            signUpPurposes() {
                return this.$store.state.common.signUpPurposes;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        created() {
            if (this.$store.state.common.signUpPurposes.length === 0) {
                fetchSignUpPurposes().then((response) => {
                    this.$store.commit('setSignUpPurposes', response.data)
                })
            }
            this.fetchUser();
        },
        methods: {
            fetchUser(){
                const data ={
                    user_id: this.userData.user_id
                }
                fetchUser(data).then((response) => {
                    this.form = response.data[0]
                })
            },
            async submit() {
                const result = await this.$refs.validator.validate();
                if (result) {
                    const request = await updateUser( this.form );
                    this.message = request.message;
                    this.isPopupVisible = true
                }
            },
            closePopup() {
                this.resetValues();
                this.isPopupVisible = false;
            },
            resetValues() {
                this.fetchUser();
            },
        }
    }
</script>
<style lang="scss" module>
    .changePasswordText{
        font-weight: 400;
        margin-bottom: 50px;
        font-size: 14px;
        line-height: 20px;
    }
</style>