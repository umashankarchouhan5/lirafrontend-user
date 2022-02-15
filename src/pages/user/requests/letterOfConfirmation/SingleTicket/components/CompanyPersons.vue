<template>
    <div>
        <DataTable :actions="true"
                   :data="tableData"
                   :columns="tableColumns">
            <template slot="actionsLeft" v-if="!readonly">
                <TableButton @click="add">
                    <img src="../../../../../../assets/images/plus.png">
                    Appointment
                </TableButton>
                <TableButton @click="() => addChange('cessation')">
                    <img src="../../../../../../assets/images/cessation.png">
                    Cessation
                </TableButton>
                <TableButton @click="() => addChange('changeName')">
                    <img src="../../../../../../assets/images/changes.png">
                    Change Name
                </TableButton>
                <TableButton @click="() => addChange('changeAddress')">
                    <img src="../../../../../../assets/images/changes.png">
                    Change Address
                </TableButton>
            </template>
        </DataTable>

        <Popup :value="modals.appointment.visible" @close="() => cancel('appointment')" title="Councillor Appointment">
            <Loader v-if="modals.appointment.loading"/>
            <FormRow>
                <div class="col-sm-4">
                    <Salutation v-model="data.Salutation"/>
                </div>
                <div class="col-sm-4">
                    <InputText label="First Name" v-model="data.Fname"/>
                </div>
                <div class="col-sm-4">
                    <InputText label="Last Name" v-model="data.Lname"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Address" v-model="data.Address_id"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputDate label="Date of Appointment" :options="dateOptions" v-model="data.EffectiveDate"/>
                </div>
            </FormRow>
            <ButtonGroup slot="footer">
                <FormButton @click="() => saveData('appointment')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('appointment')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.cessation.visible" @close="() => cancel('cessation')" title="Cessation of a Councillor">
            <Loader v-if="modals.cessation.loading"/>
            <FormRow>
                <div class="col-sm-12">
                    <FormSelect :items="peopleList"
                                item-value="person_id"
                                item-name="Name"
                                v-model="data.person_id"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Address" readonly :value="currentAddressId" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputDate :options="dateOptions" label="Date of Cessation" v-model="data.EffectiveDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Reason of resignation" v-model="data.ResignationReason"/>
                </div>
            </FormRow>
            <ButtonGroup slot="footer">
                <FormButton @click="() => saveData('cessation')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('cessation')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.changeName.visible" @close="() => cancel('changeName')"
               title="Change of Name of a Councillor">
            <Loader v-if="modals.changeName.loading" />
            <FormRow>
                <div class="col-sm-12">
                    <FormSelect :items="peopleList"
                                item-value="person_id"
                                item-name="Name"
                                v-model="data.person_id"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <Salutation v-model="data.Salutation"/>
                </div>
                <div class="col-sm-4">
                    <InputText label="First Name" v-model="data.Fname"/>
                </div>
                <div class="col-sm-4">
                    <InputText label="Last Name" v-model="data.Lname"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Address" readonly :value="currentAddressId" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputDate label="Date of Change" :options="dateOptions" v-model="data.EffectiveDate"/>
                </div>
            </FormRow>
            <ButtonGroup slot="footer">
                <FormButton type="success" @click="() => saveData('changeName')">Save</FormButton>
                <FormButton @click="() => cancel('changeName')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.changeAddress.visible" @close="() => cancel('changeAddress')"
               title="Change of Address of a Councillor">
            <Loader v-if="modals.changeAddress.loading" />
            <FormRow>
                <div class="col-sm-12">
                    <FormSelect :items="peopleList"
                                item-value="person_id"
                                item-name="Name"
                                v-model="data.person_id"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="New Address" v-model="data.Address_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Old Address" readonly :value="currentAddressId" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputDate :options="dateOptions" label="Date of Change" v-model="data.EffectiveDate"/>
                </div>
            </FormRow>
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
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import AddressInput from 'Components/form/addressInput/AddressInput'
    import InputDate from 'Components/form/InputDate';
    import DateUtil from 'Utils/dateUtil';
    import valueMixin from 'Mixins/valueMixin';
    import { getchangePeopleRequestList, changePeople, getPeople } from '../api';
    import Salutation from "Components/layout/salutation";

    export default {
        name: "CompanyPersons",
        mixins: [valueMixin],
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
                    Salutation: '',
                    Fname: '',
                    Lname: '',
                    Address_id: null,
                    EffectiveDate: '',
                    ResignationReason: ''
                },
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: [],
                tableColumns: [
                    {
                        title: 'Name',
                        key: 'Name',
                    },
                    {
                        title: 'Change Action',
                        key: 'ChangeAction',
                        width: 180
                    },
                    {
                        title: 'Effective Date',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.effectivedate));
                        },
                        align: 'left',
                        width: 180
                    }
                ]
            }
        },
        computed: {
            currentAddressId() {
                return this.data.person_id ? this.peopleList.find(item => item.person_id === this.data.person_id).Address_id : ''
            }
        },
        components: {
            InputDate,
            DataTable,
            AddressInput,
            Salutation
        },
        props: {
            value: Object,
            readonly: Boolean 
        },
        created() {
            this.getPeopleHandler()
        },
        methods: {
            getPeopleHandler() {
                getchangePeopleRequestList({
                    Company_id: this.innerValue.Company_id,
                    process_id: this.innerValue.process_id,
                    reference_id: this.innerValue.reference_id
                }).then(res => {
                    this.tableData = res.data;
                })
            },
            resetData() {
                this.data = {
                    ChangeType: null,
                    Salutation: '',
                    Fname: '',
                    Lname: '',
                    Address_id: null,
                    EffectiveDate: '',
                    ResignationReason: ''
                };
            },
            saveData(type) {
                this.modals[type].loading = true;
                changePeople({
                    ...this.data,
                    Company_id: this.innerValue.Company_id,
                    process_id: this.innerValue.process_id,
                    reference_id: this.innerValue.reference_id
                }).then(res => {
                    this.innerValue.reference_id = res.data[0].reference_id;
                    this.modals[type].loading = false;
                    this.resetData();
                    this.modals.success.visible = true;
                    this.modals[type].visible = false;
                    this.getPeopleHandler();
                }).catch(() => {
                    this.modals[type].loading = false;
                })
            },
            cancel(type) {
                this.modals[type].visible = false;
                this.resetData();
            },
            add() {
                this.data.ChangeType = this.changeTypes.appointment;
                this.modals.appointment.visible = true;
            },
            addChange(type) {
                this.modals[type].visible = true;
                this.modals[type].loading = true;
                this.data.ChangeType = this.changeTypes[type];
                getPeople({
                    Company_id: this.innerValue.Company_id
                }).then(res => {
                    this.modals[type].loading = false;
                    this.modals[type].loading = false;
                    this.peopleList = res.data;
                }).catch(() => {
                    this.modals[type].loading = false;
                })
            }
        }
    }
</script>
