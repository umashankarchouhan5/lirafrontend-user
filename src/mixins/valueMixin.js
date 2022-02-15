export default {
    data() {
        return {
            innerValue: null
        };
    },
    created() {
        if (this.value !== undefined) {
            this.innerValue = this.value;
        }
    },
    watch: {
        innerValue(newVal) {
            this.$emit("input", newVal);
        },
        value(newVal) {
            this.innerValue = newVal;
        }
    },
    props: {
        value: [String, Array, Object, Number, null, File]
    }
}





