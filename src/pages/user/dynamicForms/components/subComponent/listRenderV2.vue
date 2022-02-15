<template>
    <FormRow>
        <div class="col-sm-9" v-if="value.FieldType.toLowerCase() === 'yesno'">
            <p :class="$style.label">
                <slot />
            </p>
        </div>
        <div class="col-sm-3" v-if="value.AnswerYN === 1 || value.FieldType.toLowerCase() === 'yesno'">
            <div :class="$style.selectors" >
                <FormYesNo v-model="value.ValueTextArea" name="Yes/No" :disabled="readonly || disabled" :rules="{required: value.isMandatory === 1 && disabled ? false: true}" ></FormYesNo>

            </div>
        </div>

        <div v-if="value.AnswerTextbox === 1 && (value.TextBoxonYN === value.ValueTextArea || value.TextBoxonYN === 'B') && value.AnswerYN === 1" class="col-sm-12">
            <InputTextArea v-model="value.Notes" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        <div v-if="value.AnswerTextbox === 1 && value.AnswerYN=== 0 " class="col-sm-12">
            <InputTextArea v-model="value.Notes" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        <div v-if="value.TextBoxonYN !== null && value.TextBoxonYN === value.ValueTextArea " class="col-sm-12">
            <InputTextArea v-model="value.Notes" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        

        

        <FormRow v-if=" value.FieldType.toLowerCase() === 'table'">
            <div  class="col-sm-12">
                <p v-if="value.Label !== null && value.Label !== ''">{{value.Label}}</p>
                <DataTable :class="$style.documents"  no-data-text="No Data Available" :columns="modifiedColumns" :readonly="readonly || disabled" :data="tableData" />
                
            </div>
        </FormRow>

        <div v-if=" value.FieldType.toLowerCase() !== 'table' ">
            
            <div :class="$style.rowPadding" class="row"  v-if="value.FieldType.toLowerCase() === 'textbox'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div>
                        <InputText :name="value.Label"  v-model="value.ValueTextArea" :readonly="readonly  || disabled"   :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" />
                    </div>
                </div>
            </div>

            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'date'" >
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div  >
                        <p><b  v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    <InputDate type="date" :name="value.Label" v-model="value.ValueDate" :options="getOptions()" :readonly="readonly  || disabled"  :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}"  />
                </div>
            </div>

            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'number'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div  >
                        <p><b  v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    
                    <InputText type="number" :name="value.Label" v-model="value.ValueInt" :readonly="readonly  || disabled"  :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}"   />
                </div>
            </div>

            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'dropdown'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    
                    <FormSelect :name="value.Label" v-model="value.ValueTextArea" 
                        :disabled="readonly || disabled" :items="getItems()" :clearable="false" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" />
                </div>
            </div>
            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'address'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    
                    <AddressInput :name="value.Label" v-model="value.ValueInt" :readonly="readonly  || disabled"   :clearable="false" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" />
                </div>
            </div>
            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'country'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div  >
                        <p><b v-if="value.FieldNumber !== null" >{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    
                    <FormSelect
                        :items="countries"
                        item-name="Name"
                        item-value="id"
                        :name="value.Label"
                        :disabled="readonly || disabled"
                        v-model="value.ValueInt"   
                        :clearable="false" 
                        :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}"
                    />
                </div>
            </div>

            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'radiobutton'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    
                    <RadioGroup v-model="value.ValueTextArea" :disabled="readonly || disabled">
                        <Radio v-for="(rad,ind) in getRadios" :key="ind" :label="rad" :disabled="readonly || disabled" rules="required">
                            {{rad}}
                        </Radio>
                    </RadioGroup>
                </div>
            </div>

            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'textarea'">
                <div :class="$style.inputsStyle" class="col-sm-12">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-12" >
                    
                    <InputTextArea v-model="value.ValueTextArea" rows="5" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" :readonly="readonly || disabled" :name="value.Label" />
                </div>
            </div>

            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'phone'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    
                    <InputTel v-model="value.ValueTextArea" rows="5" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" :readonly="readonly || disabled" :name="value.Label" />
                </div>
            </div>

            <div :class="$style.rowPadding" class="row" v-if="value.FieldType.toLowerCase() === 'email'">
                <div :class="$style.inputsStyle" class="col-sm-6">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-6" >
                    
                    <InputText v-model="value.ValueTextArea" rows="5" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false,email: true}" :readonly="readonly || disabled" :name="value.Label + value.Field_id" />
                </div>
            </div>

        </div> 

        <div v-if="value.AllowDocumentUpload === 1 || value.DocumentWhenAnswerYN !== null" class="col-sm-12">
            <div :class="$style.file" v-if="value.AllowDocumentUpload === 1 || value.DocumentWhenAnswerYN  === value.ValueTextArea">
                <InputFile label="Select File (pdf)" :readonly="readonly || disabled" :disabled="readonly || disabled" v-if="this.value.DocumentPath === null" @onChange="uploadFile" :rules="{required:disabled ? false: true,docCheck:'pdf',checkFileRegex: true}" />
                
                <InputText label="Selected File" readonly v-if="this.value.DocumentPath !== null" v-bind:value="value.DocumentPath.split('/').pop()" />
                <a :class="$style.fileView" v-if="this.value.DocumentPath" :href="this.value.DocumentPath" target="_blank">
                    <Icon type="md-eye" />
                    View
                </a>
                <img src="../../../../../assets/images/changes.png" v-if="this.value.DocumentPath" @click="() => {value.DocumentPath = null}" alt="FSA change" title="Change Document">
            </div>
        </div>

    </FormRow>
