<template>
    <FormWrapper>
        <PageTitle title="Apply for New License" slot="title" />

        <ValidationObserver ref="validator" >
            <FormRow >
                <div class="col-sm-3">
                    <FormSelect v-model="form.regPurpose_id"
                        :items="filteredPurposes"
                        item-value="id"
                        item-name="DisplayName"
                        label="Select Purpose"
                        rules="required"
                        :clearable="false"
                    />
                </div>
                <div class="col-sm-6" v-if="form.regPurpose_id !== null && externalCategories.length > 0">
                    <FormSelect v-model="form.externalUserCategory_id"
                        :items="externalCategories"
                        item-value="menu_id"
                        item-name="name"
                        label="Please Choose"
                        rules="required" />
                </div>
            </FormRow>

            <ButtonGroup>
                <FormButton type="success" @click="proceed"  left-icon="md-checkmark-circle-outline">Proceed</FormButton>
            </ButtonGroup>
        </ValidationObserver>
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { fetchSignUpPurposes, fetchUrlsByRegPurpose } from './api';
    import loadingMixin from 'Mixins/loadingMixin';
    import { ValidationObserver } from "vee-validate";

    export default {
        name:"ApplyNewLicense",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver
        },
        data() {
            return {
                form: {
                    regPurpose_id: null,
                    externalUserCategory_id: null,
                },
                signUpPurposes: [],
                externalCategories: []
            }
        },
        computed: {
            filteredPurposes() {
                return this.signUpPurposes.filter( item => item.id !== 163 )
            },
        },
        watch:{
            'form.regPurpose_id': function(val){
                if(val !== null && val !== undefined){
                    this.externalCategories = [];
                    this.form.externalUserCategory_id = null;
                    this.fetchExternal();
                }
                else{
                    this.form.externalUserCategory_id = null;
                }
            },
        },
        created() {
            fetchSignUpPurposes().then((res) => {
                this.signUpPurposes = res.data;
            })
        },
        methods: {
            
            fetchExternal(){
                this.showLoader();
                fetchUrlsByRegPurpose({regPurpose_id: this.form.regPurpose_id}).then(
                    res => {
                        this.externalCategories = res.data;
                        this.hideLoader();
                    }
                )
            },
            proceed() {
                this.$refs.validator.validate().then((result) => {
                    if(result){
                        const licenseTypeSelected = this.externalCategories.filter( item => {
                            return this.form.externalUserCategory_id == item.menu_id;
                        })

                        if(licenseTypeSelected.length > 0 && licenseTypeSelected[0].url !== ''){
                            this.$router.push(licenseTypeSelected[0].url);
                        }
                    }
                })
            }
        }
        
    }
</script>