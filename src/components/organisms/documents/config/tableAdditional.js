import UploadCell from 'Molecules/tableCells/UploadCell';
import DateCell from 'Molecules/tableCells/DateCell';
import SaveButtonCell from 'Molecules/tableCells/SaveButtonCell';
import DocumentBriefCell from 'Molecules/tableCells/DocumentBriefCell';
import DateUtil from 'Utils/dateUtil';
import UploadDateCell from 'Molecules/tableCells/uploadDateCell'

export default function() {

    const instance = this;
    return [
        {
            title: 'S.No.',
            type: 'index',
            width: 50,
            align: 'center'
        },
        {
            title: 'Additional Document Details',
            key: 'documentBrief',
            // width: 500,
            render: (h, params) => {
                return h('div', [
                    h(DocumentBriefCell, {
                        props: {
                            row: params.row,
                            readonly: instance.readonly,
                            onChange: instance.onBriefChange
                        }
                    }),
                ]);
            },
            minWidth: 100,
        },
        {
            title: 'Document Date',
            width: 150,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h(DateCell, {
                        props: {
                            row: params.row,
                            readonly: instance.readonly,
                            required: (!!params.row.isDateRequired === 1 && !!params.row.file),
                            onDateChange: instance.onDateChange,
                        }
                    }),
                ]);
            }
        },
        {
            title: 'Upload Date',
            width: 120,
            render: (h, params) => {
                return h(UploadDateCell,{ 
                    props:{
                        uploadDate:params.row.UploadDate ? DateUtil.formatDate(params.row.UploadDate) : ''
                    }
                });
            }
        },
        {
            title: 'Document',
            width: 300,
            render: (h, params) => {
                return h('div', [
                    h(UploadCell, {
                        props: {
                            row: params.row,
                            readonly: instance.readonly,
                            onChange: instance.onFileChange
                        }
                    }),
                ]);
            }
        },
        {
            width: 80,
            title: 'Action',
            align: 'center',
            render: (h, params) => {
                return h(SaveButtonCell, {
                    props: {
                        row: params.row,
                        index: params.index,
                        readonly: instance.readonly,
                        onSaveDocument: instance.onSaveDocument,
                        onAddDocument: instance.onAddDocument,
                        onRemoveDocument: instance.onRemoveDocument,
                        documents: instance.documents.additional,
                        onChangeDocument: instance.onChangeDocument
                    }
                }, 'Save');
            }
        }
    ]
};



