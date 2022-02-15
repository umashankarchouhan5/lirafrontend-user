
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center'
    },
    {
        title: 'License Type',
        key: 'licenseType',
        width: 100,
    },
    {
        title: 'Company Name',
        key: 'companyName',
    },
    {
        title: "Year",
        key: 'year',
        width: 60,
    },
    {
        title: "Status",
        key: 'Status',
        width: 140,
    },
    {
        title: 'Status Date',
        width: 100,
        render: (h, params) => {
            return h('span', params.row.statusDate ? DateUtil.formatDate(params.row.statusDate) : '');
        },
    },
    {
        title: "Deadline",
        render: (h, params) => {
            return h('span', params.row.nextDueDate ? DateUtil.formatDate(params.row.nextDueDate) : '');
        },
        width: 100,
    },
]
