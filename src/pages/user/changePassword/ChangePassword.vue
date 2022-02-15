<template>
    <FormWrapper>
        <PageTitle title="Change Password" slot="title" @close="closePopup"/>
        <CenterBlock>
            <ValidationObserver ref="validator" tag="div" >
                <FormRow>
                    <div class="col-sm-12">
                        <div :class="$style.listDiv">
                            <p>Please enter and confirm the password you would like to use. Your password should meet the following criteria:</p>
                            <ul>
                                <li>It must be between 8 to 16 characters</li>
                                <li>It must contain one of the following types of characters:
                                    <ol>
                                        <li>Uppercase letter</li>
                                        <li>Numeral</li>
                                        <li>Non-alphanumeric characters ( $ % & ' * + , - . / ! # : [ ( &gt; = &lt; ) ] ; ? @ ^ _ ` { | } ~ )</li>
                                    </ol>
                                </li>
                                <li>It cannot have spaces</li>
                            </ul>
                        </div>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6 " >
                        <InputText type="password" label="Current Password" rules="required"  v-model="old_password" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6 ">
                        <InputText type="password" label="New Password" 
                        :rules="{ required: true, regex: /^(?!.*[\s])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).+$/ ,min: 8, max: 16}" v-model="new_password" vid="new_password" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText type="password" label="Confirm New Password" rules="required|confirmed:new_password" v-model="new_password_confirm" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <FormRow>
                <div class="col-sm-6">
                    <FormButton type="success" @click="submit">Change Password</FormButton>
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
    
    // import { Validator, install as VeeValidate } from 'vee-validate/dist/vee-validate';
    import { ValidationObserver,ValidationProvider } from 'vee-validate';
    import { changePassword } from './api';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';

    export default {
        name: "ChangePassword",
        data() {
            return {
                old_password: '',
                new_password: '',
                new_password_confirm: '',
                message: 'Password updated successfully.',
                isPopupVisible: false,
            }
        },
        components: {
            ValidationObserver,
            // ValidationProvider,
            FormWrapper,
            PageTitle
        },
        methods: {
            resetValues() {
                this.old_password = '';
                this.new_password = '';
                this.new_password_confirm = ''
                this.message = '';
            },
            closePopup() {
                this.resetValues();
                this.isPopupVisible = false;
                setTimeout(() => {
                    this.$router.push('/tasks')
                },300);
            },
            async submit() {
                const result = await this.$refs.validator.validate();
                if (result) {
                    const request = await changePassword({
                        old_password: this.old_password,
                        new_password: this.new_password
                    });
                    this.message = request.message;
                    this.isPopupVisible = true
                }
            }
        }
    }
</script>
<style lang="scss" module>
    .changePasswordText{
        text-align: justify;
        font-weight: 400;
        margin-bottom: 50px;
        font-size: 14px;
        line-height: 20px;
    }
    .listDiv {
        ul {
            margin-left: 20px;
        }
        ol {
            list-style: inside;
            list-style-type: circle;
        }
    }
</style>