</template>

<script>

    // import { RadioGroup, Radio } from 'view-design'
    import FormYesNo from 'Components/form/FormYesNo'

    import { uploadDoc } from '../APIRequests';
    import DataTable from 'Components/DataTable';
    import InputCell from './inputCell';
    import ActionCell from './actionCell';
    import InputDate from 'Components/form/InputDateNew'
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import { FUND_LICENSE } from 'Config/processIds';
    import InputTel from 'Components/form/InputTel';
    

    export default {
        name: "ListItem",
        data(){
            return {
                refinedData: [],
                tableData: [],
                itemBox:[],
                rowStructure: {},
                
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
            }
        },
        props: {
            value: {
                type: Object,
                default() {
                    return { }
                }
            },
            i:{
                type: [Number,String]
            },
            readonly: Boolean,
            disabled:{
                type: Boolean,
                default: false,
            },
            process_id: [Number,String]
        },
        components: {
            // RadioGroup,
            // Radio,
            FormYesNo,
            DataTable,
            InputTel,
            InputDate,
            AddressInput
        },
        watch:{
            tableData:{
                deep: true,
                handler(val){
                    this.value.Stats = val;
                }
            }
        },
        computed:{
            
            countries() {
                return this.$store.state.common.countries;
            },
            modifiedFields(){
                if(this.value.TableJsonFormat !== null){
                    var columns = this.value.TableJsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    var tableColumn = [];
                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            const col = {
                                'key': key,
                                'value': columns[0][key]
                            }
                            tableColumn.push(col)
                        }
                    }
                    
                }
                return  tableColumn;
            },
            modifiedColumns(){
                if(this.value.TableJsonFormat !== null){
                    var columns = this.value.TableJsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    var headings = JSON.parse(this.value.TableJsonWithHeading);
                    var tableColumn = [];
                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            
                            const col = {
                                'title': columns[0][key] !== '' && columns[0][key] !== ' ' && columns[0][key] !== 0 ? columns[0][key] : headings[0][key],
                                'key': key,
                                render: (h, params) => {
                                    return h('div', [
                                        h(InputCell, {
                                            props: {
                                                row: params.row,
                                                onInputChange: this.onInputChange,
                                                keyVar: params.column.key,
                                                fieldsData: JSON.parse(this.value.FieldJson),
                                                readonly: this.readonly || this.disabled,
                                                statsData: this.tableData,
                                                onAddRow: this.onAddRow,
                                                onRemoveRow: this.onRemoveRow,
                                            }
                                        }),
                                    ]);
                                }
                            }
                            tableColumn.push(col)
                        }
                    }

                    const col = {
                        'title': 'Action',
                        width: '60',
                        render: (h, params) => {
                            return h('div', [
                                h(ActionCell, {
                                    props: {
                                        row: params.row,
                                        readonly: this.readonly || this.disabled,
                                        statsData: this.tableData,
                                        onAddRow: this.onAddRow,
                                        onRemoveRow: this.onRemoveRow,
                                    }
                                }),
                            ]);
                        }
                    }
                    tableColumn.push(col)


                    return tableColumn;
                }
                else{
                    return [];
                }
            }
        },
        created(){
            if(this.value.TableJson !== null){
                
                this.tableData = this.statData();
            }
        },
        methods: {
            getOptions(){
                if(this.value.FieldJson !== null){
                    var field = JSON.parse(this.value.FieldJson)
                    if(field[0].isPast === 1){
                        return this.options;
                    }
                    else if( field[0].isPast === 0 ){
                        return this.options1;
                    }
                    else{
                        return {};
                    }
                }
            },
            getRadios(){
                const arr = JSON.parse(this.value.FieldJson);
                const radioFields = arr.split(',');
                return radioFields;
            },
            checkRequired(item){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item.key;
                    })
                        
                        return field.required;
                }
                else{
                    return false;
                }
            },
            getItems(item){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields[0].select;
                    if(field){
                        var fieldArray = field.split(',').map(function(item) {
                            return item.trim();
                        });
                        
                        return fieldArray;
                    }else{
                        return []
                    }
                }
            },
            checkCondition(item,type){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === item.key;
                    })
                    if(field.type === type){
                        
                        return true
                    }else{
                        return false
                    }
                }else {
                    return false;
                }
                return true;
            },
            statData(){
                var columns = this.value.TableJson.replace('/n','');
                columns = JSON.parse(columns);
                return columns;
            },
            newRowStructure(){
                var cols = this.statData()[0];
                var row = {};
                for (var key in cols){
                    if(cols.hasOwnProperty(key)){
                        row[key] = ''
                    }
                }
                return row;
            },
            onAddRow(){
                var row = this.newRowStructure();
                if(!this.readonly || this.disabled){
                    this.tableData.push(row);
                }
            },
            
            onRemoveRow(index){
                this.tableData.splice(index,1);

            },

            onInputChange(val,row){
                this.refinedData[row._index] = row;
                 for (var key in this.tableData[row._index]) {
                    if (this.tableData[row._index].hasOwnProperty(key)) {
                        this.tableData[row._index][key] = row[key];
                    }
                }
            },
            uploadFile(file) {
                if(file !== null){ 
                    const data = new FormData();
                    data.append("image", file);
                    data.append("reference_id", this.$route.params.id);
                    data.append("field_id", this.value.Field_id);
                    data.append("process_id", FUND_LICENSE);
                    uploadDoc(data).then(res => {
                        this.value.DocumentPath = res.path;
                    })
                }
            },
        }
    }
</script>

<style lang="scss" module>
    .required {
        color: #ff3547;
        margin-left: 2px;
    }
    .numbering{
        position: absolute;
        left: -10px;
        top: 15px;
    }
    .rowPadding{
        padding: 0px 15px;
    }
    .inputsStyle{
        position: relative;
        // width: 100%;
        margin-bottom: 20px;
        // margin-left: 10px;
    }
    .file {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .fileView {
        padding: 0 5px;
        margin-left: 5px;
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-right: 5px;
            }
        }
    }

    .label {
        margin-bottom: 0;
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
        }
    }
    .selectors {
        :global {
            .text-danger {
                display: block;
                font-size: 11px;
            }
            .ivu-radio-group {
                display: flex;
                justify-content: center;
                .ivu-radio-wrapper {
                    margin: 0 10px;
                }
            }
        }
    }
</style>
