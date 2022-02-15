<template>
    <div>
        <FormRow>
            <div class="col-sm-6">
                
                <ValidationObserver ref="validator">
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Choose File:</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            <InputFile :value="bulkUploadFiles.fileXSLS" name="nameReservationBulkExcel" @onChange="fileXSLSUploadHandler" :rules="{required: true,docCheck: 'xlsx,xls',checkFileRegex: true}" />
                            <a target="_blank" :class="$style.exampleFile" :href="sample">Download Sample File</a>
                        </div>
                    </div>
                </ValidationObserver>
                <div v-if="!bulkUploadFiles.isPristine">
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Total Records</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            {{ bulkUploadFiles.total }}
                        </div>
                    </div>
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Success</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            {{ bulkUploadFiles.success }}
                        </div>
                    </div>
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Failed</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            {{ bulkUploadFiles.fail }}
                        </div>
                    </div>
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Response File</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            <a target="_blank" :href="bulkUploadFiles.responseFileLink">Download</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6" :class="$style.buttonpad">
                <img src="../../../../../../assets/images/save.png" @click="bulkUpload" alt="FSA Save" title="Upload Document">
            </div>
            <p>Click to save</p>
            <div v-if="customErrors.rodNotSaved" :class="$style.error">Please save this file before proceeding.</div>
        </FormRow>
    </div>
</template>
<script>
    import valueMixin from 'Mixins/valueMixin';
    import { importexportROD, fetchRodSample } from '../api';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "RequestROD",
        mixins: [valueMixin],
        components:{
            ValidationObserver
        },
        data(){
            return{
                isSelected: false,
                bulkUploadFiles: {
                    files: [],
                    fileXSLS: null,
                    isLoading: false,
                    total: 0,
                    success: 0,
                    fail: 0,
                    responseFileLink: '',
                    isPristine: true,
                    progress: 0 ,
                    wereFilesUploaded: false,
                },
                sample: '',
            }
        },
        props: {
            readonly: Boolean,
            customErrors: [Array,Object],
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
        created(){
            this.getSample();
        },
        watch: {
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
            },
        },
        methods:{
            getSample() {
                fetchRodSample().then(res =>{
                    this.sample = res.data;
                })
            },
            fileXSLSUploadHandler(file) {
                this.bulkUploadFiles.fileXSLS = file;
            },

            bulkUpload() {
                this.$refs.validator.validate().then((result) => {
                    if(result){
                        const formData = new FormData();
                        formData.append('excelfile', this.bulkUploadFiles.fileXSLS);
                        // formData.append('company_id', this.company.id)
                        this.bulkUploadFiles.isLoading = true;

                        const onUploadProgress = (progressEvent) =>  {
                            this.bulkUploadFiles.progress = Math.round((progressEvent.loaded * 100)/progressEvent.total);
                        };
                        const data = {
                            excelfile: formData,
                        }
                        importexportROD(formData, { onUploadProgress }).then(res => {
                            this.bulkUploadFiles.isLoading = false;
                            this.bulkUploadFiles.isPristine = false;
                            this.bulkUploadFiles.fail = res.data.fail;
                            this.bulkUploadFiles.success = res.data.success;
                            this.bulkUploadFiles.total = res.data.total;
                            this.bulkUploadFiles.responseFileLink = res.filepath;
                            this.bulkUploadFiles.wereFilesUploaded = true;
                            if(res.data.fail === 0){
                                this.innerValue.reference_id = res.data.reference_id;
                            }else{
                                this.innerValue.reference_id = 0;
                            }
                            if(res.feedata){
                                const reference_id = res.data.reference_id;
                                this.$router.push(`/registerOfDirector/RODFee/${reference_id}`);
                            }
                        }).catch(() => {
                            this.bulkUploadFiles.isLoading = false;
                        });
                    }
                })
            },
        }
    }
</script>
<style lang="scss" module>
    .buttonpad{
        cursor: pointer;
        padding-top: 13px;
    }
    .exampleFile {
        display: inline-block;
        margin-top: 20px;
    }

    .bulkFile {
        display: flex;
        border-bottom: 1px solid darken(rgb(241, 241, 241), 10%);
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
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

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
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

    .files {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
