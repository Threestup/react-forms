import { equals } from 'ramda';
import { Form, ElementType, configureButton, configureInput, IInput } from '../..'

export interface CreatePasswordFormSerialized {
    password:string;
}

export class CreatePasswordForm extends Form {
    constructor(setState:(newState:any) => void) {
        super(setState);

        this.inputs.push(configureInput({
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            onUpdate: (i:IInput) => this.updateElement(i, ElementType.Input),
            rules: ['required', 'isLength:6'],
            errorMessage: 'Password has to be at least 6 characters long'
        }));

        this.inputs.push(configureInput({
            name: 'confirmPassword',
            type: 'password',
            placeholder: 'Confirm Password',
            onUpdate: (i:IInput) => this.updateElement(i, ElementType.Input),
            contextRules: [(val:string) => this.ensureSamePassword(val)],
            contextErrorMessage: 'Passwords don\'t match'
        }));

        this.buttons.push(configureButton({
            name: 'submit',
            className: 'button',
            text: 'Confirm'
        }));
    }

    ensureSamePassword(val:string) {
        return equals(val, this.getInputByName('confirmPassword').value)
    }

    serialize():CreatePasswordFormSerialized {
        return {
            password: this.getInputByName('confirmPassword').value,
        }
    }
}

export default CreatePasswordForm;
