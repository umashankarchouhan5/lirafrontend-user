<template>
    
    <FormRow :class="$style.widthStyle">
        <div class="col-sm-9" v-if="value.FieldType.toLowerCase() === 'yesno'">
            <p :class="$style.label">
                <slot />
            </p>
        </div>
        <div class="col-sm-3" v-if="value.AnswerYN === 1 || value.FieldType.toLowerCase() === 'yesno'">
            <div :class="$style.selectors" >
                <FormYesNo v-model="value.ValueTextArea" name="Yes/No" :disabled="readonly || disabled" :vid="`Yes/No-${value.Field_id}`" :rules="{required: value.isMandatory === 1 && disabled ? false: true}" ></FormYesNo>

            </div>
        </div>
        <div class="col-sm-12" v-if="value.AnswerYN === 1 || value.FieldType.toLowerCase() === 'checkbox'">
            <div  :class="$style.checkItem">
                <div :class="$style.checkbox">
                    <FormCheckbox :disabled="readonly || disabled"  name="CheckBox" trueValue="1" :vid="`Checkbox-${value.Field_id}`"  falseValue="0" v-model="value.ValueTextArea" ></FormCheckbox>
                </div>
                <div :class="$style.checkBrief">
                   <span >
                        <slot />
                    </span>
                </div>
            </div>
        </div>
        
        <div v-if="value.AnswerTextbox === 1 && (value.TextBoxonYN === value.ValueTextArea || value.TextBoxonYN === 'B') && value.AnswerYN === 1" class="col-sm-12">
            <InputTextArea v-model="value.Notes" :vid="`Notes-${value.Field_id}`" label="Notes"  :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        <div v-if="value.AnswerTextbox === 1 && value.AnswerYN=== 0 " class="col-sm-12">
            <InputTextArea v-model="value.Notes" :vid="`Notes-${value.Field_id}`" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        <div v-if="value.TextBoxonYN !== null && value.TextBoxonYN === value.ValueTextArea " class="col-sm-12">
            <InputTextArea v-model="value.Notes" :vid="`Notes-${value.Field_id}`" label="Notes" :rules="{required: disabled ? false: true}" maxlength="500" :readonly="readonly || disabled" rows="5" />
        </div>
        

        

        <div :class="$style.flexClass" v-if=" value.FieldType.toLowerCase() === 'table'" class="tableWidthClass">
            <div  class="col-sm-12">
                <p v-if="value.Label !== null && value.Label !== ''" :class="$style.tableHeadingFlex" >
                    <span v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </span>
                    {{value.Label}}
                    <FormCheckbox :class="$style.pad" v-if="value.isMandatory == 0" :disabled="readonly" name="NA Box" :vid="`NA_Box-${value.Field_id}`" :trueValue="1"  :falseValue="0" v-model="value.isNA" ><span ><b> NA</b></span></FormCheckbox>
                </p>
                <DataTable :class="$style.documents"  no-data-text="No Data Available" :columns="modifiedColumns" :readonly="readonly || disabled" :data="tableData" />
                
            </div>
        </div>


        <div v-if=" value.FieldType.toLowerCase() !== 'table' " >
            <div  v-if="value.FieldType.toLowerCase() === 'textarea'">
                <div :class="$style.inputsStyle" class="col-sm-12">
                    <div   >
                        <p><b v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </b> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-12" >
                    
                    <InputTextArea v-model="value.ValueTextArea" rows="5" :vid="`${value.Label}-${value.Field_id}`" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" :readonly="readonly || disabled" :name="value.Label" />
                </div>
            </div>
        </div>

        <div v-if=" value.FieldType.toLowerCase() !== 'table' " >
            
            <div :class="[$style.flexClass,$style.newLabelStyle]"  v-if="value.FieldType.toLowerCase() !== 'textarea' && value.FieldType.toLowerCase() !== 'yesno' && value.FieldType.toLowerCase() !== 'checkbox' " >

                <div  >
                    <p><span v-if="value.FieldNumber !== null">{{value.FieldNumber}}. </span> {{value.Label}} <span v-if="value.isMandatory" :class="$style.required">*</span></p>
                </div>

            <!-- </div>

            

            <div :class="$style.flexClass"  v-if="value.FieldType.toLowerCase() !== 'textarea' && value.FieldType.toLowerCase() !== 'yesno' && value.FieldType.toLowerCase() !== 'checkbox' " > -->

                <div :class="$style.inputsStyle" class="col-sm-4"  v-if="value.FieldType.toLowerCase() === 'textbox'">
                    <div>
                        <InputText :name="value.Label" :vid="`${value.Label}-${value.Field_id}`"  v-model="value.ValueTextArea" :readonly="readonly  || disabled"   :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" />
                    </div>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4"  v-if="value.FieldType.toLowerCase() === 'date'" >
                    <InputDate type="date" :name="value.Label" :vid="`${value.Label}-${value.Field_id}`" v-model="value.ValueDate" :options="getOptions()" :readonly="readonly  || disabled"  :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}"  />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldType.toLowerCase() === 'number'">
                    
                    <InputText type="number" :name="value.Label" :vid="`${value.Label}-${value.Field_id}`" v-model="value.ValueInt" :readonly="readonly  || disabled"  :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}"   />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldType.toLowerCase() === 'dropdown'">
                    
                    <FormSelect changeBackground :name="value.Label" :vid="`${value.Label}-${value.Field_id}`" v-model="value.ValueTextArea" 
                        :disabled="readonly || disabled" :items="getItems()" :clearable="false" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldType.toLowerCase() === 'address'">
                    
                    <AddressInput :name="value.Label" :vid="`${value.Label}-${value.Field_id}`" v-model="value.ValueInt" :readonly="readonly  || disabled"   :clearable="false" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldType.toLowerCase() === 'country'" >
                    
                    <FormSelect
                        changeBackground
                        :items="countries"
                        item-name="Name"
                        item-value="id"
                        :name="value.Label"
                        :disabled="readonly || disabled"
                        v-model="value.ValueInt"   
                        :clearable="false" 
                        :vid="`${value.Label}-${value.Field_id}`"
                        :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}"
                    />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4"  v-if="value.FieldType.toLowerCase() === 'radiobutton'">
                    
                    <RadioGroup v-model="value.ValueTextArea" :disabled="readonly || disabled">
                        <Radio v-for="(rad,ind) in getRadios" :key="ind" :label="rad" :disabled="readonly || disabled" rules="required">
                            {{rad}}
                        </Radio>
                    </RadioGroup>
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4" v-if="value.FieldType.toLowerCase() === 'phone'" >
                    
                    <InputTel v-model="value.ValueTextArea" :vid="`${value.Label}-${value.Field_id}`" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false}" :disabled="readonly || disabled" :name="value.Label" />
                </div>
                <div :class="$style.inputsStyle" class="col-sm-4"  v-if="value.FieldType.toLowerCase() === 'email'">
                    
                    <InputText v-model="value.ValueTextArea" :vid="`${value.Label}-${value.Field_id}`" :rules="{required: value.isMandatory === 1 && disabled === false ? true: false,email: true}" :readonly="readonly || disabled" :name="value.Label" />
                </div>
            </div>
            
        </div> 

        <div v-if="value.AllowDocumentUpload === 1 || value.DocumentWhenAnswerYN !== null" class="col-sm-12">
            <div :class="$style.file" v-if="value.AllowDocumentUpload === 1 || value.DocumentWhenAnswerYN  === value.ValueTextArea">
                <InputFile label="Select File (pdf)" :vid="`SelectFile-${value.Field_id}`" :readonly="readonly || disabled" :disabled="readonly || disabled" v-if="this.value.DocumentPath === null" @onChange="uploadFile" :rules="{required:disabled ? false: true,docCheck:'pdf',checkFileRegex: true}" />
                
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

    import { RadioGroup, Radio } from 'view-design'
    import FormYesNo from 'Components/form/FormYesNo'

    import { uploadDoc } from '../APIRequests';
    import DataTable from 'Components/DataTable';
    import InputCell from './inputCell';
    import ActionCell from './actionCell';
    import InputDate from 'Components/form/InputDateNew'
    import AddressInput from 'Components/form/addressInput/AddressInput';
    // import { FUND_LICENSE } from 'Config/processIds';
    import InputTel from 'Components/form/InputTel';

    export default {
        name: "ListItem",
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
            process_id: [Number,String],
            companyName: [String,Object],
            width: Number,
        },
        components: {
            RadioGroup,
            Radio,
            FormYesNo,
            DataTable,
            InputTel,
            InputDate,
            AddressInput
        },
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
            processId() {
                return this.$store.state.common.currentProcessId;
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
                                
                                'width': this.checkColumnWidth(key),
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
            if(this.companyName !== null){
                this.value.ValueTextArea = this.companyName
            }
        },
        methods: {
            checkColumnWidth(key){
                var fields = this.value.FieldJson !== null ? JSON.parse(this.value.FieldJson) : null;
                if(fields !== null){
                    var field = fields.find( val => {
                        return val.field === key;
                    })
                    if(field.width && field.width !== undefined && field.width !== null){
                        return this.calculateWidth(field.width)
                    }
                    else{
                        return '';
                    }
                        
                }
            },
            calculateWidth(pct){
                var tableWidth = this.width - 130;
                var width = (tableWidth * pct )/100;
                return width;
            },
            
            // async calculateWidth(total,pct){
                
            //     var tableClass = await document.getElementsByClassName('widthAnchor');
            //     var tableWidth = await tableClass !== undefined && tableClass[0] !== undefined ? tableClass[0].offsetWidth : 1218;
            //     tableWidth = tableWidth - 60;
            //     var width = (total * pct )/100
            //     return width;
            // },
            getLength(){
                if(this.value.FieldJson !== null && this.value.FieldJson !== '' ){
                    var field = JSON.parse(this.value.FieldJson);
                    if(field[0].length){
                        return field[0].length;
                    }
                }
                else {
                    return false;
                }
            },
            getTextBoxWidth(){
                if(this.value.FieldJson !== null && this.value.FieldJson !== '' ){
                    var length = this.getLength();
                    if(length !== false){
                        return 2*length + 'px';
                    }
                    else{
                        return 'initial';
                    }
                }
                else{
                    return 'initial'
                }
            },
            getClassByWidth(){
                var widthClass;
                if(this.value.Label.length  < 20) {
                    widthClass = 'col-sm-2'
                }   
                else if(this.value.Label.length  > 20  && this.value.Label.length  < 30) {
                    widthClass = 'col-sm-3'
                }                 
                else if( this.value.Label.length  > 30 && this.value.Label.length  < 50){
                    widthClass = 'col-sm-4'
                }
                else if(this.value.Label.length  > 50 && this.value.Label.length  < 80){
                    widthClass = 'col-sm-5'
                }
                else{
                    widthClass = 'col-sm-6'
                }
                return widthClass
            },
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
                        // this.tableData[row._index][key] = val;
                    }
                }
            },
            uploadFile(file) {
                if(file !== null){ 
                    const data = new FormData();
                    data.append("image", file);
                    data.append("reference_id", this.$route.params.id);
                    data.append("field_id", this.value.Field_id);
                    data.append("process_id", this.processId);
                    uploadDoc(data).then(res => {
                        this.value.DocumentPath = res.path;
                    })
                }
            },
        }
    }
