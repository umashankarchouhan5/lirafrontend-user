<template>
    <div :class="$style.declaration">
        <div :class="$style.declarationCheckbox">
            <FormCheckbox :rules="{required: { allowFalse: false }}" :disabled="readonly" name="Declaration_confirm" v-model="value.isChecked"><span :class="$style.declarationText">{{ value.DisplayText }}</span></FormCheckbox>
        </div>
        <div class="row">
            <div class="col-sm-3">
                <InputDate rules="required" :readonly="true" label="Date" v-model="value.DeclarationDate"  />
            </div>
            <div class="col-sm-3">
                <InputText rules="required" :readonly="readonly" label="Name" v-model="value.Name" />
            </div>
            <div class="col-sm-3">
                <InputText rules="required" :readonly="readonly" label="Place" v-model="value.Place" />
            </div>
        </div>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate'

    export default {
        name: "Declaration",
        components: {
            InputDate
        },
        props: {
            value: {
                type: Object,
            },
            readonly: Boolean
        },
    }
</script>

<style lang="scss" module>
    .declaration {
        margin: 10px 0;
    }
    .declarationCheckbox {
        margin-bottom: 20px;
        text-align: justify;
    }
    .declarationText{
        font-size: 14px;
        color: #555;
    }
</style>
