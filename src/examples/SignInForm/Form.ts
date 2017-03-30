import { Form, ElementType, configureButton, configureInput, IInput } from '../..'

export interface SignInFormSerialized {
    email:string;
    password:string;
}

export class SignInForm extends Form {
    constructor(setState:(newState:any) => void) {
        super(setState);

        this.inputs.push(configureInput({
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            onUpdate: (i:IInput) => this.updateElement(i, ElementType.Input),
            rules: ['required', 'isEmail'],
            errorMessage: 'Not a valid email'
        }));

        this.inputs.push(configureInput({
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            onUpdate: (i:IInput) => this.updateElement(i, ElementType.Input),
            rules: ['required', 'isLength:6'],
            errorMessage: 'Password has to be at least 6 characters'
        }));

        this.buttons.push(configureButton({
            name: 'submit',
            className: 'button',
            text: 'Sign In'
        }));
    }

    serialize():SignInFormSerialized {
        return {
            email: this.getInputByName('email').value,
            password: this.getInputByName('password').value,
        }
    }
}

export default SignInForm;
