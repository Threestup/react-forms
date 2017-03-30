# Advanced React Forms

[![CircleCI](https://circleci.com/gh/Threestup/react-forms.svg?style=svg)](https://circleci.com/gh/Threestup/react-forms)

**NOTE:** Only works with TypeScript 2.1+. Enabling `strictNullChecks` is strongly recommended.

## Install

```
yarn add tsp-react-forms
```

## Basic Usage

```typescript
import { Form, ElementType, configureButton, configureInput, IInput } from 'tsp-react-forms'

export interface SignInFormSerialized {
    email:string;
    password:string;
}

class SignInForm extends Form {
    constructor(onSubmit:(e:any) => void, setState:(newState:any) => void) {
        super(setState);

        this.inputs.push(configureInput({
            name: 'EmailInput',
            type: 'email',
            placeholder: 'Email',
            onUpdate: (i:IInput) => this.updateElement(i, ElementType.Input),
            rules: ['required', 'isEmail'],
            errorMessage: 'Not a valid email'
        }));

        this.inputs.push(configureInput({
            name: 'PasswordInput',
            type: 'password',
            placeholder: 'Password',
            onUpdate: (i:IInput) => this.updateElement(i, ElementType.Input),
            rules: ['required', 'isLength:6'],
            errorMessage: 'Password has to be at least 6 characters'
        }));

        this.buttons.push(configureButton({
            name: 'SignInButton',
            className: 'button',
            text: 'Sign In',
            onClick: onSubmit
        }));
    }

    serialize():SignInFormSerialized {
        return {
            email: this.getInputByName('EmailInput').value,
            password: this.getInputByName('PasswordInput').value,
        }
    }
}

export default SignInForm;
```

```typescript
import * as React from 'react'
import { Input } from 'tsp-react-forms'
import SignInForm from './Form'

class SignInView extends React.Component<{}, {}> {
    form = new SignInForm(this.onSubmit.bind(this), this.setState.bind(this))
        .validateInputs()
        .validateForm();

    onSubmit(e:React.MouseEvent) {
        e.preventDefault();

        this.form.submit(() => {
            console.log(this.form.serialize());
        });
    }

    render() {
        const
            EmailInput    = this.form.getInputByName('EmailInput'),
            PasswordInput = this.form.getInputByName('PasswordInput'),
            SignInButton  = this.form.getButtonByName('SignInButton');

        return (
            <form>
                <Input config={EmailInput}/>
                <Input config={PasswordInput}/>

                <button className={SignInButton.className}
                        disabled={!this.form.isValid}
                        onClick={SignInButton.onClick}>
                    {SignInButton.text}
                </button>
            </form>
        );
    }
}

export default SignInView;
```
