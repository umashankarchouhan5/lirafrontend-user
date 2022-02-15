<template>
    <div>
        <DataTable :actions="true"
            :data="tableData"
            :columns="tableColumns()"
            @on-selection-change="selectChange"
        >
            <template slot="actionsLeft">
                <TableButton  @click="addPerson" v-if="!readonly">
                    <img src="../../../../assets/images/plus.png">
                    Assign
                </TableButton>
                <TableButton  @click="removePerson" v-if="!readonly">
                    <img src="../../../../assets/images/delete.png">
                    UnAssign
                </TableButton>
            </template>
        </DataTable>
        <br />
        <FormRow>
            <ButtonGroup>
                <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton  type="success" @click="saveRequest" v-if="!readonly">Save</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </FormRow>

        <Popup :value="isVisible" @close="showPopup(false)" :title="$route.name === 'CSLForm' ? 'Assign CSL Person' : 'Assign PCC Person'" :width="900" >
            <ValidationObserver ref="observer" v-if="isVisible" v-slot="{ passes }">
                <br>
                <FormRow>
                    <div class="col-sm-6">
                        <FormSelect label="Position for which applying"
                            item-name="Name"
                            item-value="id"
                            rules="required"
                            v-model="position"
                            :items="positions"
                            :clearable="false"
                        />
                    </div>
                    <div class="col-sm-6">
                        <InputText label="Passport Number" rules="required" v-model="person.passportnumber" @keyup.native="getPassportByEnter" @focusout="getPassportByTab" />
                    </div>
                </FormRow>
                
                <FormRow>
                    <div class="col-sm-2">
                        <Salutation rules="required" v-model="person.salutation" />
                    </div>
                    <div class="col-sm-5">
                        <InputText label="First Name" rules="required" v-model="person.fname" />
                    </div>
                    <div class="col-sm-5">
                        <InputText label="Last Name" rules="required" v-model="person.lname" />
                    </div>
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <AddressInput label="Residential Address" rules="required"  v-model="person.resaddress_id" />
                    </div>
                </FormRow>
                
                <FormRow>
                    <div class="col-sm-12">
                        <AddressInput label="Business Address" rules="required"  v-model="person.businessaddress_id" />
                    </div>
                </FormRow>

                <FormRow>
                    <div class="col-sm-4">
                        <InputTel label="Mobile" rules="required" v-model="person.mobile" />
                    </div>
                    
                    <div class="col-sm-4">
                        <InputText label="Email" rules="required" v-model="person.email" />
                    </div>
                    
                    <div class="col-sm-4">
                        <InputTel label="Fax"   v-model="person.fax" />
                    </div>
                </FormRow>

                    <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Occupation" rules="required" v-model="person.occupation" />
                    </div>
                    
                    <div class="col-sm-6">
                        <InputText label="Nationality" rules="required" v-model="person.nationality" />
                    </div>
                    
                </FormRow>
                <FormRow v-if="position === 13">
                    <div class="col-sm-6">
                        <FormCheckbox   name="IsNominee" v-model="innerValue.isNominee"><span >IsNominee </span></FormCheckbox>
                    </div>
                    
                    <div class="col-sm-6">
                        <FormSelect label="Select Benefactor"
                            item-name="Name"
                            item-value="person_id"
                            v-model="benefactor"
                            rules="required"
                            :items="benefactors" />
                    </div>
                </FormRow>
                <p v-if="position === 13 && benefactors.length === 0" class="text-danger">Please add a Beneficial Owner before Proceeding</p>
                <ButtonGroup slot="footer">
                    <FormButton @click="passes(addNewPerson)" :disabled="disabledButton" type="success">Submit</FormButton>
                    <FormButton @click="showPopup(false)">Cancel</FormButton>
                </ButtonGroup>
            </ValidationObserver>
        </Popup>
        <Popup :value="popVisible" @close="showPopup2(false)" title="Person Info" :width="900">
            
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Position for which applying" v-model="personData.Position" readonly />
                </div>
                <div class="col-sm-6">
                    <InputText label="Passport Number" v-model="personData.passportnumber" readonly />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-2">
                    <Salutation  v-model="personData.Salutation" readonly />
                </div>
                <div class="col-sm-5">
                    <InputText label="First Name" v-model="personData.Fname" readonly />
                </div>
                <div class="col-sm-5">
                    <InputText label="Last Name" v-model="personData.Lname" readonly />
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Residential Address"   v-model="personData.ResAddress_id" readonly />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Business Address"   v-model="personData.BusinessAddress_id" readonly />
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-4">
                    <InputTel label="Mobile" v-model="personData.Mobile" readonly />
                </div>
                
                <div class="col-sm-4">
                    <InputText label="Email" v-model="personData.Email" readonly />
                </div>
                
                <div class="col-sm-4">
                    <InputTel label="Fax"   v-model="personData.Fax" readonly />
                </div>
            </FormRow>

                <FormRow>
                <div class="col-sm-6">
                    <InputText label="Occupation" v-model="personData.occupation" readonly />
                </div>
                
                <div class="col-sm-6">
                    <InputText label="Nationality" v-model="personData.Nationality" readonly />
                </div>
                
            </FormRow>
            <FormRow v-if="personData.persontype === 13">
                <div class="col-sm-6">
                    <FormCheckbox readonly  name="IsNominee" v-model="personData.isNominee"><span >IsNominee </span></FormCheckbox>
                </div>
                
                <div class="col-sm-6">
                    <InputText label="Benefactor" v-model="personData.BeneficialOwner_id" />
                </div>
            </FormRow>
        </Popup>
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>


    </div>
</template>

