<template>
    <div>
        <DataTable :actions="true"
            :data="personData"
            :columns="tableColumns()"
            @on-selection-change="selectChange"
        >
            <template slot="actionsLeft" v-if="!readonly">
                <TableButton @click="addPerson()">
                    <img src="../../../../../assets/images/plus.png">
                    Associate 
                </TableButton>
                <TableButton @click="() => addChange('cessation')">
                    <img src="../../../../../assets/images/cessation.png">
                    Disassociate
                </TableButton>
                <TableButton @click="() => addChange('changeRole')">
                    <img src="../../../../../assets/images/cessation.png">
                    Change
                </TableButton>
            </template>
        </DataTable>
        <br />

        
        <Popup :value="modals.appointment.visible" @close="() => showPopup(false)" title="Appointment" :width="900" >
            <ValidationObserver ref="CompanyPerson" v-if="modals.appointment.visible" v-slot="{ passes }">
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
                <FormRow v-if="position == 22">
                    <div class="col-sm-12">
                        <InputText label="Enter name of role" rules="required" v-model="pqPositionName" />
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
                            item-name="Fname"
                            item-value="person_id"
                            v-model="benefactor"
                            rules="required"
                            :items="getBenefactors()" />
                    </div>
                </FormRow>
                <p v-if="position === 13 && getBenefactors().length === 0" class="text-danger">Please add a Beneficial Owner before Proceeding</p>
                <ButtonGroup slot="footer">
                    <FormButton @click="passes(addNewPerson)" :disabled="disabledButton" type="success">Submit</FormButton>
                    <FormButton @click="showPopup(false)">Cancel</FormButton>
                </ButtonGroup>

            </ValidationObserver>

        </Popup>


        <!-- // Show person Info -->

        <Popup :value="popVisible" @close="showPopup2(false)" title="Person Info" width="900">
            
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Position for which applying" v-model="showPersonalData.position" readonly />
                </div>
                <div class="col-sm-6">
                    <InputText label="Passport Number" v-model="showPersonalData.passportNumber" readonly />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-2">
                    <Salutation  v-model="showPersonalData.Salutation" readonly />
                </div>
                <div class="col-sm-5">
                    <InputText label="First Name" v-model="showPersonalData.Fname" readonly />
                </div>
                <div class="col-sm-5">
                    <InputText label="Last Name" v-model="showPersonalData.Lname" readonly />
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Residential Address"   v-model="showPersonalData.ResAddress_id" readonly />
                </div>
            </FormRow>
            
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Business Address"   v-model="showPersonalData.BusinessAddress_id" readonly />
                </div>
            </FormRow>

            <FormRow>
                <div class="col-sm-4">
                    <InputTel label="Mobile" v-model="showPersonalData.Mobile" readonly />
                </div>
                
                <div class="col-sm-4">
                    <InputText label="Email" v-model="showPersonalData.Email" readonly />
                </div>
                
                <div class="col-sm-4">
                    <InputTel label="Fax"   v-model="showPersonalData.Fax" readonly />
                </div>
            </FormRow>

                <FormRow>
                <div class="col-sm-6">
                    <InputText label="Occupation" v-model="showPersonalData.occupation" readonly />
                </div>
                
                <div class="col-sm-6">
                    <InputText label="Nationality" v-model="showPersonalData.Nationality" readonly />
                </div>
                
            </FormRow>
            <FormRow v-if="showPersonalData.persontype === 13">
                <div class="col-sm-6">
                    <FormCheckbox readonly  name="IsNominee" v-model="showPersonalData.isNominee"><span >IsNominee </span></FormCheckbox>
                </div>
                
                <div class="col-sm-6">
                    <InputText label="Benefactor" v-model="showPersonalData.BeneficialOwner_id" />
                </div>
            </FormRow>
        </Popup>


        <!-- //Cessation -->
        <Popup :value="modals.cessation.visible" @close="() => cancel('cessation')" title="Cessation">
            <Loader v-if="modals.cessation.loading"/>
            <ValidationObserver tag="div" ref="CompanyPerson" v-if="modals.cessation.visible" >
            <FormRow>
                <div class="col-sm-4">
                    <InputDate :options="dateOptions" rules="required" label="Date of Cessation" v-model="data.EffectiveDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Reason of Resignation" rules="required" v-model="data.ResignationReason"/>
                </div>
            </FormRow>
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click="() => saveData('cessation')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('cessation')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

         <Popup :value="modals.changeRole.visible"  @close="() => cancel('changeRole')" title="Change in Position">
            <Loader v-if="modals.changeRole.loading" />
            <ValidationObserver tag="div" ref="CompanyPerson" v-if="modals.changeRole.visible" >
                <!-- <FormRow>
                    <div class="col-sm-6">
                        <InputText label="PQ ID" readonly v-model="pq.UniqueRef" />
                    </div>
                    <div class="col-sm-6">
                        <InputText label="Name" readonly v-model="pq.Name" />
                    </div>
                </FormRow> -->
                <FormRow>
                    <div class="col-sm-8">
                        <FormSelect label="Position for which applying"
                            item-name="Name"
                            rules="required"
                            item-value="id"
                            v-model="data.persontype_id"
                            :items="positions" />
                    </div>
                    <div class="col-sm-4">
                        <InputDate label="Date of Appointment" :options="dateOptions" rules="required" v-model="data.EffectiveDate"/>
                    </div>
                </FormRow>
                <FormRow v-if="data.persontype_id == 22">
                    <div class="col-sm-12">
                        <InputText label="Enter name of role" rules="required" v-model="pqPositionName" />
                    </div>
                </FormRow>
                
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click.prevent="() =>saveData('changeRole')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('changeRole')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>
        
        <Popup title="Information"  :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </div>
