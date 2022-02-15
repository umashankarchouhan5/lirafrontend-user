<template>
<div :class="$style.InputBox">
    <TimePicker
        :readonly="readonly"
        :class="$style.date"
        :value="innerValue"
        :type="type"
        :open="open"
        placeholder="Select Time"
        placement="bottom-start"
        size="large"
        transfer
        :confirm="true"
        :format="newFormat"
        @on-clickoutside="closeHandler"
        @on-change="handleChange"
        @on-clear="handleClear"
        @on-ok="handleOk"
    >
        <InputText icon="ios-clock-outline" :readonly="readonly" :vid="vid" :rules="rules" 
             :class="$style.InputText_calendar" :value="inputValue" :label="label" @click="handleClick" @focus="handleClick"  />
    </TimePicker>
</div>
</template>

<script>

    import { locale, TimePicker } from 'view-design';
    import lang from 'view-design/dist/locale/en-US';
    import validationMixin from 'Mixins/validationMixin'
    import DateUtil from 'Utils/dateUtil';

    locale(lang);

    export default {
        name: "InputTime",
        mixins: [validationMixin],
        data() {
          return {
              open: false,
              inputValue: ''
          }
        },
        created() {
            this.formatInputValue(this.value);
        },
        watch: {
            value(newValue) {
                return this.formatInputValue(newValue);
            }
        },
        components: {
            TimePicker
        },
        props: {
            readonly: Boolean,
            newFormat: {
                type: String,
                default: 'HH:mm'
            },
            format: {
                type: String,
                default: 'formatTime'
            },
            type: {
                type: String,
                default: 'time'
            },
            label: {
                type: String,
                default: ''
            },
            value: String,
            rules: [String, Object],
            vid: String,
            options: Object
        },
        methods: {
            formatInputValue(value) {
                if(value !== undefined){
                    if(value.includes('.')){
                        value = value.split('.')[0]
                    }
                    if((value.match(new RegExp(":", "g")) || []).length  == 2){
                    var newValue = value.split(':',2);
                    newValue = newValue[0] + ':' + newValue[1];
                    value = newValue;
                    }
                    this.inputValue = value;
                }
            },
            closeHandler() {
                this.open = false;
            },
            handleClick() {
                !this.readonly && (this.open = true);
            },
            handleChange(date) {
                this.innerValue = date;
                this.inputValue = date;
                if (this.type === "daterange") {
                    this.inputValue = date.join(' - ')
                }
                this.formatInputValue(date);
                this.$emit('onChange', date);
            },
            handleClear () {
                this.open = false;
            },
            handleOk () {
                this.open = false;
            }
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
