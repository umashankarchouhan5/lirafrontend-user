<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-3">
                    <InputText v-model="item.A_Qual" rules="required" :vid="`Qualification-${i}`" label="Qualification" :readonly="readonly" />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="item.A_Institute" rules="required" :vid="`QualInstitution-${i}`" label="Institution/Awarding Body" :readonly="readonly" />
                </div>
                <div class="col-sm-2">
                    <YearSelect label="Year Obtained" rules="required" :vid="`QualYear-${i}`" v-model="item.A_qualyear" :readonly="readonly" />
                </div>
                <div class="col-sm-3">
                    <div :class="$style.file">
                        <InputFile label="Upload File (pdf)" @onChange="(file) => uploadFile(file, item)" :disabled="readonly" :vid="`QualUpload-${i}`" :rules="{docCheck:'pdf',checkFileRegex: true}" />
                        <a :class="$style.fileView" v-if="item.DocumentPath" :href="item.DocumentPath" target="_blank">
                            <Icon type="md-eye" />
                            View
                        </a>
                    </div>
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'
    import { uploadDocumentPQ } from '../../config/requests'

    export default {
        name: "AcadQualificationsRecords",
        mixins: [recordMixin],
        props: {
            pqId: Number,
            readonly: Boolean
        },
        watch:{
            value(val) {
                if(this.value.length < 1){
                    this.pushEmptyValue();
                }
            }
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    RecordType: "AQual",
                    A_Qual: "",
                    A_Institute: "",
                    A_qualyear: "",
                    DocumentPath: ''
                })
            },
            uploadFile(file, item) {
                if (file) {
                    const data = new FormData();
                    data.append("image", file);
                    data.append("pq_id", this.pqId);
                    uploadDocumentPQ(data).then(res => {
                        item.DocumentPath = res.url;
                        item.PQRecord_id = res.PQRecord_id
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
        white-space: nowrap;
        flex-grow: 1;
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-right: 5px;
            }
        }
    }
</style>
