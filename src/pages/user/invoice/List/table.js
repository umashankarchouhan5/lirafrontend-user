import DateUtil from 'Utils/dateUtil'

export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'Invoice Number',
        key: 'InvoiceNumber',
        width: 150,
        sortable: true
    },
    {
        title: 'Company Name',
        key: 'companyName',
        sortable: true,
        maxWidth: 300,
    },
    {
        title: 'Process Name',
        key: 'processName',
        sortable: true
    },
    {
        title: 'Amount',
        key: 'fee',
        width: 100,
        sortable: true
    },
    {
        title: 'Invoice Date',
        key: 'InvoiceDate',
        width: 110,
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.invoiceDate));
        },
    },
    {
        title: 'Status',
        key: 'StatusDescription',
        width: 120,
        sortable: true
    }
]
