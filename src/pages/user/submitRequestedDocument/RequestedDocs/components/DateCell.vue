<template>
    <div :class="$style.dateCell">
        <div v-if="row.isSaved || readonly">
            {{ dateFormatted }}
        </div>
        <div v-else>

            <InputDate 
                format="formatDate" 
                :vid="`Date-${row._index}-${row.registeredDocument_id}`" 
                name="Date" 
                rules="required"  
                :options="options"
                @onChange="onDateChangeHandler" 
                :value="row.registrationDate" 
            />
            <div :class="$style.error" v-if="row.errors && row.errors.indexOf('date') !== -1">
                {{ row.errorMessage || 'Please fill the date' }}
            </div>
            
            <br/>
        </div>
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
                options : {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                
            }
        },
        components: {
            InputDate
        },
        computed: {
            dateFormatted() {
                return this.row.registrationDate && this.row.registrationDate != null ? DateUtil.formatDate(this.row.registrationDate) : ''
            }
        },
        props: {
            row: Object,
            readonly: Boolean,
            onDateChange: Function
        },
        methods: {
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
