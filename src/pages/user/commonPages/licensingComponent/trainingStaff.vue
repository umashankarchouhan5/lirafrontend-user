<template>
    <div>
        <h6>Please provide details of the Training Officer.</h6>
        <br />
        <!-- <RecordItem v-for="(item, i) in valueUp" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" :readonly="readonly" > -->
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name" :vid="`NameStaff`" :readonly="readonly" v-model="valueUp[0].name" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputText type="email" :vid="`EmailStaff`" :readonly="readonly" label="Email" rules="required|email" v-model="valueUp[0].email" />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Telephone" :vid="`PhoneStaff`" :disabled="readonly" rules="required" v-model="valueUp[0].phone" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputTel label="Fax" :vid="`FaxStaff`" :disabled="readonly" v-model="valueUp[0].fax" />
                </div>
                <div class="col-sm-6">
                    <InputText label="Address" :vid="`AddressStaff`" :readonly="readonly" rules="required" v-model="valueUp[0].address" />
                </div>
            </FormRow>
        <!-- </RecordItem>  -->

    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin1';
    import InputTel from "Components/form/InputTel";

    export default {
        name: "TrainingRecord",
        mixins: [recordMixin],
        props: {
            readonly: Boolean
        },
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
                    name: '',phone: '',email: '',address: '',fax
                })
                return this.value;
            }, 
        }
    }
</script>
