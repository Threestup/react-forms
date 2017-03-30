import * as React from 'react'
import CreatePasswordForm from './Form'
import { InputComponent } from '../..'

export interface IState {
    form:CreatePasswordForm;
}

export class CreatePasswordView extends React.Component<{}, IState> {
    constructor() {
        super();

        this.state = {
            form: new CreatePasswordForm(this.setState.bind(this))
                .validateInputs()
                .validateForm()
        }
    }

    onSubmit(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        this.state.form.submit(() => {
            console.log(this.state.form.serialize());
        });
    }

    render() {
        const
            EmailInput    = this.state.form.getInputByName('email'),
            PasswordInput = this.state.form.getInputByName('password'),
            SignInButton  = this.state.form.getButtonByName('submit');

        return (
            <form>
                <InputComponent config={EmailInput}/>
                <InputComponent config={PasswordInput}/>

                <button className={SignInButton.className}
                        disabled={!this.state.form.isValid}
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.onSubmit(e)}>
                    {SignInButton.text}
                </button>
            </form>
        );
    }
}

export default CreatePasswordView;
