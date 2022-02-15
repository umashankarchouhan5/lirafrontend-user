import CommentCell from './components/commentCell'
import DocumentCell from './components/documentCell'
import TicketReferenceLinkCell from './components/TicketReferenceLinkCell'
import DateUtil from 'Utils/dateUtil'

const companyName = {
    title: 'Company Name',
    key: 'CompanyName',
    sortable: true,
    minWidth: 100
    // width: 140
};

const entityType = {
    title: 'Entity Type',
    key: 'EntityType',
    sortable: true,
    width: 140
};

const approvedOn = {
    title: 'Approved On',
    key: 'ApprovedOn',
    sortable: true,
    width: 140,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.ApprovedOn));
    },
};

const expiredOn = {
    title: 'Expiry Date',
    key: 'ExpiryDate',
    sortable: true,
    width: 140,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.ExpiryDate));
    },
};

const status = {
    title: 'Status',
    key: 'Status',
    width: 140,
    sortable: true,
};


const selection = {
    type: 'selection',
    width: 38,
    align: 'center'
};



export default [
    selection,
    // ticketReferenceLink,
    companyName,
    entityType,
    approvedOn,
    expiredOn,
    status
]
