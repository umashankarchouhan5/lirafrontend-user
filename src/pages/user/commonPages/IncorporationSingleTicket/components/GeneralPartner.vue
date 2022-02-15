<template>
    <div>
        <h6>Designated General Partner(s)</h6>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Name" rules="required" :readonly="readonly" v-model="item.Name" />
                </div>
                <div class="col-sm-6">
                    <InputText label="Address" rules="required" max="200" :readonly="readonly" v-model="item.ResidenceAddress" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    // import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "GeneralPartnerRecords",
        mixins: [recordMixin1,],
        data() {
            return {
                records:[
                    {
                        Name: '',
                        ResidenceAddress: ''
                    }
                ]
            }
        },
        props:{
            readonly: Boolean,
            // value: Array
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    if(this.value.length < 1){
                        this.pushEmptyValue();
                    }
                }
            },
        },
        methods: {
           
            pushEmptyValue() {
                this.value.push({
                    Name: '',
                    ResidenceAddress: ''
                })
            },
        }
    }
</script>
