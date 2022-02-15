<template>
    <FormWrapper>
        <PageTitle title="Monthly Return" slot="title"/>
        <ValidationObserver ref="validator">
            <FormRow >
                <div class="col-sm-6">
                    <FormSelect rules="required"
                        label="License"
                        :items="licenseList"
                        item-name="longName"
                        item-value="license_id"
                        :clearable="false"
                        :disabled="readonly || licenseList.length == 1"
                        v-model="license_id" />
                </div>
                
                <div class="col-sm-6">
                    <InputText rules="required" label="For Company" readonly  v-model="licenseeCompany"  />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <InputText label="Year"  v-model="form.year" :clearable="false" rules="required" readonly />
                </div>
                <div class="col-sm-4">
                    <InputMonth name="Month" label="Month" :readonly="readonly" :clearable="true" v-model="form.month" rules="required"/>
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-6">
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Choose File:</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            <InputFile :rules="{uploadRequired:true,docCheck:'xls,xlsx',checkFileRegex: true}" :value="form.image"  name="QuaeterlyReturn" label="Select File" @onChange="fileXSLSUploadHandler"/>
                            <a target="_blank" :class="$style.exampleFile" :href="sample">Download Sample File</a>
                        </div>
                    </div>
                    
                </div>
            </FormRow>
            <FormButton type="success" @click="uploadData">Submit</FormButton> 
        </ValidationObserver>
        <Popup :value="modals.success.isVisible"
               type="success"
               title="Submitted Successfully"
               :closable="false"
               :mask-closable="false"
               @close="() => modals.success.isVisible = false">
            <div :class="$style.success">
                <template v-if="TicketReference !== null">
                    <p>Your request has been submitted successfully.</p>
                    <p>Your request # for future reference is <strong>{{ TicketReference }}</strong>.</p>
                </template>
            </div>
            <ButtonGroup slot="footer">
                <FormButton @click="backToList">Back to Home</FormButton>
            </ButtonGroup>
        </Popup>
    </FormWrapper>
</template>
<script>
    import loadingMixin from 'Mixins/loadingMixin';
    import { fetchSample, excelReturnUpload, fetchNextExcelReturnDue, fetchICSPLicenseList } from './api';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { ValidationObserver } from "vee-validate";
    import { MONTHLY_INSURANCE, MONTHLY_GAMBLING } from 'Config/processIds';

    export default {
        name: "MonthlyReturn",
        mixins: [loadingMixin],
        components:{
            FormWrapper,
            PageTitle,
            ValidationObserver,
        },
        data(){
            return{
                sample: '',
                fileXSLS: null,
                quaters: [
                    {
                        name: 'First Quarter',
                        val: 1
                    },
                    {
                        name: 'Second Quarter',
                        val: 2
                    },
                    {
                        name: 'Third Quarter',
                        val: 3
                    },
                    {
                        name: 'Fourth Quarter',
                        val: 4
                    },
                ],
                form: {
                    month: null,
                    qtr: null,
                    year: null,
                    image: null,
                    reference_id: 0,

                },
                readonly: false,
                modals: {
                    success: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    }
                },
                TicketReference: null,
                licenseList: [],
                license_id: null,
                licenseeCompany: '',
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user;
            },
            processId() {
                return this.$store.state.common.currentProcessId
            },
        },
        created(){
            
            if( this.$route.name == 'MonthlyReturnInsurance'){
                this.$store.commit('setProcessId', MONTHLY_INSURANCE);
                this.getData();
            }
            else if( this.$route.name == 'MonthlyReturnGambling' ){
                this.$store.commit('setProcessId', MONTHLY_GAMBLING);
                this.getData();
            }
        },
        watch: {
            license_id (val){
                if(val !== null && val !== undefined){
                     this.licenseeCompany = this.licenseList.find( item => {
                        return item.license_id == val;
                    }).CompanyName;
                    fetchNextExcelReturnDue({license_id: val, process_id: this.processId}).then(
                        res => {
                            this.form.year = res.data[0].nextDueYear;
                            this.form.month = res.data[0].nextDueMonth;
                        },
                        err => {
                            this.license_id = null;
                            this.licenseeCompany = '';
                            this.form.year = null;
                            this.form.month = null;
                        }
                    )
                }
            }
        },
        methods:{
            getData(){
                Promise.all([
                    fetchSample({process_id: this.processId}),
                    fetchICSPLicenseList({ICSP_id: this.userData.icsp_id})
                    // fetchNextExcelReturnDue({process_id: this.processId, license_id: this.userData.license_id})
                ]).then(this.handleResponse)
            },
            handleResponse(response){
                this.sample = response[0].data[0].DocumentPath;
                this.licenseList = response[1].data[0];
                if(this.licenseList.length == 1){
                    this.license_id = this.licenseList[0].license_id;
                    this.licenseeCompany = this.licenseList.find( item => {
                        return item.license_id == this.license_id;
                    }).CompanyName;
                    fetchNextExcelReturnDue({process_id: this.processId, license_id: this.license_id}).then(
                        res => {
                            this.form.year = res.data[0].nextDueYear;
                            this.form.month = res.data[0].nextDueMonth;
                        },
                    )
                }

            },
            uploadData(){
                this.$refs.validator.validate().then((result) => {
                    if(result){
                        const formData = new FormData();
                        formData.append('image', this.form.image);
                        formData.append('year', this.form.year);
                        formData.append('month', this.form.month);
                        // formData.append('qtr', this.form.qtr);
                        formData.append('reference_id', this.form.reference_id);
                        formData.append('process_id', this.processId);
                        formData.append('license_id', this.license_id);

                        excelReturnUpload(formData).then(
                            res=> {
                                this.TicketReference = res.data[0].TicketReference;
                                this.modals.success.isVisible = true;
                            }
                        )
                    }
                })
            },
            fileXSLSUploadHandler(file) {
                this.form.image = file;
            },
            backToList(){
                this.$router.push('/dashboard');
            }

        }
    }
</script>
<style lang="scss" module>
    
    .exampleFile {
        display: inline-block;
        margin-top: 15px;
    }

    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }


    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }

</style>
