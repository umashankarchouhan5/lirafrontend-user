<template>
    <FormRow>

        <div class="col-sm-9">
            <span :class="$style.label">
                <slot />
            </span>
        </div>
        <div class="col-sm-3">
            <div :class="$style.selectors" v-if="value.AnswerYN === 1">
                <!-- <RadioGroup v-model="value.CheckedYN" :disabled="readonly || disabled">
                    <Radio label="Y" :disabled="readonly || disabled" rules="required">
                        Yes
                    </Radio>
                    <Radio label="N" :disabled="readonly || disabled">
                        No
                    </Radio>
                </RadioGroup> -->
                <FormYesNo v-model="value.CheckedYN" :vid="`YesNo-${value.Qid}`" name="YesNo" :disabled="readonly || disabled" :rules="{required: disabled ? false: true}" :requiredIcon="false" ></FormYesNo>
            </div>
        </div>
        <!-- TextAreaa -->
        <div  class="col-sm-12" v-if="value.AnswerTextbox === 1">
            <div :class="$style.fieldBox" v-if="value.AnswerTextbox === 1 && (value.TextBoxOnYN === value.CheckedYN || value.TextBoxOnYN === 'B') && value.AnswerYN === 1">
                <InputTextArea v-model="value.Notes" label="Notes" :vid="`Notes-${value.Qid}`" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
            </div>
            <div :class="$style.fieldBox" v-if="value.AnswerTextbox === 1 && value.AnswerYN=== 0 ">
                <InputTextArea v-model="value.Notes" label="Notes" :vid="`Notes-${value.Qid}`" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
            </div>
            <br />
        </div>   
        <!-- Document -->
        <div class="col-sm-12"  v-if="value.DocumentWhenAnswerYN  === null || value.DocumentWhenAnswerYN === value.CheckedYN" >
            <div :class="[$style.file,$style.fieldBox]" v-if="value.AllowDocumentUpload === 1 && (value.AnswerYN === 0 || (value.AnswerYN === 1 && value.CheckedYN !== null))">
                <InputFile label="Select File (pdf)" :vid="`SelectFile-${value.Qid}`" :class="$style.fileStyle" name="Select File" :readonly="readonly || disabled" :disabled="readonly || disabled" v-if="this.value.DocumentPath === null" @onChange="uploadFile" :rules="{required:disabled ? false: true,docCheck:'pdf',checkFileRegex: true}" />
                
                <InputText label="Selected File" readonly v-if="this.value.DocumentPath !== null" v-bind:value="value.DocumentPath.split('/').pop()" />
                <a :class="$style.fileView" v-if="this.value.DocumentPath" :href="this.value.DocumentPath" target="_blank">
                    <Icon type="md-eye" />
                    View
                </a>
                <img src="../../../../../../assets/images/changes.png" v-if="this.value.DocumentPath" @click="() => {value.DocumentPath = null}" alt="FSA change" title="Change Document">
            </div>
        </div>
        <div class="widthClass">
            <FormRow v-if="(value.StatsJson !== null && value.isTable === 1) && ((value.TableWhenAnswerYN !== null && value.TableWhenAnswerYN === value.CheckedYN)  || (value.AllowEmptyTable === 1) )"  >
                <div  class="col-sm-12">
                    <DataTable :class="$style.documents"  no-data-text="No Data Available" :columns="modifiedColumns" :readonly="readonly || disabled" :data="tableData" />
                    
                </div>
            </FormRow>
        </div>

        <div v-if="(value.StatsJson !== null && value.isTable === null && value.CheckedYN === 'Y') || value.isFieldJsonRequired === 1" :class="$style.fieldBox">
            
            <div  v-for="(items,i) in modifiedFields" :key="i" >
                <div :class="$style.rowPadding" class="row">
                    <div :class="[$style.inputsStyle,checkClass(items.value)]"  v-if="value.FieldJson === null || checkCondition(items,'text')">
                        <InputText :label="items.value" v-model="tableData[0][items.key]" :vid="`${items.value}-${value.Qid}`"  :rules="{required: checkRequired(items)}" :readonly="readonly || disabled" />
                    </div>
                </div>

                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldJson === null || checkCondition(items,'email')">
                        <InputText :label="items.value" v-model="tableData[0][items.key]" :vid="`${items.value}-${value.Qid}`"  :rules="{required: checkRequired(items),email: true}" :readonly="readonly || disabled" />
                    </div>
                </div>
                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldJson === null || checkCondition(items,'phone')">
                        <InputTel :label="items.value" v-model="tableData[0][items.key]" :vid="`${items.value}-${value.Qid}`"  :rules="{required: checkRequired(items),email: true}" :readonly="readonly || disabled" />
                    </div>
                </div>

                <div :class="$style.rowPadding" class="row">
                    <div :class="[$style.inputsStyle,checkClass(items.value)]" v-if="value.FieldJson === null || checkCondition(items,'date')" >
                        <InputDate type="date" :label="items.value" v-model="tableData[0][items.key]" :vid="`${items.value}-${value.Qid}`"  :rules="{required: checkRequired(items)}" :readonly="readonly || disabled" />
                    </div>
                </div>

                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-3" v-if="value.FieldJson === null || checkCondition(items,'number')">
                        <InputText type="number" :label="items.value" v-model="tableData[0][items.key]" :vid="`${items.value}-${value.Qid}`" :rules="{required: checkRequired(items)}" :readonly="readonly || disabled" />
                    </div>
                </div>

                <div :class="$style.rowPadding" class="row">
                    <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldJson === null || checkCondition(items,'select')">
                        <FormSelect :label="items.value" v-model="tableData[0][items.key]" :vid="`${items.value}-${value.Qid}`" :rules="{required: checkRequired(items)}" :disabled="readonly || disabled" :items="getItems(items)" :clearable="false" />
                    </div>
                </div>

            </div>

        </div>

    </FormRow>
