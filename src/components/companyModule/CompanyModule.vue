<template>
    <FormRow>
        <div class="col-sm-3">
            <InputText label="Reg #" :rules="{required:innerValue.typeCompanyReg == '' && innerValue.typeCompanyName == ''}" :readonly="readonly" v-model="innerValue.typeCompanyReg" />
        </div>
        <div class="col-sm-5">
            <InputText label="Company Name" :rules="{required:innerValue.typeCompanyReg == '' && innerValue.typeCompanyName == ''}" :readonly="readonly" v-model="innerValue.typeCompanyName"/>
        </div>
    </FormRow>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    export default {
        name: 'CompanyModule',
        mixins: [valueMixin],
        props: {
            readonly: {
                type: Boolean,
                default: false
            }
        }
    }
</script>