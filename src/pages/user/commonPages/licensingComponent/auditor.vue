<template>
    <div>
        <h6>Please provide details of the auditor(s) of the proposed licensee.</h6>
        <br />
        <RecordItem v-for="(item, i) in valueUp" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" :readonly="readonly" :firstNonRemovable="i == 0 ? true : false" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name" :vid="`NameAuditor-${i}`" :readonly="readonly" v-model="item.name" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText type="email" :vid="`EmailAuditor-${i}`" :readonly="readonly" label="Email" rules="required|email" v-model="item.email" />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Phone" :vid="`PhoneAuditor-${i}`" :disabled="readonly" rules="required" v-model="item.phone" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Address" :vid="`AddressAuditor-${i}`" :readonly="readonly" rules="required" v-model="item.address" />
                </div>
            </FormRow>
        </RecordItem> 

    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin1';
    import InputTel from "Components/form/InputTel";

    export default {
        name: "Record",
        mixins: [recordMixin],
        components: {
            InputTel,
        },
        data(){
            return{
                valueUp: this.value
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            }, 
        },
        watch:{
            value(val){
                this.valueUp = val
            },
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    name: '',phone: '',email: '',address: ''
                })
                return this.value;
            }, 
        }
    }
</script>
