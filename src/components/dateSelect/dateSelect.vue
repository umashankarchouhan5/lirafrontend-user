<template>
    <div :class="$style.block">
        <label v-if="label" :class="$style.label">
            {{ label }}<span v-if="isRequired" :class="$style.required">*</span>
        </label>
        <FormSelect placeholder="Day" :items="days" v-model="value.day" :onChange="onDayChange" :width="60" />
        <FormSelect placeholder="Month" :items="months" v-model="value.month" item-value="id" item-name="label" :onChange="onMonthChange" :width="120" />
        <FormSelect placeholder="Year" :items="years" v-model="value.year" :onChange="onYearChange" :width="80" />
        <div :class="$style.error" v-if="errors.indexOf('dob') !== -1">
            Provide correct Date of Birth
        </div>
    </div>
</template>

<script>

    import moment from 'moment';
    import dateUtil from 'Utils/dateUtil'

    export default {
        name: "dateSelect",
        data() {
            return {
                error: '',
                years: [],
                months: [],
                value: {
                    day: '',
                    month: '',
                    year: ''
                }
            }
        },
        computed: {
            days() {
                const month = this.value.month ? +this.value.month : moment().month() + 1;
                const year = this.value.year ? +this.value.year : (moment().year() - 18);
                const max = dateUtil.daysInMonth(month, year);
                const days = [];
                for (let i = 1; i <= max; i++) {
                    const value = i < 10 ? `0${i}` : `${i}`;
                    days.push(`${value}`);
                }
                return days;
            }
        },
        created() {
            this.fillYears();
            this.fillMonth()
        },
        props: {
            isRequired: Boolean,
            label: {
                type: String,
                default: ""
            },
            readonly: {
                type: Boolean,
                default: false
            },
            errors: Array
        },
        methods: {
            onDayChange(value) {
                this.value.day = value;
                this.onChange();
            },
            onMonthChange(value) {
                this.value.month = value;
                if (this.value.day && this.days.indexOf(this.value.day) === -1) {
                    this.value.day = '';
                }
                this.onChange();
            },
            onYearChange(value) {
                this.value.year = value;
                this.onChange();
            },
            fillMonth() {
                this.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ].map((item, i) => {
                    return {
                        id: (i + 1) < 10 ? `0${i + 1}` : `${i + 1}`,
                        label: item
                    }
                })
            },
            fillYears() {
                const currentYear = moment().year();
                const min = currentYear - 99;
                const max = currentYear - 18;
                for (let i = max; i >= min; i--) {
                    this.years.push(i);
                }
            },
            onChange() {
                const { day, month, year } = this.value;
                if (day && month && year) {
                    const date = `${year}-${month}-${day}`;
                    this.$emit('onSelect', date)
                }
            }
        }
    }
</script>

<style lang="scss" module>
    .block {
        display: flex;
        position: relative;
        > * {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }

    .label {
        color: #555;
        transform-origin: 0 100%;
        position: absolute;
        pointer-events: none;
        white-space: nowrap;
        top: 0;
        left: 0;
        font-size: 13px;
        line-height: 19px;
        font-weight: 400;
        transition: transform 0.2s ease-out, color 0.2s ease-out;
        transform: translateY(-11px) scale(0.8);
        z-index: 1;
    }

    .error {
        color: #ff3547;
        position: absolute;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% + 2px);
        font-weight: 400;
    }


</style>
