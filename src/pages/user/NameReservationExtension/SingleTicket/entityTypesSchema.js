import steps from './steps'

const { all, initial } = steps;

export default {
    Foundation: {
        title: {
            103: 'Foundation Registration',
            105: 'Foundation Continuation'
        },
        steps: {
            default: all,
        },
        fields: {
            currency: false,
            continuations: {
                103: false,
                105: true
            }
        },
        labels: {
            105: {
                continuationDate: 'Registration Date'
            }
        }
    },
    Trust: {
        title: {
            103: 'Trust Registration',
        },
        steps: {
            default: all,
        },
        fields: {
            currency: false,
            continuations: {
                103: false,
                105: false
            }
        },
    },
    IBC: {
        title: {
            103: 'IBC Incorporation',
            105: 'IBC Continuation'
        },
        steps: {
            205: initial,
            201: initial,
            default: all,
        },
        fields: {
            currency: true,
            continuations: {
                103: false,
                105: true
            }
        },
        labels: {
            105: {
                continuationDate: 'Original Incorporation Date'
            }
        },
        limitedByRequired: true
    },
    LP: {
        title: {
            103: 'Limited Partnership Registration',
            105: 'Limited Partnership Continuation'
        },
        steps: {
            205: initial,
            201: initial,
            default: all,
        },
        fields: {
            currency: true,
            continuations: {
                103: false,
                105: true
            }
        },
        labels: {
            105: {
                continuationDate: 'Original Incorporation Date'
            }
        }
    },
}

