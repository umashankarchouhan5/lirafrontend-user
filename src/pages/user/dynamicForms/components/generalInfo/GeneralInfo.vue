<template>
    <div>
        <div  :class="$style.paddingClass" class="widthAnchor">
            <!-- Rep COde -->
            <RepCode v-if="processId == 2002 && stepId == 1" :readonly="readonly"></RepCode>   
            <!-- Rep cod end -->

            <div v-for="(item, i) in innerValue"  :key="item.Qid">

                <!-- <br v-if="item.Page === stepId && item.BlockJson !== null" /> -->

                <div :class="$style.flexClass" v-if="item.Page === stepId && item.BlockJson !== null" >

                    <h6 :class="[item.isSubBlock === 1 ? $style.indent : '']" class="mr-3 pr-3">{{getBlockLabel(item)}} &nbsp;&nbsp;&nbsp;</h6>

                    <FormCheckbox :class="$style.pad" v-if="checkNa(item)" :disabled="readonly" name="NA Box" v-model="item.isNA" @onChangeEvent="disableData(item,$event)" :vid="`GeneralInfo_NA_CheckBox_${i}`"><span ><b> NA</b></span></FormCheckbox>

                </div>

                

                <div :class="indentStyle(item)" v-if="item.Page === stepId && item.SkipWhenField_id === null && item.FieldType !== null && item.FieldType !== '' && tableWidth !== 0"  >
                    <ListItem  
                        v-model="innerValue[i]"  
                        :disabled="getDisabled(item,i) || getTableDisabled(item)" 
                        :readonly="readonly || (i === 0 && companyProcesses.indexOf(processId) !== -1) || ( i == 1 && processId == 4001)" 
                        :companyName="(i === 0 && companyProcesses.indexOf(processId) !== -1) || ( i == 1 && processId == 4001) ? companyName : null" 
                        :width="tableWidth"
                    >
                        <div :class="$style.flexClass" v-if="item.FieldType.toLowerCase() ==='yesno' || item.FieldType.toLowerCase() ==='checkbox'">
                            <p >{{item.Label}}</p> 
                        </div>
                    </ListItem>
                </div>
                <div v-if="item.Page === stepId && item.SkipWhenQid !== null  && item.FieldType !== null && item.FieldType !== '' && tableWidth !== 0" :class="indentStyle(item)">
                    <ListItem  
                        v-model="innerValue[i]"  
                        :disabled="getDisabled(item,i) || getTableDisabled(item)" 
                        :readonly="readonly|| (i === 0 && companyProcesses.indexOf(processId) !== -1) || ( i == 1 && processId == 4001)" 
                        :companyName="(i === 0 && companyProcesses.indexOf(processId) !== -1) || ( i == 1 && processId == 4001) ? companyName : null" 
                        :width="tableWidth"
                    >
                        <div :class="$style.flexClass" v-if="item.FieldType.toLowerCase() ==='yesno' || item.FieldType.toLowerCase() ==='checkbox'">
                            <p ><span v-if="item.FieldNumber !== null">{{item.FieldNumber}}. &nbsp;</span> {{item.Label}}</p> 
                         
                        </div>
                    </ListItem>
                </div>
            </div>

            <ButtonGroup>
                <FormButton type="primary" v-if="stepId !== 1" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton v-if="!readonly" type="success" @click="saveRequest">Save</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    import ListItem from '../subComponent/listRenderV3'
    import RepCode from '../subComponent/RepCode'
    import countriesMixin from 'Mixins/countriesMixin'

    export default {
        name: "GeneralInfo", 
        mixins: [ valueMixin, countriesMixin],
        components: {
            ListItem,
            RepCode
        },
        props: {
            readonly: Boolean,
            stepId: Number,
            companyName: String,
        },
        data() {
            return {
                isModalVisible: false,
                isAddressSame: false,
                indentClass: this.$style.indent,
                disabledIds: [],
                ids:'',
                tableWidth: 0,
                companyProcesses:[ 2000, 2001, 2003, 2004, 2005, 2006, 2007, 2008, 3001, 2011, 2012, 2013 ],
                disabledTables: [],
            }
        },
        computed:{
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            
        },
        watch:{
            innerValue:{
                deep: true,
                handler(val){
                    if( val.constructor === Array){
                        val.forEach(element => {
                            if(element.isNA !== undefined && element.isNA !== null){
                                if((element.isNA === 1 || element.isNA == true) && element.BlockJson !== null){
                                    this.disableData(element,true);
                                }
                                else if((element.isNA === 0 || element.isNA == false) && element.BlockJson !== null){
                                    this.disableData(element,false);
                                }
                                else if((element.isNA === 1 || element.isNA == true) && element.BlockJson === null){
                                    let count = this.disabledTables.reduce((n, x) => n + (x === element.Field_id), 0);
                                    if(count === 0){
                                        this.disabledTables.push(element.Field_id)
                                    }
                                }
                                else if((element.isNA === 0 || element.isNA == false) && element.BlockJson === null){
                                    let index = this.disabledTables.indexOf(element.Field_id);
                                    if(index !== -1){
                                        this.disabledTables.splice(index,1);
                                    }
                                }
                            }
                        });
                    }
                }
            },
            'innerValue.Stats':{
                deep: true,
                handler(val){
                }
            },
            ids(val){
                var check = Boolean(this.disabledIds.find( item => {
                    return val === item
                }))
                if(check === false){
                    this.disabledIds.push(val);
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                window.addEventListener('resize', this.onResize);
            })
            var tableClass = document.getElementsByClassName('widthAnchor');
            this.tableWidth = tableClass !== undefined && tableClass[0] !== undefined ? tableClass[0].offsetWidth : 1218;
        },
        beforeDestroy() { 
            window.removeEventListener('resize', this.onResize); 
        },
        methods: {
            getTableDisabled(item){
                if(item.Field_id !== null){
                    var check = this.disabledTables.some( val => {
                        return val == item.Field_id
                    })
                    return check;
                }else{
                    return false;
                }

            },
            onResize() {
                var tableClass = document.getElementsByClassName('widthAnchor');
                this.tableWidth = tableClass !== undefined && tableClass[0] !== undefined ? tableClass[0].offsetWidth : 1218;
            },
            indentStyle(item){
                if(item.FormBlock_id !== null && item.isSubBlock !== 1){
                    return this.$style.indent
                }
                else if(item.FormBlock_id !== null && item.isSubBlock === 1){
                    return this.$style.indent1;
                }
                else{
                    return '';
                }
            },
            getBlockId(box){
                var block1 = JSON.parse(box.BlockJson);
                var disabledValue = parseInt(block1[0].id);
                return disabledValue
            },
            disableData(box,val){
                if(val === true || val === 1){
                    var id = this.getBlockId(box);
                    let count = this.disabledIds.reduce((n, x) => n + (x === id), 0);
                    if(count === 0){
                        this.disabledIds.push(id);
                    }
                }
                if(val === false || val === 0){
                    let id = this.getBlockId(box);
                    let count = this.disabledIds.reduce((n, x) => n + (x === id), 0);
                    for(var k = 0; k < count; k++){
                        let index = this.disabledIds.indexOf(id);
                        this.disabledIds.splice(index,1);
                    }
                }
            },
            getDisabled(item, index){
                if(item.FormBlock_id !== null){
                    let check = this.disabledIds.some( val => {
                        return val == item.FormBlock_id
                    })
                    this.innerValue[index].isNA =  check;
                    return check;
                }else{
                    return false;
                }
            },
            checkNa(item){
                let block = JSON.parse(item.BlockJson);
                return block[0].allowNA
            },
            getBlockLabel(item){
                try{
                    JSON.parse(item.BlockJson)

                }catch(err){

                }
                var block = JSON.parse(item.BlockJson);
                return block[0].name;
            },
            checkDisabled(item){
                const commandingQuestion = this.innerValue.find((val) => {
                    return item.SkipWhenField_id === val.Qid
                })
                if(commandingQuestion.CheckedYN === item.ResponseYN ){
                    return true;
                }
                else{
                    return false;
                }
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            
            prevStep() {
                this.$emit('prevStep')
            }
        }
    }
</script>

<style lang="scss" module>
    .paddingClass {
        padding: 0px 15px;
    }
    .pad {
        padding-left: 30px;
    }
    .indent {
        margin-left: 20px;
    }
    .indent1{
        margin-left: 40px;
    }
    .flexClass {
        display: flex;
        justify-content: flex-start;
        .firstItem{
            min-width: 40px;
        }
        p{
            margin-bottom: 0px !important;
        }
    }
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
        min-width: 200px;
    }
</style>
