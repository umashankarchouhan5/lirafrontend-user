<template>
    <div :class="$style.dateCell">
        <div v-if="row.isSaved || readonly">
            {{ dateFormatted }}
        </div>
        <div v-else>
            <!-- <InputDate format="formatDate" :rules="dateRequired=== 1? 'required': ''"  :options="options" @onChange="onDateChangeHandler" :value="row.DocumentDate" /> -->

            <InputDate format="formatDate" :vid="`Date-${row._index}-${row.type}`" name="Date" :rules="{required: required}"  :options="options()" @onChange="onDateChangeHandler" :value="row.DocumentDate" />
            <div :class="$style.error" v-if="row.errors && row.errors.indexOf('date') !== -1">
                {{ row.errorMessage || 'Please fill the date' }}
            </div>
        </div>
        <br/>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import DateUtil from 'Utils/dateUtil'

    export default {
        name: "DateCell",
        data() {
            return {
                dateRequired: false,
                options1 : {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                
                // options2 : {
                //     disabledDate(date) {
                //         return checkCondition(date)
                //     }
                // }
                
            }
        },
        components: {
            InputDate
        },
        computed: {
            checkCondition(date){
                if(this.row.NotOlderThanDays == null){
                    return date && date.valueOf() > Date.now();
                }
                else{
                    var self = this;
                    var d = new Date();
                    return date && date.valueOf() > d.setDate(d.getDate() - parseInt(self.row.NotOlderThanDays));
                }
            },
            dateFormatted() {
                return this.row.DocumentDate ? DateUtil.formatDate(this.row.DocumentDate) : ''
            }
        },
        props: {
            row: Object,
            readonly: Boolean,
            required: [Boolean, Number],
            onDateChange: Function
        },
        methods: {
            options() {
                if(this.row.NotOlderThanDays == null){
                    
                    const option = {
                        disabledDate(date) {
                            return date && date.valueOf() > Date.now();
                        }
                    }
                    return option
                }
                else{
                    var self = this;
                    var d = new Date();
                    d.setDate(d.getDate() - self.row.NotOlderThanDays);
                    
                    if(self.row.NotOlderThanDays > 0){
                        const option = {
                            disabledDate(date) {
                                return (date && date.valueOf() < new Date(d)) ;
                            }
                        }
                        return option;
                    }
                    else{
                        const option = {
                            disabledDate(date) {
                                return date && date.valueOf() > new Date(d);
                            }
                        }
                        return option;
                    }
                }
            },
            onDateChangeHandler(value) {
                this.onDateChange(value, this.row)
            }
        }
    }
</script>

<style lang="scss" module>
    .dateCell{
        max-width: 140px;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        margin-top: 3px;
        font-weight: 400;
    }
</style>
