import {
    PersonalDetail,
    ProposedRole,
    Qualifications,
    CareerHistory,
    CivilDisciplinary,
    DisclosureConflict,
    Declaration,
} from '../../PQ/single/components'

import { Documents } from 'Organisms/documents'

export default [
    {
        id: 1,
        title: 'Personal Detail',
        component: PersonalDetail,
        isActive: false
    },
    {
        id: 2,
        title: 'Proposed Role',
        component: ProposedRole,
        isActive: false,
        isDisabled: true
    },
    {
        id: 3,
        title: 'Qualifications',
        component: Qualifications,
        isActive: false,
        isDisabled: true
    },
    {
        id: 4,
        title: 'Career History',
        component: CareerHistory,
        isActive: false,
        isDisabled: true
    },
    {
        id: 5,
        title: 'Civil and Disciplinary',
        component: CivilDisciplinary,
        isActive: false,
        isDisabled: true
    },
    {
        id: 6,
        title: 'Disclosure of Conflict',
        component: DisclosureConflict,
        isActive: false,
        isDisabled: true
    },
    {
        id: 7,
        title: 'Documents',
        component: Documents,
        isActive: false,
        isDisabled: true
    },
    {
        id: 8,
        title: 'Declaration',
        component: Declaration,
        isActive: false,
        isDisabled: true
    },
];
