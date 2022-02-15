<template>
    <div>
        <FormRow>
            <div class="col-sm-3" v-if="innerValue.process_id">
                <FormSelect :disabled="readonly"
                    v-model="innerValue.entityType"
                    :items="entityTypes"
                    label="Entity Type"
                    item-name="longName"
                    item-value="Name"
                    rules="required" />
            </div>
        </FormRow>
        <div v-if="innerValue.process_id ">
            <CompanyModule v-model="innerValue" :readonly="readonly" />
        </div>
        <div>
            <div :class="$style.checkbox">
                <FormCheckbox :disabled="readonly" name="Declaration_confirm" v-model="value.isChecked">
                    <span :class="$style.checkboxText">Please mail me the certificate</span>
                </FormCheckbox>
            </div>
        </div>
        <FormRow v-if="value.isChecked">
            <div class="col-sm-7">
                <AddressInput label="Mailing Address" rules="required" v-model="value.MailingAddress_id"/>
            </div>
        </FormRow>
    </div>
</template>
<script>
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import valueMixin from 'Mixins/valueMixin';
    import CompanyModule from 'Components/companyModule/CompanyModule';
    import { getEntityType } from '../api';
    import { CERTIFICATE_OF_GOODSTANDING_PROCESS_ID } from 'Config/processIds';

    export default {
        name: 'RequestCertificate',
        mixins: [valueMixin],
        components:{
            AddressInput,
            CompanyModule
        },
        data(){
            return{
                entityTypes: [],
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false
            }
        },
        created(){
            this.getEntityListHandler();

        },
        props: {
            mode: String,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch: {
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                // this.getEntityListHandler();
            },
            'innerValue.entityType': function(val){
                this.$store.commit('setChangeEntityType',val);
            },
        },
        methods:{
            getEntityListHandler() {
                getEntityType(
                    {
                    process_id: CERTIFICATE_OF_GOODSTANDING_PROCESS_ID,
                }
                ).then(res => {
                    this.entityTypes = res.data;
                    if (this.entityTypes.length === 1) {
                        this.innerValue.entityType = this.entityTypes[0].Name
                    }
                })
            },
        }
        
    }
</script>

<style lang="scss" module>
    
    .checkbox {
        margin-bottom: 10px;
    }
    
    .checkboxText{
        text-align: justify;
        font-size: 14px;
        color: #555;
    }
</style>