
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center',
    },
    {
        title: 'Ticket Reference',
        key: 'TicketReference',
        sortable: true,
        width: 150
    },
    {
        title: 'Process',
        key: 'processName',
        maxWidth: 200,
        minWidth: 80,
    },
    {
        title: 'Entity Type',
        key: 'entityType',
        width: 100,
    },
    {
        title: 'Entity Name',
        key: 'companyName',
        minWidth: 100,
    },
    {
        title: 'Due Date',
        width: 100,
        key: 'DueDate',
        render: (h, params) => {
            return h('span', params.row.DueDate !== null ? DateUtil.formatDate(params.row.DueDate) : '');
        },
    },
]
