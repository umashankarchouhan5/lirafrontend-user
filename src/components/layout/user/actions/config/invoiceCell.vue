<template>
    <a href="#" @click.prevent="handleClick">{{ row.invoice_id }}</a>
</template>

<script>

    export default {
        name: "invoiceCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        methods: {
            handleClick() {
                const {  invoice_id } = this.row;
                // this.$store.dispatch('setProcessId', process_id);
                this.$router.push(`/invoice/${invoice_id}`)
            }
        }
    }
</script>
