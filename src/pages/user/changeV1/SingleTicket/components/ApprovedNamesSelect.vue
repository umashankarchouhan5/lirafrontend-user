<template>
    <FormSelect :items="list" rules="required" item-value="id" item-name="CompanyName" label="New Name" v-model="innerValue" :disabled="readonly"  />
</template>

<script>

    import { getApprovedNames } from '../api';
    import valueMixin from 'Mixins/valueMixin'

    export default {
        name: "ApprovedNamesSelect",
        mixins: [valueMixin],
        data() {
            return {
                list: []
            }
        },
        props:{
            entityType: String,
            readonly: Boolean
        },
        computed: {
            icsp_id() {
                return this.$store.state.user.user.icsp_id;
            },
        },
        watch:{
            entityType(){
                this.getNames();
            }
        },
        created() {
            this.getNames();
        },
        methods: {
            getNames() {
                getApprovedNames({
                    EntityType: this.entityType,
                    icsp_id: this.icsp_id
                }).then(res => {
                    this.list = res.data;
                })
            },
        }
    }
</script>
