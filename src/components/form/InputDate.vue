<template>
<div :class="$style.InputBox">
    <DatePicker
            :clearable="true"
            :confirm="true"
            :readonly="readonly"
            :class="$style.date"
            :open="open"
            :type="type"
            :value="innerValue"
            :options="options"
            :start-date="getStartDate"
            transfer
            @on-clickoutside="closeHandler"
            @on-change="handleChange"
            @on-clear="handleClear">
        <InputText icon="date" :readonly="readonly" :vid="vid" :rules="rules" :name="name"  :class="$style.InputText_calendar" :value="inputValue" :label="label" @click="handleClick" @focus="handleClick"  />
        <!-- <InputText icon="date" :readonly="readonly" :vid="vid" :rules="rules" v-else :class="$style.InputText_calendar" :value="dateRangeValue" :label="label" @click="handleClick" @focus="handleClick"  /> -->
    </DatePicker>
</div>
</template>

<script>

    import { locale, DatePicker } from 'view-design';
    import lang from 'view-design/dist/locale/en-US';
    import validationMixin from 'Mixins/validationMixin'
    import DateUtil from 'Utils/dateUtil';
    import moment from 'moment';

    locale(lang);

    export default {
        name: "InputDate",
        mixins: [validationMixin],
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
            value: [String,Array],
            rules: [String, Object],
            vid: String,
            options: Object,
            name: String,
            startDate: { type:[String,Number,Object], default: null}
        },
        data() {
          return {
              open: false,
              inputValue: '',
              dateRangeValue:'',
          }
        },
        computed: {
            getStartDate() {
                if(this.startDate == null ){
                    return new Date();
                }
                else{
                    return new Date(this.startDate)
                }
            }
        },
        created() {
            if(this.type !== 'daterange'){
                this.formatInputValue(this.value);
            }
        },
        watch: {
            value(newValue) {
                this.formatInputValue(newValue);
            },
        },
        methods: {
            formatInputValue(value) {
                if (this.format && value) {
                    if(Array.isArray(value) && this.type == 'daterange'){
                        this.inputValue = this.reduceOneDayExtraDateRange(value).map(item => DateUtil[this.format](item)).join(' - ')
                    }
                    else if (Array.isArray(value)) {
                        this.inputValue = value.map(item => DateUtil[this.format](item)).join(' - ')
                    } else {
                        this.inputValue = DateUtil[this.format](value)
                    }
                }
                else{
                    if(value == null){
                        this.inputValue = ''
                    }
                }
            },
            newFormatInputValue(value) {
                if (this.format && value) {
                    return DateUtil[this.format](value)
                } else  {
                    return  value
                }
            },
            closeHandler() {
                this.open = false;
            },
            handleClick() {
                !this.readonly && (this.open = true);
            },
            handleChange(date) {
                if(Array.isArray(date) && date[0] == '' && date[1] == '' ){
                    date = ''
                }
                this.open = false;
                this.formatInputValue(date);
                if (this.type === "daterange" && date != '') {
                    this.inputValue = date.join(' - ');
                    this.innerValue = this.increaseOneDayExtraDateRange(date);
                    this.$emit('onChange', this.increaseOneDayExtraDateRange(date));
                }
                else{
                    this.inputValue = date;
                    this.innerValue = date;
                    this.formatInputValue(date);
                    this.$emit('onChange', date);
                }
                // this.$emit('onChange', date);
            },
            increaseOneDayExtraDateRange(value) {
                if(value !== ''){
                const formatedDateArray = value.map((item,index) => {
                        if(index !== 1){
                            return item
                        }
                        else{
                            // const d = new Date(item)
                            // var  dd = d.getDate() +1;
                            // var mm = d.getMonth() + 1;
                            // var yy = d.getFullYear();
                            // if(dd<10) 
                            // {
                            //     dd='0'+dd;
                            // } 

                            // if(mm<10) 
                            // {
                            //     mm='0'+mm;
                            // } 
                            // const finalDate = yy+'-'+mm+'-'+dd;
                            // // return DateUtil[this.format](finalDate)
                            // return finalDate;
                            
                            var newDate = moment(item).add(1, 'd').format("YYYY-MM-DD");
                            return newDate;
                        }
                    });
                    return formatedDateArray;
                }
                else{
                    return ''
                }
            },
            reduceOneDayExtraDateRange(value) {
                if(value !== ''){
                const formatedDateArray = value.map((item,index) => {
                        if(index !== 1){
                            return item
                        }
                        else{
                            // const d = new Date(item)
                            // var  dd = d.getDate() - 1;
                            // var mm = d.getMonth() + 1;
                            // var yy = d.getFullYear();
                            // if(dd<10) 
                            // {
                            //     dd='0'+dd;
                            // } 

                            // if(mm<10) 
                            // {
                            //     mm='0'+mm;
                            // } 
                            // const finalDate = yy+'-'+mm+'-'+dd;
                            // return finalDate;
                            
                            var newDate = moment(item).subtract(1, 'd').format("YYYY-MM-DD");
                            return newDate;
                        }
                    });
                    return formatedDateArray;
                }
                else{
                    return ''
                }
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