<script>

    
    import valueMixin from 'Mixins/valueMixin';
    import { fetchPerson, fetchPQPosition, getCSLPCCRequestpeople, addUpdatePerson, BeneficialOwner, assignCSLPCCPosition, removeCSLPCCPosition } from './api';
    import DataTable from 'Components/DataTable'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Salutation from "Components/layout/salutation";
    import InputTel from 'Components/form/InputTel';
    import { ValidationObserver } from 'vee-validate';
    import tableColumn from './positionTable';

    export default {
        name:"CSLManagement",
        mixins: [valueMixin,validateSelectedRows],
        components: {
            DataTable,
            AddressInput,
            Salutation,
            InputTel,
            ValidationObserver,
        },
        props:{
            readonly: Boolean,
        },
        data(){
            return{
                people: [],
                tableData: [],
                tableColumns: tableColumn,
                selectedRows:[],
                position:'',
                positions: [],
                person:{
                    salutation: '',
                    fname: '',
                    lname: '',
                    resaddress_id: null,
                    businessaddress_id: null,
                    mobile: '',
                    email: '',
                    occupation: '',
                    nationality: '',
                    passportnumber: '',
                    fax: ''
                },
                personId: null,
                isVisible: false,
                benefactors: [],
                benefactor: null,
                disabledButton: false,
                personData: {},
                popVisible: false,
            }
        },
        computed:{
            countries() {
                return this.$store.state.common.countries;
            },
            userData() {
                return this.$store.state.user.user;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
        },
        created(){
            this.getPeople();
        },
        watch:{
            innerValue(val){
                
            },
            position(val){
                if(val === 13){
                    this.getBenefactor();
                }
            }
   
        },
        methods:{
            openPop(data){
                this.personData = this.tableData.find((item) => {
                    return item.id === data;
                });
                this.showPopup2(true);
            },
            showPopup2(val){
                this.popVisible = val;
            },
            getBenefactor(){
                BeneficialOwner({CSLPCCrequest_id: parseInt(this.$route.query.task),persontype_id: 14}).then(
                    res=>{
                        this.benefactors = typeof res.data === 'object' || typeof res.data === 'array' ? res.data : [];
                    }
                )
            },
            addNewPerson(){
                if(this.personId === null){
                    addUpdatePerson(this.person).then(
                        res=>{
                            this.personId = res.data[0].person_id;
                            this.assign();
                        }
                    )
                }else{
                    this.assign();
                }
            },
            assign(){
                if(this.position !== 13){
                    const data = { CSLPCCrequest_id: parseInt(this.$route.query.task),persontype_id:this.position,person_id:this.personId }
                    this.assignPosition(data);
                    
                }else{
                    const data = { isNominee: this.innerValue.isNominee, CSLPCCrequest_id: parseInt(this.$route.query.task),persontype_id:this.position,person_id:this.personId, BeneficialOwner_id: this.benefactor }
                    this.assignPosition(data);
                }
            },
            assignPosition(data){
                assignCSLPCCPosition(data).then(
                    res=>{
                        this.getPeople();
                        this.showPopup(false);
                    }
                )
            },
            removePerson(){
                if (this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    removeCSLPCCPosition({CSLPCCrequest_id: this.$route.query.task,id:row.id}).then(
                        res => {
                            this.getPeople();
                        }
                    )
                }

            },
            showPopup(val){
                this.isVisible = val;
                if(val === false){
                    this.personId= null;
                    this.resetPerson();
                }
            },
            resetPerson(){
                this.person.salutation = '';
                this.person.fname = '';
                this.person.lname ='';
                this.person.businessaddress_id = null;
                this.person. resaddress_id = null;
                this.person.mobile = '';
                this.person.fax = '';
                this.person.email = '';
                this.person.passportnumber = '';
                this.person.nationality = '';
                this.person.occupation = '';
                this.personId = null;
                this.position = '';
            },
            addPerson(){
                this.showPopup(true);
            },
            getPassportByEnter(event){
                if(event.keyCode === 13 || event.keyCode === 9){
                    this.getPassport(this.person.passportnumber);
                }
            },
            getPassportByTab(){
                this.getPassport(this.person.passportnumber)
            },
            getPassport(data){
                fetchPerson({
                    passportnumber: data
                }).then(
                    res => {
                        if(res.data[0]){
                            var data = res.data[0]
                            this.person.salutation = data.Salutation;
                            this.person.fname = data.Fname;
                            this.person.lname = data.Lname;
                            this.person.businessaddress_id = data.BusinessAddress_id;
                            this.person. resaddress_id = data.ResAddress_id;
                            this.person.mobile = data.Mobile;
                            this.person.fax = data.Fax;
                            this.person.email = data.Email;
                            this.person.passportnumber = data.passportNumber;
                            this.person.nationality = data.Nationality;
                            this.person.occupation = data.Occupation;
                            this.personId = data.id;
                        }
                    }
                )
            },
            getPeople(){
                if(this.$route.query.task){
                    getCSLPCCRequestpeople({
                        CSLPCCrequest_id: parseInt(this.$route.query.task)
                    }).then(
                        res=>{
                            if(res.data !== ''){
                                this.tableData = res.data;
                            }else{
                                this.tableData = [];
                            }
                            this.getPositions();
                        }
                    )
                }
            },
            getPositions(){
                if(this.$route.name === 'CSLForm'){
                    const data = { isCSL : 1 }
                    fetchPQPosition(data).then(
                        res => {
                            this.positions = res.data;

                        }
                    );
                }
                else{
                    const data = { isPCC : 1 }
                    fetchPQPosition(data).then(
                        res => {
                            this.positions = res.data;

                        }
                    );
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
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            
        },


    }
</script>