</script>

<style lang="scss" module>

    .pad {
        padding-left: 30px;
    }
    .widthStyle {
        width: 100%;
        margin-bottom: 10px;
    }
    .phoneClass{
        max-width: 250px;
    }
    .emailClass{
        max-width: 250px;
    }
    .dateClass {
        max-width: 150px;
    }
    .numberClass {
        max-width: 150px;
    }
    .countryClass {
        max-width: 200px;
    }
    .listRow {
        display: flex;
        align-items: center;
    }
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
    .flexClass{
        display: flex;
        align-items: center;
        justify-content: space-between;
        p{
            margin-bottom: 0px !important;
            // padding: 10px;
        }
    }
    .inputsStyle{
        position: relative;
        // background: #fcffc1;
        // background: #abd8b4;
        // background: #9fd3c7;
        // background: #b8e1dd;
        // background: #e6f99d;
        background: #afc5ff;
        padding: 2px 10px;
        p {
            margin-bottom: 0px !important;
        }
    }
    .file {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 10px;
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
    .checkItem {
        padding: 5px 8px;
        display: flex;
        align-items: center;

        &:last-child {
            border-bottom: none;
        }
    }

    .checkbox {
        flex-shrink: 0;
        flex-grow: 0;
        width: 25px;
        text-align: center;
        align-self: flex-start;
    }

    .checkBrief {
        flex-grow: 1;
        margin-left: 0px;
    }
    .tableHeadingFlex {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .newLabelStyle {
        padding: 0px 0px 0px 10px;
        border: 1px solid #ccc;
        width: max-content;
        min-width: 100%;
        box-shadow: 3px 3px 6px rgba(0,0,0,0.05);
        // @media screen and (max-width: 980px) {
        //     min-width: 100%
        // }
        // @media screen and (max-width: 1130px) {
        //     min-width: 90%
        // }
        // @media screen and (max-width: 1300px) {
        //     min-width: 80%;
        // }
    }
</style>
