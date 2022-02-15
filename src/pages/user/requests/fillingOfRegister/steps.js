import GeneralInfo from  './components/RequestCertificate';
import { Documents } from  'Organisms/documents';

export default [
    {
        id: 1,
        title: 'General Info',
        component: GeneralInfo,
        isActive: true,
    },
    {
        id: 2,
        title: 'Documents',
        component: Documents,
        isActive: false,
        isDisabled: true
    },
]

