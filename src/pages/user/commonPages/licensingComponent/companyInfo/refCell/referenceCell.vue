<template>
    <router-link :to="link" target= '_blank'>{{ row.UniqueRef }}</router-link>
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        computed: {
            link() {
                return `/pq-forms/${this.row.PQid}`;
            }
        }
    }
</script>
