import {
    GeneralInfo,
    CompanyInfo
} from '../components';

import Payments from 'Components/layout/user/payment/Payments'

import { Documents } from 'Organisms/documents'

const steps = [
    {
        id: 1,
        title: 'Primary Details',
        isActive: true,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'General Info',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    {
        id: 3,
        title: 'Disciplinary',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    
    {
        id: 4,
        title: 'Managerial Staff',
        isActive: false,
        component: CompanyInfo,
        isDisabled: true
    },
    
    {
        id: 5,
        title: 'Shareholders',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    
    {
        id: 6,
        title: 'Documents',
        isActive: false,
        component: Documents,
        isDisabled: true
    },
    
    {
        id: 7,
        title: 'Payments',
        component: Payments,
        isActive: false,
        isDisabled: true
    }
];

export default steps;