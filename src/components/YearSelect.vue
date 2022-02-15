<template>
    <FormSelect :disabled="readonly" :items="items"  :label="label" :clearable="clearable" v-model="innerValue" />
</template>

<script>

    export default {
        data() {
            return {
                innerValue: null,
                items: [],
            };
        },
        created() {
            // if (this.value) {
                setTimeout(() => {
                    this.innerValue = this.value;
                    this.items = this.items1;
                    // this.$emit("input", this.innerValue);

                },500)
            // }
        },
        watch: {
            innerValue(newVal) {
                this.$emit("input", newVal);
            },
            value(newVal) {
                this.innerValue = newVal;
            }
        },
        name: "YearSelect",
        computed: {
            items1() {
                const items = [];
                for (let i = this.maxValue; i >= this.minValue; i--) {
                    items.push(i);
                }
                return items;
            }
        },
        props: {
            value: [Number, String],
            minValue: {
                type: Number,
                default: 1960
            },
            label: String,
            readonly: Boolean,
            clearable: {
                type: Boolean,
                default: false, 
            },
            maxValue: {
                type: Number,
                default: () => {
                    return new Date().getFullYear();
                }
            }
        }
    }
</script>
