import { ValidationProvider } from "vee-validate";
import valueMixin from 'Mixins/valueMixin'

export default {
    mixins: [valueMixin],
    computed: {
        isRequired() {
            if (typeof this.rules === 'string') {
                return this.rules.indexOf('required') !== -1;
            }
            if (this.rules && typeof this.rules === 'object') {
                return this.rules.required;
            }
        }
    },
    components: {
        ValidationProvider
    },
    props: {
        vid: String,
        rules: {
            type: [Object, String],
            default: ""
        },
    }
}


