<template>
    <FormRow>
        <div class="col-sm-9">
            <p :class="$style.label">
                <slot />
            </p>
        </div>
        <div class="col-sm-3">
            <div :class="$style.selectors">
                <InputYesNo Yes="Y" No="N" NotApplicable="A" name="Answer" :vid="`Answer-${i}`" :notavailableRequired="i == 11 ? true : false" v-model="value.CheckedYN" :disabled="readonly" rules="required"  />
            </div>
            <div :class="$style.file" v-if="value.CheckedYN === 'Y'">
                
                <InputFile label="Select File (pdf)" :readonly="readonly" v-if="this.value.DocumentPath === null" @onChange="uploadFile" :rules="{required:true,docCheck:'pdf',checkFileRegex: true}" />
                
                <InputText label="Selected File" readonly v-if="this.value.DocumentPath !== null" v-bind:value="value.DocumentPath.split('/').pop()" />
                <a :class="$style.fileView" v-if="this.value.DocumentPath" :href="this.value.DocumentPath" target="_blank">
                    <Icon type="md-eye" />
                    View
                </a>
                
                <img src="../../../../../../assets/images/changes.png" v-if="this.value.DocumentPath" @click="() => {value.DocumentPath = null}" alt="FSA change" title="Change Document">
            </div>
        </div>
    </FormRow>
</template>

<script>

    // import { RadioGroup, Radio } from 'view-design'
    import { uploadDocumentPQ } from '../../config/requests'

    export default {
        name: "CivilDisciplinaryItem",
        props: {
            value: {
                type: Object,
                default() {
                    return { }
                }
            },
            i:{
                type: [Number,String]
            },
            readonly: Boolean,
        },
        components: {
            // RadioGroup,
            // Radio
        },
        methods: {
            uploadFile(file) {
                if(file !== null){
                    const data = new FormData();
                    data.append("image", file);
                    data.append("PQChecklistData_id", this.value.PQChecklistData_id);
                    data.append("pq_id", this.value.pq_id);
                    uploadDocumentPQ(data).then(res => {
                        this.value.DocumentPath = res.url
                    })
                }
            },
        }
    }
</script>

<style lang="scss" module>

    .file {
        display: flex;
        align-items: center;
    }

    .fileView {
        padding: 0 5px;
        margin-left: 5px;
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-right: 5px;
            }
        }
    }

    .label {
        margin-bottom: 0;
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
        }
    }
    .selectors {
        margin-bottom: 20px;
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
            .ivu-radio-group {
                display: flex;
                justify-content: center;
                .ivu-radio-wrapper {
                    margin: 0 10px;
                }
            }
        }
    }
</style>