</template>

<script>
    
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import valueMixin from 'Mixins/valueMixin';
    import InputDate from 'Components/form/InputDate';
    import { fetchPerson, fetchPQPosition, getCSLPCCRequestpeople, addUpdatePerson, BeneficialOwner, assignCSLPCCPosition, removeCSLPCCPosition, changePeople } from '../api';
    // import { changePeople, fetchPQPosition, searchForPQ, } from '../api';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { ValidationObserver } from "vee-validate";
    import tableColumn from './positionTable';
    import Salutation from "Components/layout/salutation";
    import InputTel from 'Components/form/InputTel';
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name: "CompanyPersons",
        mixins: [valueMixin,loadingMixin,validateSelectedRows],
        components: {
            DataTable,
            ValidationObserver,
            Salutation,
            InputTel,
            AddressInput,
            InputDate
        },
        props: {
            value: Object,
            personData: Array,
            readonly: Boolean,
            licenseType: String
        },
        data() {
            return {
                
                modals: {
                    warning: {
                        visible: false
                    },
                    success: {
                        visible: false,
                        loading: false
                    },
                    appointment: {
                        visible: false,
                        loading: false
                    },
                    cessation: {
                        visible: false,
                        loading: false
                    },
                    changeRole: {
                        visible: false,
                        loading: false
                    }
                },
                data: {
                    person_id: '',
                    ChangeType: null,
                    EffectiveDate: '',
                    ResignationReason: '',
                    persontype_id: '',
                    companypeople_id: 0,
                },
                changeTypes: {
                    appointment: 'APPT',
                    cessation: 'CESS',
                    changeRole: 'CHANGE'
                },
                people: [],
                tableData: [],
                tableColumns: tableColumn,
                selectedRows:[],
                position:'',
                positions: [],
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
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
                // personData: {},
                popVisible: false,
                countries() {
                    return this.$store.state.common.countries;
                },
                
                ICSPChangePeopleRequest_id: null,
                pqPositionName: null,
                showPersonalData: {}
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user;
            },
            currentAddressId() {
                return this.data.person_id ? this.peopleList.find(item => item.person_id === this.data.person_id).Address : '';
            }
        },
        watch:{
            
            // position(val){
            //     if(val === 13){
            //         this.getBenefactor();
            //     }
            // },
            'data.persontype_id':function(val){
                if(val !== '' && val !== undefined && val !== null){
                    if(val !== 22) {
                        this.pqPositionName = this.positions.find(item => item.id === val).Name;
                    }
                    if(val == 22){
                        this.pqPositionName = ''
                    }
                }
            },
        },
        created() {
            this.getPositions();
            this.getPeople();
        },
        methods: {
            openPop(data){
                this.showPersonalData = this.personData.find((item) => {
                    return item.id === data;
                });
                this.showPopup2(true);
            },
            showPopup2(val){
                this.popVisible = val;
            },
            getBenefactors(){
                const benefactors =  this.personJsonData().filter( item => {
                    if(item.persontype_id == 14) {
                        return item;
                    }
                })
                return benefactors;
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
                // if(this.position == 13){
                    this.data.person_id = this.personId;
                    this.data.persontype_id = this.position;
                    this.data.ChangeType = 'APPT';

                    this.saveData('appointment');
                    
                // }else{
                //     const data = { isNominee: this.innerValue.isNominee, CSLPCCrequest_id: parseInt(this.$route.query.task),persontype_id:this.position,person_id:this.personId, BeneficialOwner_id: this.benefactor }
                //     this.assignPosition(data);
                // }
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
                this.modals.appointment.visible = val;
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
            resetData() {
                this.data = {
                    ChangeType: null,
                    EffectiveDate: '',
                    ResignationReason: '',
                    person_id: '',
                    persontype_id: '',
                    companypeople_id: 0,
                };
                this.pqPositionName = null;
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
            
            async getPositions() {
                if(this.licenseType == "CSL"){
                    // const data = {process_id: 345}
                    const data = { isCSL : 1 }
                    const positions = await fetchPQPosition(data);
                    this.positions = positions.data;
                }
                else if(this.licenseType == "PCC"){
                    // const data = {process_id: 113}
                    const data = { isPCC : 1 }
                    const positions = await fetchPQPosition(data);
                    this.positions = positions.data;
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            personJsonData(){
                return JSON.parse(this.innerValue.peopleJson)
            },
            saveData(type) {
                this.$refs.CompanyPerson.validate().then(
                    res => {
                        if(res){
                            this.modals[type].loading = true;
                            changePeople({
                                ...this.data,
                                process_id: this.innerValue.process_id,
                                reference_id: this.innerValue.reference_id,
                                position: this.pqPositionName,
                                ...(type == 'changeRole' && { ICSPChangePeopleRequest_id : this.ICSPChangePeopleRequest_id}),
                                ...(this.position == 13 && {BeneficialOwner_id: this.benefactor})
                            }).then(res => {
                                this.modals[type].loading = false;
                                this.personData = JSON.parse(res.data[0].PeopleJson)
                                this.resetData();
                                this.resetPerson();
                                this.modals.success.visible = true;
                                this.modals[type].visible = false;
                                this.$emit('onAction',true);
                            }).catch(() => {
                                this.modals[type].loading = false;
                            })
                        }
                    }
                )
                
            },
            cancel(type) {
                this.modals[type].visible = false;
                this.resetData();
            },
            addChange(type) {
                if (this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    this.modals[type].visible = true;
                        this.data.person_id = row.person_id;
                        this.data.companypeople_id = row.companypeople_id;
                    if(type != 'changeRole'){
                        this.data.persontype_id = row.persontype_id;
                    }
                    if(type == 'changeRole'){
                        this.ICSPChangePeopleRequest_id = row.id;
                    }
                    this.data.ChangeType = this.changeTypes[type];
                }
            }
        }
    }
</script>
