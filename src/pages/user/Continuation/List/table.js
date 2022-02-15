import CommentCell from './components/commentCell'
import DocumentCell from './components/documentCell'
import TicketReferenceLinkCell from './components/TicketReferenceLinkCell'
import DateUtil from 'Utils/dateUtil'

const companyName = {
    title: 'Company Name',
    key: 'CompanyName',
    sortable: true,
    minWidth: 120,
    // width: 140
};

const entityType = {
    title: 'Entity Type',
    key: 'EntityType',
    sortable: true,
    width: 110
};

const approvedOn = {
    title: 'Approved On',
    key: 'ApprovedOn',
    sortable: true,
    width: 110,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.ApprovedOn));
    },
};

const expiredOn = {
    title: 'Expiry Date',
    key: 'ExpiryDate',
    sortable: true,
    width: 110,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.ExpiryDate));
    },
};

const ticketReference = {
    title: 'Reference',
    key: 'TicketReference',
    width: 140
};

const ticketReferenceLink = {
    title: 'Reference',
    key: 'TicketReference',
    render: (h, params) => {
        return h(TicketReferenceLinkCell, {
            props: {
                row: params.row
            }
        });
    },
    width: 140
};

const status = {
    title: 'Status',
    key: 'Status',
    width: 150
};

const proposedName = {
    title: 'Proposed Name',
    key: 'ProposedName',
    sortable: true,
};

const foreignName = {
    title: 'Foreign Name',
    key: 'ForeignName',
    sortable: true,
};

const fileName = {
    title: 'File Name',
    render: (h, params) => {
        return h(DocumentCell, {
            props: {
                row: params.row
            }
        });
    },
};

const selection = {
    type: 'selection',
    width: 38,
    align: 'center'
};

const submittedOn = {
    title: 'Submitted On',
    key: 'StatusDate',
    sortable: true,
    render: (h, params) => {
        return h('span', DateUtil.formatDateWithTime(params.row.StatusDate));
    },
};

const comment = {
    title: 'Comment',
    key: 'Comment',
    render: (h, params) => {
        return h(CommentCell, {
            props: {
                row: params.row
            }
        });
    },
};

export default {
    //Pending Payment
    [500]: {
        columns: [
            selection,
            ticketReferenceLink,
            companyName,
            entityType,
            approvedOn,
            expiredOn,
            status,
        ]
    },
    // Approved
    [205]: {
        columns: [
            selection,
            // ticketReferenceLink,
            companyName,
            entityType,
            approvedOn,
            expiredOn,
            status
        ]
    },
    [201]: {
        columns: [
            selection,
            ticketReferenceLink,
            companyName,
            entityType,
            approvedOn,
            expiredOn,
            status
        ]
    },
    [202]: {
        columns: [
            selection,
            ticketReferenceLink,
            companyName,
            entityType,
            approvedOn,
            expiredOn,
            status
        ]
    },
    [203]: {
        columns: [
            selection,
            ticketReferenceLink,
            companyName,
            entityType,
            approvedOn,
            expiredOn,
            status
        ]
    },
    [204]: {
        columns: [
            selection,
            ticketReferenceLink,
            companyName,
            entityType,
            approvedOn,
            expiredOn,
            status
        ]
    },
    [32]: {
        columns: [
            selection,
            ticketReferenceLink,
            companyName,
            entityType,
            approvedOn,
            expiredOn,
            status
        ]
    }
    
};
