<template>
    <div>
        <Breadcrumbs />
        <PageTitle title="UI Kit" />
        <h3>Buttons</h3>
        <FormRow>
            <ButtonGroup>
                <FormButton type="primary">Button Primary</FormButton>
                <FormButton type="info">Button Info</FormButton>
            </ButtonGroup>
        </FormRow>
        <FormRow>
            <div class="col-sm-2">
                <InputText label="Text Input Required" v-model="textInput" required />
            </div>
            <div class="col-sm-2">
                <InputText label="Text Input" v-model="textInput" />
            </div>
            <div class="col-sm-2">
                <InputDate label="Date" />
            </div>
            <div class="col-sm-2">
                <InputDate label="Date Range" type="daterange"  />
            </div>
            <div class="col-sm-2">
                <FormSelect label="Simple select" :items="['Item 1', 'Item 2', 'Item 3', 'Item 4']"></FormSelect>
            </div>
            <div class="col-sm-2">
                <InputFile required label="File select" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-2">
                <FormButton type="info" @click="() => openPopup('common')">Open Info Popup</FormButton>
                <Popup title="Info" :value="modal.common" @close="() => closePopup('common')"></Popup>
            </div>
            <div class="col-sm-3">
                <FormButton type="primary" @click="() => openPopup('width')">Open Popup Custom Width</FormButton>
                <Popup width="600" :value="modal.width" @close="() => closePopup('width')"></Popup>
            </div>
            <div class="col-sm-2">
                <FormButton type="primary" @click="() => openPopup('warning')">Open Warning Popup</FormButton>
                <Popup title="Warning" type="warning" :value="modal.warning" @close="() => closePopup('warning')"></Popup>
            </div>
            <div class="col-sm-2">
                <FormButton type="primary" @click="() => openPopup('error')">Open Error Popup</FormButton>
                <Popup title="Error" type="error" :value="modal.error" @close="() => closePopup('error')"></Popup>
            </div>
        </FormRow>

        <DataTable :data="tableData" :columns="tableConfig">
            <template slot="actionsLeft">
                <TableButton>
                    <img src="../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton>
                    <img src="../../../assets/images/edit.png" alt="">
                    Edit
                </TableButton>
                <TableButton>
                    <img src="../../../assets/images/del.png" alt="">
                    Delete
                </TableButton>
            </template>
            <template slot="actionsRight">
                <TableButton>
                    <img src="../../../assets/images/submit.png" alt="">
                    Submit
                </TableButton>
                <TableButton>
                    <img src="../../../assets/images/upload.png" alt="">
                    Upload
                </TableButton>
            </template>
        </DataTable>
    </div>
</template>

<script>

    import Breadcrumbs from 'Components/Breadcrumbs'
    import PageTitle from 'Components/layout/PageTitle'
    import InputDate from 'Components/form/InputDate'
    import DataTable from 'Components/DataTable'
    import { tableConfig, tableData } from './testMock'

    export default {
        name: "UIKit",
        data() {
            return {
                tableConfig,
                tableData,
                textInput: 'Text Input',
                modal: {
                    common: false,
                    warning: false,
                    error: false,
                    width: false,
                },
            }
        },
        components: {
            Breadcrumbs,
            PageTitle,
            InputDate,
            DataTable
        },
        methods: {
            openPopup(type) {
                this.modal[type] = true
            },
            closePopup(type) {
                this.modal[type] = false
            }
        }
    }
</script>

<style>

</style>