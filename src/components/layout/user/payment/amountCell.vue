<template>
    <div :class="$style.save">
        {{totalAmount}}
    </div>
</template>

<script>

    export default {
        name: "AmountCell",
        computed: {
            totalAmount() {
                return this.row.InvoiceDetail.Total;
            },
        },
        props: {
            row: Object,
        },
    }
</script>

<style lang="scss" module>
    .save {
        position: relative;
    }
</style>
