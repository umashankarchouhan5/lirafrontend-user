
import DateUtil from 'Utils/dateUtil'

const selection = {
    type: 'selection',
    width: 38,
    align: 'center'
};

const companyName = {
    title: 'Company Name',
    key: 'CompanyName',
    sortable: true,
};

const entityType = {
    title: 'Entity Type',
    key: 'EntityType',
    sortable: true,
    width: 110
};

const status = {
    title: 'Status',
    key: 'status',
};


const submittedOn = {
    title: 'Submitted On',
    key: 'StatusDate',
    sortable: true,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.StatusDate));
    },
    width: 130
};


export default {
    // Approved
    [501]: {
        columns: [
            // ticketReferenceLink,
            selection,
            companyName,
            entityType,
            submittedOn,
            status,
        ]
    },
    
};
