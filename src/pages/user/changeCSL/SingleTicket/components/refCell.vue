<template>
    <a @click="link" target= '_blank'>{{ `${row.Salutation} ${row.Fname } ${row.Lname}` }}</a>
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            },
            openPop: Function,
        },
        methods: {
            link() {
                this.openPop(this.row.id)
            }
        }
    }
</script>
