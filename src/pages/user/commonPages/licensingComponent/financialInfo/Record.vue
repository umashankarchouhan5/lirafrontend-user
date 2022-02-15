<template>
    <div>
        <RecordItem v-for="(item, i) in valueUp" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" :readonly="readonly" >
            <FormRow>
                <div class="col-sm-8">
                    <InputText label="Details" :readonly="readonly" :vid="`Details-${i}`" rules="required" v-model="item.B_SourceOfCapital" />
                </div>
                <div class="col-sm-4">
                    <InputAmount label="Amount (SCR)"  :readonly="readonly" :vid="`Amount-${i}`" rules="required"  v-model="item.B_Amount" />
                </div>
            </FormRow>
        </RecordItem> 
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "Record",
        props: {
            readonly: Boolean,
        },
        mixins: [recordMixin],
        data(){
            return{
                valueUp: this.value
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            }, 
            csp_id() {
                return this.$store.state.user.csp_id;
            }
        },
        watch:{
            value(val) {
                if(this.value.length < 1){
                    this.pushEmptyValue();
                }
            }
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "ICSPRequestrecord_id": null,
                    "A_NameUsed": '',
                    "B_Amount": '',
                    "B_SourceOfCapital": '',
                    "RecordType": this.recordType,
                    "icsprequest_id": this.csp_id
                })
                return this.value;
            }, 
        }
    }
</script>
