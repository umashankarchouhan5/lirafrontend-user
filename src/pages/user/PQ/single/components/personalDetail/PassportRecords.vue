<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :firstNonRemovable=" i === 0 ? true : false " :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow>
                <div class="col-sm-3">
                    <FormSelect
                            :items="countries"
                            item-name="Name"
                            item-value="id"
                            label="Nationality"
                            rules="required"
                            :disabled="readonly"
                            v-model="item.P_NationalityCountry_id" />
                </div>
                <div class="col-sm-3">
                    <InputText label="Passport Number" :readonly="readonly || i === 0" rules="required|alphaNumCustom" v-model="item.P_PassportNo" />
                </div>
                <div class="col-sm-3">
                    <InputDate label="Passport Expiry Date" :readonly="readonly" :start-date="Date.now() + 91*24*60*60*1000" rules="required" :options="options" v-model="item.P_PassportExpiryDate" />
                </div>
                <div class="col-sm-3">
                    <div :class="$style.file">
                        <InputFile label="Upload File (pdf)" :disabled="readonly" @onChange="(file) => uploadFile(file, item)" :rules="{docCheck:'pdf',checkFileRegex: true}" />
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

    import recordMixin from 'Mixins/recordMixin';
    import InputDate from 'Components/form/InputDate';
    import { uploadDocumentPQ } from '../../config/requests'


    export default {
        name: "PassportRecords",
        mixins: [recordMixin],
        data() {
            return {
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now() + 90*24*60*60*1000;
                    }
                },
            }
        },
        props:{
            readonly: Boolean
        },
        components: {
            InputDate
        },
        computed: {
            countries() {
                return this.$store.state.common.countries;
            },
            identificationTypes() {
                return this.$store.state.common.identificationTypes;
            }
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    P_NationalityCountry_id: null,
                    P_PassportNo: null,
                    P_PassportExpiryDate: null,
                    RecordType: "Psprt"
                })
            },
            uploadFile(file, item) {
                if (file) {
                    const data = new FormData();
                    data.append("image", file);
                    data.append("pq_id", this.pqId);
                    data.append("PQRecord_id",item.PQRecord_id)
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
