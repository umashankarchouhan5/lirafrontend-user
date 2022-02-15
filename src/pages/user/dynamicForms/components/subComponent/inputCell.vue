<template> 
    <div >
        <!-- <br /> -->
        <InputText v-if="fieldsData === null" @focusout="onInputChangeHandler" v-model="row[keyVar]" :readonly="readonly" />
        <div v-else>
            
            <div :class="$style.inputStyle" >
                
                <InputText  @focusout="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar" v-model="row[keyVar]" v-if=" checkCondition(keyVar,'serial')"  :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  readonly />

                <InputText  @focusout="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar" v-model="row[keyVar]" v-if=" checkCondition(keyVar,'textbox')"  :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />

                <InputDate   @onChange="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar" type="date" :options="getOptions()"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'date')" :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />

                <InputText  @focusout="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar" type="number"  v-model="row[keyVar]" v-if=" checkCondition(keyVar,'number')" :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />
                
                <InputTel  @focusout="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar"   v-model="row[keyVar]" v-if=" checkCondition(keyVar,'phone')" :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />
                
                <AddressInput  @focusout="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar"   v-model="row[keyVar]" v-if=" checkCondition(keyVar,'address')" :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  :readonly="readonly" />

                
                <InputText  @focusout="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar" v-model="row[keyVar]" v-if=" checkCondition(keyVar,'email')"  :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly,email: true}"  :readonly="readonly" />

                <div :class="$style.selectBox">
                    <FormSelect   :onChange="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar"  v-if=" checkCondition(keyVar,'select')"  v-model="row[keyVar]" :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  :disabled="readonly" :items="getItems(keyVar)" :clearable="false" />
                </div>
                <div :class="$style.selectBox">
                    <FormSelect   :onChange="onInputChangeHandler" :vid="`${keyVar}-${row._index}`" :name="keyVar"  v-if="checkCondition(keyVar,'person_association')"  v-model="row[keyVar]" :rules="{dynamicTableRequired: checkRequired(keyVar) && !readonly}"  :disabled="readonly" :items="pqData" item-name="Name" item-value="Name" :clearable="false" />
                </div>
                
            </div>
        </div>
        
    </div>
</template>

<script>
    

    import InputDate from 'Components/form/InputDateNew';
    import InputTel from 'Components/form/InputTel'
    import AddressInput from 'Components/form/addressInput/AddressInput'
    import { getPQPositionTypeForLicenseApp } from '../APIRequests';

    export default {
        name: "InputCell",
        components: {
            InputDate,
            InputTel,
            AddressInput
        },
        data() {
            return {
                
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                options1: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                pqData: [],
            }
        },
        computed: {
            showAddButton() {
                return this.isLast
            },
            isLast() {
                return this.row._index === this.statsData.length - 1;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
        },
        props: {
            row: Object,
            readonly: Boolean,
            required: [Boolean, Number],
            onInputChange: Function,
            keyVar: String,
            fieldsData: [Object,Array],
            statsData: [Array],
            onAddRow: Function,
            onRemoveRow: Function,
        },
        created(){
            var fields = this.fieldsData ;
            if(fields !== null){
                var field = fields.find( val => {
                    return val.field === this.keyVar;
                })
                if(field.type === "person_association"){
                    this.getPersons();
                }
            }
        },
        methods: {
            
            async getPqAssociation(personType_id){
                await getPQPositionTypeForLicenseApp({process_id: this.processId, reference_id: parseInt(this.$route.params.id), personType_id: personType_id}).then(
                    res => {
                        return res.data
                    }
                )
            },
            getPersons(){
                var fields = this.fieldsData ;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === this.keyVar;
                    })
                    if(field.personType_id){
                        // this.getPqAssociation(field.personType_id).then(
                        //     response => {
                        //         console.log(response)
                        //        this.pqData = response;
                        //     }
                        // );
                        getPQPositionTypeForLicenseApp({process_id: this.processId, reference_id: parseInt(this.$route.params.id),   personType_id: field.personType_id}).then(
                            res => {
                                this.pqData = res.data
                            }
                        )
                        
                    }else{
                        return []
                    }
                }
            },
            getOptions(){
                if(this.fieldsData !== null){
                    if(this.fieldsData[this.row._index].isPast === 1 || this.fieldsData[this.row._index].isPast === true){
                        return this.options;
                    }
                    else if( this.fieldsData[this.row._index].isPast === 0  || this.fieldsData[this.row._index].isPast === false){
                        return this.options1;
                    }
                    else{
                        return {};
                    }
                }
                
            },
            checkRequired(item){
                var fields = this.fieldsData;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item;
                    })
                    return field.required !== undefined && field.required !== null ? field.required : false;
                }
                else{
                    return false;
                }
            },
            getItems(item){
                var fields = this.fieldsData ;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item;
                    })
                    if(field.data){
                        
                        return field.data.split(',');
                    }else{
                        return []
                    }
                }
            },
            checkCondition(item,type){
                var fields = this.fieldsData ;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item;
                    })
                    if(field.type === type){
                        if(field.type === "serial"){
                            this.row[this.keyVar] = this.row._index + 1;
                        }
                        return true
                    }else{
                        return false
                    }
                }else {
                    return false;
                }
                return true;
            },
            onInputChangeHandler(value) {
                this.row[this.keyVar] = value;
                this.onInputChange(value, this.row)
            }
        }
    }
</script>


<style lang="scss" module>
    .inputStyle{
        margin-bottom: 25px;
    }
    .selectBox{
        :global {
            .ivu-select .ivu-select-dropdown {
                position: static !important;
            }
        }

    }

</style>