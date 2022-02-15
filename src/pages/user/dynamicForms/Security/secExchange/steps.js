import {
    GeneralInfo,
    CompanyInfo
} from '../../components';

import Payments from 'Components/layout/user/payment/Payments'

import { Documents } from 'Organisms/documents'

const steps = [
    {
        id: 1,
        title: 'General Info',
        isActive: true,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Company Persons',
        isActive: false,
        component: CompanyInfo,
        isDisabled: true
    },

    {
        id: 3,
        title: 'Documents',
        isActive: false,
        component: Documents,
        isDisabled: true
    },
    
    {
        id: 4,
        title: 'Payments',
        component: Payments,
        isActive: false,
        isDisabled: true
    }
];

export default steps;