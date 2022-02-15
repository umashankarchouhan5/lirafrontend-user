<template>
    <div class="row">
        <div class="col-sm-4">
            <FormSelect :disabled="readonly"
                        v-model="company.EntityType"
                        :items="entityTypes"
                        label="Entity Type"
                        item-name="Name"
                        item-value="Name" rules="required" />
        </div>
        <div class="col-sm-4">
            <FormAutoComplete :disabled="readonly"
                              label="Reg #"
                              :value="company.CompanyRegNo"
                              :items="companies"
                              :onChange="onSearchRegNo"
                              :onFocus="onFocus"
                              item-value="CompanyRegNo"
                              item-name="CompanyRegNo"
                              rules="required"
                              :onSelect="onSelectCompanyByRegNo" />
        </div>
        <div class="col-sm-4">
            <FormAutoComplete
                    :disabled="readonly"
                    label="Name"
                    rules="required"
                    v-model="company.Name"
                    :onChange="onSearchName"
                    :onFocus="onFocus"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" />
        </div>
    </div>
</template>

<script>

    import { getCompany, getEntityType } from './api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';

    export default {
        name: "CompanySearch",
        data() {
            return {
                entityTypes: [],
                companies: [],
                company: {
                    EntityType: '',
                    Name: '',
                    CompanyRegNo: '',
                },
                CompanyRegNoQuery: '',
                selectedFromList: false
            }
        },
        components: {
            FormAutoComplete
        },
        watch: {
            processId() {
                this.reset();
                this.getEntityListHandler()
            },
        },
        created() {
            this.getEntityListHandler()
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        props: {
            readonly: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onFocus() {
                this.selectedFromList = false;
            },
            onSearchName(val) {
                if (this.validateQuery(val)) {
                    this.resetCompanies();
                    this.searchForCompany();
                }
            },
            onSearchRegNo(val) {
                if (this.validateQuery(val) && !this.selectedFromList) {
                    this.resetCompany();
                    this.company.CompanyRegNo = val;
                    this.searchForCompany()
                }
            },
            resetCompanies() {
                this.companies = [];
            },
            validateQuery(value) {
                return value.length >= 3
            },
            reset() {
                this.resetCompany();
                this.entityTypes = [];
                this.companies = [];
            },
            resetCompany() {
                this.companies = [];
                this.company = {
                    EntityType: '',
                    Name: '',
                    CompanyRegNo: '',
                };
            },
            getEntityListHandler() {
                getEntityType({
                    process_id: this.processId,
                    icsp_id: this.userData.icsp_id
                }).then(res => {
                    this.entityTypes = res.data;
                })
            },
            onSelectCompanyByRegNo(value) {
                this.company = {
                    EntityType: '',
                    Name: '',
                    CompanyRegNo: '',
                };
                this.company = this.companies.find(item => item.CompanyRegNo === value);
                this.selectedFromList = true;
                this.$emit('onSelectCompany', this.company);
            },
            onSelectCompanyByName(value) {
                this.company = {
                    EntityType: '',
                    Name: '',
                    CompanyRegNo: '',
                };
                this.company = this.companies.find(item => item.Name === value);
                this.selectedFromList = true;
                this.$emit('onSelectCompany', this.company)
            },
            searchForCompany() {
                const { EntityType, Name, CompanyRegNo } = this.company;
                getCompany({
                    EntityType,
                    Name,
                    RegNo: CompanyRegNo,
                    process_id: this.processId
                }).then(res => {
                    this.companies = res.data[0];
                })
            }
        }
    }
</script>
