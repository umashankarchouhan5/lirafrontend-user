<template>
    <a href="#" @click.prevent="handleClick">{{ row.TicketReference }}</a>
</template>

<script>

    export default {
        name: "TicketReferenceLinkCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        methods: {
            handleClick() {
                const { process_id, reference_id } = this.row;
                this.$store.dispatch('setProcessId', process_id);
                this.$router.push(`/submissions/${reference_id}`)
            }
        }
    }
</script>
