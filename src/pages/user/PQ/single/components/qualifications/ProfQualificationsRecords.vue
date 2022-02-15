<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-2">
                    <InputText  :rules="{required: notRequired ? false : true}" :vid="`ProfMembership-${i}`" label="Membership No." :readonly="readonly" v-model="item.B_MembershipNumber" />
                </div>
                <div class="col-sm-3">
                    <InputText  :rules="{required: notRequired ? false : true}" :vid="`ProfQualification-${i}`" label="Professional Qualification" :readonly="readonly" v-model="item.B_MembershipQual" />
                </div>
                <div class="col-sm-2">
                    <FormSelect
                            v-model="item.B_MembershipQualType"
                            :items="qualificationTypes"
                            item-value="id"
                            item-name="DisplayName"
                            :disabled="readonly"
                            :rules="{required: notRequired ? false : true}"
                            :vid="`ProfType-${i}`"
                            label="Qualification Type" />
                </div>
                <div class="col-sm-2">
                    <YearSelect label="Year Obtained" :vid="`ProfYear-${i}`" :rules="{required: notRequired ? false : true}" :readonly="readonly" v-model="item.B_Membershipyear" />
                </div>
                <div class="col-sm-3">
                    <div :class="$style.file">
                        <InputFile label="Upload File (pdf)"  @onChange="(file) => uploadFile(file, item)" :vid="`ProfUpload-${i}`" :rules="{docCheck:'pdf',checkFileRegex: true}" :disabled="readonly"/>
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
        name: "ProfQualificationsRecords",
        mixins: [recordMixin],
        computed: {
            qualificationTypes() {
                return this.$store.state.common.qualificationTypes;
            }
        },
        props:{
            readonly: Boolean,
            notRequired: {
                type: Boolean,
                default: false,
            }
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
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "PQual",
                    "B_MembershipNumber": "",
                    "B_MembershipQual": "",
                    "B_MembershipQualType": '',
                    "B_Membershipyear": "",
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
