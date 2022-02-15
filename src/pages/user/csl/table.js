
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center',
    },
    {
        title: 'Process',
        key: 'processname',
        sortable: true,
        maxWidth: 200
    },
    {
        title: 'Company Name',
        key: 'CompanyName',
        sortable: true,
        minWidth: 100,
    },
    {
        title: 'Status',
        key: 'status',
        width: 150,
        sortable: true,
    },
    {
        title: 'Deadline',
        width: 120,
        render: (h, params) => {
            return h('span', params.row.Deadline ? DateUtil.formatDate(params.row.Deadline) : '');
        },
        sortable: true,
    },
]