</template>

<script>

    // import { RadioGroup, Radio } from 'view-design'
    import { uploadDoc } from '../../APIRequests'
    import DataTable from 'Components/DataTable';
    import InputCell from './inputCell';
    import ActionCell from './actionCell';
    import InputDate from 'Components/form/InputDateNew'
    import InputTel from 'Components/form/InputTel'
    import FormYesNo from 'Components/form/FormYesNo'

    export default {
        name: "ListItem",
        components: {
            // RadioGroup,
            // Radio,
            DataTable,
            InputDate,
            InputTel,
            FormYesNo
        },
        data(){
            return {
                refinedData: [],
                tableData: [],
                itemBox:[],
                rowStructure: {},
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
            }
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
            modifiedFields(){
                if(this.value.JsonFormat !== null){
                    var columns = this.value.JsonFormat.replace('/n','');
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
                if(this.value.JsonFormat !== null){
                    var columns = this.value.JsonFormat.replace('/n','');
                    columns = JSON.parse(columns);
                    var tableColumn = [];
                    var tableClass = document.getElementsByClassName('widthClass');
                    var tableWidth =  tableClass !== undefined && tableClass[0] !== undefined ? tableClass[0].offsetWidth : 1218;
                    
                    for (var key in columns[0]) {
                        if (columns[0].hasOwnProperty(key)) {
                            
                            const col = {
                                    'title': columns[0][key] !== '' && columns[0][key] !== ' ' && columns[0][key] !== 0 ? columns[0][key] : key,
                                    'key': key,
                                    'width': this.checkColumnWidth(key,tableWidth),
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
            if(this.value.StatsJson !== null){
                
                this.tableData = this.statData();
            }
        },
        methods: {
            checkClass(val){
                if(val.length < 20){
                    return 'col-sm-4'
                }
                else if(val.length >= 20 && val.length < 40){
                    return 'col-sm-5'
                }
                else if(val.length >= 40 && val.length < 60){
                    return 'col-sm-6'
                }
                else if(val.length >= 60 && val.length < 80){
                    return 'col-sm-7'
                }
                else if(val.length >= 80 && val.length < 100){
                    return 'col-sm-8'
                }
                else if(val.length >= 100 && val.length < 120){
                    return 'col-sm-9'
                }
                else{
                    return 'col-sm-12'
                }
            },
            checkColumnWidth(key,total){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === key;
                    })
                    if(field.widthpct && field.widthpct !== undefined && field.widthpct !== null){
                        return this.calculateWidth(total,field.widthpct)
                    }
                    else{
                        return '';
                    }
                        
                }
            },
            calculateWidth(total,pct){
                var width = (total * pct )/100
                return width;
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
                    var field = fields.find( val => {
                        return val.field === item.key;
                    })
                    if(field.data){
                        
                        return field.data.split(',');
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
                    try{
                        field.type 
                    }
                    catch(err){
                    }
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
                var columns = this.value.StatsJson.replace('/n','');
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
                setTimeout(() => {

                for (var key in this.tableData[row._index]) {
                    if (this.tableData[row._index].hasOwnProperty(key)) {
                        this.tableData[row._index][key] = row[key];
                    }
                }
                },100 )
                // this.refinedData[row._index] = row;
                 
            },
            uploadFile(file) {
                if(file !== null){ 
                    const data = new FormData();
                    data.append("image", file);
                    data.append("Compliance_id", this.$route.params.id);
                    data.append("Qid", this.value.Qid);
                    uploadDoc(data).then(res => {
                        this.value.DocumentPath = res.path;
                    })
                }
            },
        }
    }
</script>

<style lang="scss" module>

    .fileStyle{
        min-width: 300px;
    }
    .fieldBox{
        margin-left: 40px;
    }
    .rowPadding{
        padding: 0px 10px;
    }
    .inputsStyle{
        margin-bottom: 20px;
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
