<template>
    <div>
        <DataTable :actions="true"
                   :data="tableData"
                   @on-selection-change="selectChange"
                   :columns="tableColumns">
            <template slot="actionsLeft" v-if="!readonly">
                <TableButton @click="add">
                    <img src="../../../../../assets/images/plus.png">
                    Appointment
                </TableButton>
                <TableButton @click="() => addChange('cessation')">
                    <img src="../../../../../assets/images/cessation.png">
                    Cessation
                </TableButton>
                <TableButton @click="() => addChange('changeName')">
                    <img src="../../../../../assets/images/changes.png">
                    Change Name
                </TableButton>
                <TableButton @click="() => addChange('changeAddress')">
                    <img src="../../../../../assets/images/changes.png">
                    Change Address
                </TableButton>
            </template>
        </DataTable>
        <br />
        <FormButton type="success" @click="generateTicket">Generate Ticket</FormButton>

        <Popup :value="modals.appointment.visible" @close="() => cancel('appointment')" title="Director Appointment">
            <Loader v-if="modals.appointment.loading"/>
            <ValidationObserver ref="validator"  v-if="modals.appointment.visible">
                <FormRow>
                    <div class="col-sm-12">
                        <RadioGroup v-model="data.isIndividual" rules="required">
                            <Radio label="1">
                                Individual
                            </Radio>
                            <Radio label="0">
                                Corporate
                            </Radio>
                        </RadioGroup>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Name" rules="required" v-model="data.DirectorName"/>
                    </div>
                    <div class="col-sm-6">
                        <InputDate v-model="data.DateOfIncorporation" rules="required|ageCheck" label="Date of Birth" v-if="data.isIndividual == '1'"></InputDate>
                        <InputDate v-model="data.DateOfIncorporation" rules="required" label="Date of Incorporation" v-else></InputDate>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Service Address" rules="required" v-model="data.ServiceAddress" />
                    </div>
                </FormRow>
                <FormRow v-if="data.isIndividual == '1'">
                    <div class="col-sm-12" >
                        <InputText label="Residence Address" rules="required" v-model="data.ResidenceAddress" />
                    </div>
                </FormRow>
                <FormRow v-else>
                    <div class="col-sm-12">
                        <InputText label="Corporate Address" rules="required" v-model="data.CorporateAddress" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputDate label="Date of Appointment" rules="required" :options="dateOptions" v-model="data.StartDate"/>
                    </div>
                    <div class="col-sm-6">
                        <FormSelect
                            :items="countries"
                            rules="required"
                            item-name="Name"
                            item-value="id"
                            label="Nationality"
                            :disabled="readonly"
                            v-model="data.Nationality_id" />
                    </div>
                </FormRow>
                <FormSelect label="Director Type"
                    item-name="DisplayName"
                    item-value="id"
                    rules="required"
                    v-model="data.DirectorType_id"
                    :items="directorsType" />
                
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click="() => saveData('appointment')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('appointment')">Cancel</FormButton>
            </ButtonGroup>
            
        </Popup>

        <Popup :value="modals.cessation.visible" @close="() => cancel('cessation')" title="Cessation of a Director">
            <Loader v-if="modals.cessation.loading"/>
            <!-- <FormRow>
                <div class="col-sm-12">
                    <FormSelect
                        :items="peopleList"
                        itemValue="id"
                        rules="required"
                        itemName="Name"
                        label="Select Director"
                        v-model="data.person_id"
                        v-if="modals.cessation.visible" />
                </div>
            </FormRow> -->
            <ValidationObserver ref="validator"  v-if="modals.cessation.visible">
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Selected Director"   readonly v-model="data.DirectorName" />
                    </div>
                    <div class="col-sm-6">
                        <InputDate :options="dateOptions" rules="required" label="Date of Cessation" v-model="data.EndDate" />
                    </div>
                </FormRow>
                <!-- <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Reason of Resignation"  rules="required" v-model="data.ResignationReason"/>
                    </div>
                </FormRow> -->
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click="() => saveData('cessation')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('cessation')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.changeName.visible" @close="() => cancel('changeName')"
               title="Change of Name of a Director">
            <Loader v-if="modals.changeName.loading" />
            <!-- <FormRow>
                <div class="col-sm-12">
                    <FormSelect
                        :items="peopleList"
                        item-value="id"
                        item-name="Name"
                        rules="required"
                        label="Select Director"
                        v-model="data.person_id"
                        v-if="modals.changeName.visible" />
                </div>
            </FormRow> -->
            <ValidationObserver ref="validator" v-if="modals.changeName.visible">
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="Director Name" v-model="data.DirectorName"/>
                    </div>
                    <div class="col-sm-6">
                        <InputDate label="Date of Change"  rules="required" :options="dateOptions" v-model="data.EffectiveDate"/>
                    </div>
                </FormRow>
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton type="success" @click="() => saveData('changeName')">Save</FormButton>
                <FormButton @click="() => cancel('changeName')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.changeAddress.visible" @close="() => cancel('changeAddress')"
               title="Change of Address of a Director">
            <Loader v-if="modals.changeAddress.loading" />
            <!-- <FormRow>
                <div class="col-sm-12">
                    <FormSelect
                        :items="peopleList"
                        item-value="id"
                        item-name="Name"
                        rules="required"
                        label="Select Director"
                        v-model="data.person_id"
                        v-if="modals.changeAddress.visible" />
                </div>
            </FormRow> -->
            <ValidationObserver ref="validator" v-if="modals.changeAddress.visible">
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Selected Director"   readonly v-model="data.DirectorName" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Service Address"  rules="required" v-model="data.ServiceAddress" />
                    </div>
                </FormRow>
                <FormRow v-if="data.isIndividual == '1'">
                    <div class="col-sm-12" >
                        <InputText label="Residence Address"  rules="required" v-model="data.ResidenceAddress" />
                    </div>
                </FormRow>
                <FormRow v-else>
                    <div class="col-sm-12" >
                        <InputText label="Corporate Address"  rules="required" v-model="data.CorporateAddress" />
                    </div>
                </FormRow>
                <!-- <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Old Service Address" readonly :value="data.ServiceAddress" />
                    </div>
                </FormRow> -->
                <FormRow>
                    <div class="col-sm-12">
                        <InputDate :options="dateOptions"  rules="required" label="Date of Change" v-model="data.EffectiveDate"/>
                    </div>
                </FormRow>
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton type="success" @click="() => saveData('changeAddress')">Save</FormButton>
                <FormButton @click="() => cancel('changeAddress')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.success.visible" type="success" @close="() => modals.success.visible = false"
               title="Success">
            <p>Record has been saved!</p>
            <FormButton slot="footer" @click="() => modals.success.visible = false">Ok</FormButton>
        </Popup>
        <Popup :value="modals.ticket.visible" type="success" :closable="false"
               title="Success">
            <p>Your TicketReference is <b>{{modals.ticket.message}}</b></p>
            <FormButton slot="footer" @click="() => $router.go()">Ok</FormButton>
        </Popup>
        <Popup title="Information" type="error" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import InputDate from 'Components/form/InputDate';
    import DateUtil from 'Utils/dateUtil';
    import valueMixin from 'Mixins/valueMixin';
    import { getchangePeopleRequestList, RODPeople, getPeople, fetchRODDirector,fetchRODDirectorType, generateProcessTicket } from '../api';
    import { RadioGroup, Radio } from 'view-design'
    import countriesMixin from 'Mixins/countriesMixin';;
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "CompanyPersons",
        mixins: [valueMixin,countriesMixin,validateSelectedRows],
        data() {
            return {
                modals: {
                    warning: {
                        visible: false
                    },
                    appointment: {
                        visible: false,
                        loading: false
                    },
                    cessation: {
                        visible: false,
                        loading: false
                    },
                    changeName: {
                        visible: false,
                        loading: false
                    },
                    changeAddress: {
                        visible: false,
                        loading: false
                    },
                    success: {
                        visible: false,
                        loading: false
                    },
                    ticket: {
                        visible: false,
                        loading: false,
                        message: ''
                    }
                },
                peopleList: [],
                changeTypes: {
                    appointment: 'APPT',
                    cessation: 'CESS',
                    changeName: 'NAME',
                    changeAddress: 'ADDR'
                },
                data: {
                    ChangeType: null,
                    DirectorName: '',
                    EffectiveDate: '',
                    // ResignationReason: '',
                    isIndividual: '1',
                    DateOfIncorporation: '',
                    DirectorType:'',
                    DirectorType_id:'',
                    Nationality:'',
                    CorporateAddress: '',
                    ResidenceAddress: '',
                    ServiceAddress: '',
                    person_id:'',
                    Nationality_id:'',
                    StartDate: '',
                    EndDate: '',
                    CompanyROD_id: '',
                    RODChangepeopleRequest_id: 0,
                },
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: [],
                tableColumns: [
                    {
                        type: 'selection',
                        width: 38,
                        align: 'center'
                    },
                    {
                        title: 'Director Name',
                        key: 'DirectorName',
                    },
                    {
                        title: 'ROD Action',
                        key: 'ChangeAction',
                    },
                    {
                        title: 'Director Type',
                        key: 'DirectorType'
                    },
                    {
                        title:'Nationality',
                        key: 'Nationality'
                    },
                    {
                        title: 'Incorporation Date',
                        key: 'IncorporationDate'
                    },
                    {
                        title: "Service Address",
                        key: "ServiceAddress"
                    },
                    {
                        title: 'Is Individual',
                        key: 'isIndividual',
                        render: (h, params) => {
                            if(params.row.isIndividual == 1){
                                return h('span','Yes');
                            }else{
                                return h('span', 'No');
                            }
                        },
                    },
                    {
                        title: 'Corporate Address',
                        key:'CorporateAddress',
                    },
                    {
                        title: 'Residence Address',
                        key:'ResidenceAddress',
                    },
                    {
                        title: 'Effective Date',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.effectivedate));
                        },
                        align: 'left',
                    }
                ],
                directors: [],
                directorsType: [],
                selectedRows: [],
            }
        },
        computed: {
            countries() {
                return this.$store.state.common.countries;
            },
            currentAddressId() {
                return this.data.person_id ? this.peopleList.find(item => item.id === this.data.person_id).serviceAddress : ''
            }
        },
        components: {
            InputDate,
            DataTable,
            RadioGroup,
            Radio,
            ValidationObserver,
        },
        props: {
            value: Object,
            readonly: Boolean 
        },
        watch:{
            'data.person_id':function(){
                this.onSelectDirector();
            },
            'data.Nationality_id':function(val){
                if(val > 0){
                    this.data.Nationality = this.countries.find(
                        item => {
                            return item.id === val;
                        }
                    ).Name;
                }
            },
            'data.DirectorType_id':function(val){
                if(val !== undefined && val !== ''){
                    this.data.DirectorType = this.directorsType.find(
                        item => {
                            return item.id === val;
                        }
                    ).DisplayName;
                }
            },
        },
        created() {
            this.fetchDirector();
            this.fetchDirectorType();
            this.getPeopleHandler();
        },
        methods: {
            calculateAge(birthday) { 
                var ageDifMs = Date.now() - Date.parse(birthday);
                var ageDate = new Date(ageDifMs);
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            },
            onSelectDirector(value){
                if(this.data.person_id){
                    var patchData = this.peopleList.find(item => item.id === this.data.person_id);
                    this.data.isIndividual = (patchData.isIndividual).toString();
                    this.data.DateOfIncorporation = patchData.IncorporationDate;
                    this.data.DirectorName = patchData.Name;
                    this.data.Nationality_id = patchData.Nationality;
                    this.data.DirectorType_id = patchData.DirectorType_id;
                    this.data.ServiceAddress = patchData.serviceAddress;
                    this.data.ResidenceAddress = patchData.resAddress;
                    this.data.CorporateAddress = patchData.CorporateAddress;
                    this.data.StartDate = patchData.StartDate;
                    this.data.EndDate = patchData.EndDate;
                }
            },
            getPeopleHandler() {
                getchangePeopleRequestList({
                    Company_id: this.innerValue.company.id,
                    process_id: this.innerValue.process_id,
                    reference_id: this.innerValue.reference_id
                }).then(res => {
                    this.tableData = JSON.parse(res.data[0].peopleJson);
                    this.innerValue.reference_id = res.data[0].reference_id
                })
            },
            resetData() {
                this.data = {
                    ChangeType: null,
                    DirectorName: '',
                    EffectiveDate: '',
                    // ResignationReason: '',
                    ServiceAddress: '',
                    ResidenceAddress: '',
                    CorporateAddress: '',
                    DateOfIncorporation: '',
                    person_id: '',
                    Nationality: '',
                    Nationality_id:'',
                    DirectorType: '',
                    StartDate: '',
                    EndDate: '',
                    DirectorType_id: '',
                    CompanyROD_id: '',
                    RODChangepeopleRequest_id: 0,
                    isIndividual: '1',
                };
            },
            async getData(){
                const { ChangeType, DirectorName, EffectiveDate, isIndividual, DateOfIncorporation, DirectorType, DirectorType_id, Nationality, CorporateAddress, ResidenceAddress, ServiceAddress,  person_id, Nationality_id, StartDate, EndDate, CompanyROD_id, RODChangepeopleRequest_id } = this.data;
                
                // if(ChangeType === 'APPT'){
                    const dataToSend = {
                        ChangeType,
                        DirectorName,
                        EffectiveDate,
                        isIndividual: parseInt(this.data.isIndividual),
                        DateOfIncorporation,
                        DirectorType,
                        DirectorType_id, 
                        Nationality,
                        CorporateAddress,
                        ResidenceAddress,
                        ServiceAddress,
                        // ResignationReason,
                        person_id,
                        Nationality_id,
                        StartDate,
                        EndDate,
                        CompanyROD_id,
                        RODChangePeopleRequest_id: RODChangepeopleRequest_id
                    };
                    return dataToSend;
            },
            saveData(type) {
                this.$refs.validator.validate().then((result) => {
                    if (result) {
                        this.modals[type].loading = true;
                        this.getData().then(
                            res => {
                                RODPeople({
                                    ...res,
                                    Company_id: this.innerValue.company.id,
                                    process_id: this.innerValue.process_id,
                                    reference_id: this.innerValue.reference_id
                                }).then(res => {
                                    this.innerValue.reference_id = res.data[0].reference_id;
                                    this.tableData = res.data;
                                    this.modals[type].loading = false;
                                    this.resetData();
                                    this.modals.success.visible = true;
                                    this.modals[type].visible = false;
                                    // this.getPeopleHandler();
                                }).catch(() => {
                                    this.modals[type].loading = false;
                                })

                            }
                        )
                    }
                })
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            cancel(type) {
                this.modals[type].visible = false;
                this.resetData();
            },
            add() {
                this.data.ChangeType = this.changeTypes.appointment;
                this.modals.appointment.visible = true;
            },
            async selectedData(){
                this.data.CompanyROD_id = this.selectedRows[0].CompanyROD_id;
                this.data.isIndividual = (this.selectedRows[0].isIndividual).toString();
                this.data.DateOfIncorporation = this.selectedRows[0].IncorporationDate;
                this.data.DirectorName = this.selectedRows[0].DirectorName;
                this.data.Nationality_id = this.selectedRows[0].Nationality_id;
                this.data.DirectorType_id = this.selectedRows[0].DirectorType_id;
                this.data.ServiceAddress = this.selectedRows[0].ServiceAddress;
                this.data.ResidenceAddress = this.selectedRows[0].ResidenceAddress;
                this.data.CorporateAddress = this.selectedRows[0].CorporateAddress;
                this.data.StartDate = this.selectedRows[0].StartDate;
                this.data.EndDate = this.selectedRows[0].EndDate;
                this.data.RODChangepeopleRequest_id = this.selectedRows[0].RODChangepeopleRequest_id;
                return this.data;
            },
            addChange(type) { 
                if (this.validateSelectedLength(1)){ 
                   if(this.selectedRows[0].CompanyROD_id !== null){
                        this.modals[type].visible = true;
                        this.modals[type].loading = true;
                        this.data.ChangeType = this.changeTypes[type];
                        this.selectedData().then(
                            res => {
                                this.modals[type].loading = false;
                                this.modals[type].loading = false;
                            }
                        )
                    }else{
                        this.warningModal.message = 'Following Action is not availaible for selected row';
                        this.showWarningModal(true);
                        this.modals[type].loading = false;
                    } 
                }
            },
            fetchDirector(){
                fetchRODDirector({company_id: this.innerValue.company.id}).then(
                    res => {
                        this.directors = res.data;
                    }
                )
            },
            fetchDirectorType(){
                fetchRODDirectorType().then(
                    res => {
                        this.directorsType = res.data;
                    }
                )
            },
            generateTicket(){
                const { process_id, reference_id } = this.innerValue;
                const data = {
                    process_id,
                    reference_id
                }
                generateProcessTicket(data).then(
                    (res) => {
                        this.modals.ticket.message = res.data[0].TicketReference;
                        this.modals.ticket.visible = true;
                    }
                )
            }
        },
    }
</script>
