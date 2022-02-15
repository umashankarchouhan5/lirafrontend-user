<template>
<div :class="$style.InputBox">
    <DatePicker
            :clearable="clearable"
            :readonly="readonly"
            :class="$style.date"
            :open="open"
            :type="type"
            :value="innerValue"
            :options="options"
            transfer
            @on-clickoutside="closeHandler"
            @on-change="handleChange"
            @on-clear="handleClear">
        <InputText icon="date" :readonly="readonly" :vid="vid" :rules="rules" :name="name" :class="$style.InputText_calendar" :value="inputValue" :label="label" @click="handleClick" @focus="handleClick"  />
        <!-- <InputText icon="date" :readonly="readonly" :vid="vid" :rules="rules" v-else :class="$style.InputText_calendar" :value="dateRangeValue" :label="label" @click="handleClick" @focus="handleClick"  /> -->
    </DatePicker>
</div>
</template>

<script>

    import { locale, DatePicker } from 'view-design';
    import lang from 'view-design/dist/locale/en-US';
    import validationMixin from 'Mixins/validationMixin'
    import DateUtil from 'Utils/dateUtil';

    locale(lang);

    export default {
        name: "InputDateNew",
        mixins: [validationMixin],
        data() {
          return {
              open: false,
              inputValue: '',
              dateRangeValue:'',
          }
        },
        created() {
            if(this.type !== 'daterange'){
                this.formatInputValue(this.value);
            }
        },
        components: {
            DatePicker
        },
        props: {
            readonly: Boolean,
            format: {
                type: String,
                default: 'formatDate'
            },
            type: {
                type: String,
                default: 'date'
            },
            clearable: {
                type: Boolean,
                default: true
            },
            label: {
                type: String,
                default: ''
            },
            value: [String,Array,Date],
            rules: [String, Object],
            vid: String,
            options: Object,
            
            name: String,
        },
        watch: {
            value(newValue) {
                this.formatInputValue(newValue);
            },
        },
        methods: {
            formatInputValue(value) {
                if (this.format && value && this.type !==  'daterange') {
                    this.inputValue = DateUtil[this.format](value)
                }
                else if ( value && this.type ===  'daterange'){
                    this.inputValue = DateUtil.formatDateRange(value)
                }
                else  {
                    this.inputValue = value
                }
            },
            getFormattedDate(value) {
                if (this.format && value && this.type !==  'daterange') {
                    return DateUtil[this.format](value)
                }
                else if ( value && this.type ===  'daterange'){
                    return DateUtil.formatDateRange(value)
                }
                else  {
                    return value
                }
            },
            closeHandler() {
                this.open = false;
            },
            handleClick() {
                !this.readonly && (this.open = true);
            },
            handleChange(date) {
                this.innerValue = this.getFormattedDate(date);
                this.open = false;
                var self = this;
                this.inputValue = this.getFormattedDate(date);
                this.formatInputValue(date);
                this.$emit('onChange', this.inputValue);
            },
            handleClear () {
                this.open = false;
            },
        }
    }
</script>

<style lang="scss" module>
    .date {
        width: 100%;
    }
    .InputText_calendar{
        img{
            cursor: pointer;
            width: 20px !important;
        }
    }
    .InputBox{
        width: 100%;
        box-sizing: border-box;
        word-break: break-all;
        word-wrap: break-word;
    }
</style>
