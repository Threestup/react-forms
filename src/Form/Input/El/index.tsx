import { equals, gt } from 'ramda';
import * as React from 'react';
import { IInput } from '../.';
import { Form } from '../../.';
import { appendToWrapperClass, Update } from '../../Utils';

interface IProps {
    config:IInput;
}

export interface IState {
    value:string;
    isValid:boolean;
    active:boolean;
    touched:boolean;
}

export class InputComponent extends React.Component<IProps, IState> {
    static getLabelClass(active:boolean, valEmpty:boolean):string {
        return (active || (!active && !valEmpty)) ? 'active' : '';
    }

    static getInputClass(isValid:boolean, touched:boolean, valEmpty:boolean):string {
        let className = '';

        if (touched && !valEmpty)
            className = isValid ? 'valid' : 'invalid';

        return className;
    }

    static getErrorMessageClass(isValid:boolean, touched:boolean):string {
        let className = 'error-message';

        if (touched && !isValid)
            className += ' show';

        return className;
    }

    static defaultErrorMessage     = 'Invalid value';
    static validateTimeout         = 250;
    static validateTimeoutExtended = 750;
           timeout:any;

    constructor(props:IProps) {
        super(props);

        const {value, isValid, touched} = props.config;

        this.state = {
            value,
            isValid,
            active: false,
            touched
        };
    }

    componentWillReceiveProps(nextProps:IProps) {
        let {value, isValid, touched} = nextProps.config;

        touched = touched || gt(value.length, 0) || !equals(this.props.config.value, value);

        if (touched)
            this.setState(Update(this.state, {value, isValid, touched}));
    }

    handleFocus() {
        this.setState(Update(this.state, {active: true}));
    }

    handleBlur() {
        this.validate(this.state.value, true);
    }

    setValue(e:React.FormEvent<HTMLInputElement>) {
        clearTimeout(this.timeout);
        this.timeout = null;

        const value = (e.target as HTMLInputElement).value;

        this.setState(Update(this.state, {value}));

        this.timeout = setTimeout(() => {
            this.validate(value)
        }, this.state.touched ? InputComponent.validateTimeout : InputComponent.validateTimeoutExtended);
    }

    validate(value:string, deactivate:boolean = false) {
        let active = deactivate ? false : this.state.active;

        const newInput = Form.validateInput(Update(this.props.config, {value}));

        this.setState(Update(this.state, {
            active,
            isValid: newInput.isValid,
            touched: true
        }));

        this.props.config.onUpdate(newInput);
    }

    getElement() {
        const {value, isValid, touched}     = this.state;
        const {type, name, placeholder, disabled} = this.props.config;

        return equals(type, 'textarea') ? (
                <textarea className={InputComponent.getInputClass(isValid, touched, equals(value.length, 0))}
                          value={value} placeholder={placeholder} disabled={disabled} name={name}
                          onFocus={() => this.handleFocus()}
                          onBlur={() => this.handleBlur()}
                          onChange={this.setValue.bind(this)}/>
            ) : (
                <input className={InputComponent.getInputClass(isValid, touched, equals(value.length, 0))}
                       type={type} value={value} placeholder={placeholder} disabled={disabled} name={name}
                       onFocus={() => this.handleFocus()}
                       onBlur={() => this.handleBlur()}
                       onChange={this.setValue.bind(this)}/>
            );
    }

    render() {
        const {value, active, touched} = this.state;

        const {name, label, wrapperClassName, errorMessage, contextErrorMessage, errors, contextErrors} = this.props.config;

        return (
            <div className={appendToWrapperClass(wrapperClassName)}>
                <label htmlFor={name} className={InputComponent.getLabelClass(active, equals(value.length, 0))}>
                    {label}
                </label>

                {this.getElement()}

                <small className={InputComponent.getErrorMessageClass(equals(errors.length, 0), touched)}>
                    {gt(errorMessage.length, 0) ? errorMessage : InputComponent.defaultErrorMessage}
                </small>

                <small className={InputComponent.getErrorMessageClass(equals(contextErrors.length, 0), touched)}>
                    {gt(contextErrorMessage.length, 0) ? contextErrorMessage : InputComponent.defaultErrorMessage}
                </small>
            </div>
        );
    }
}

export default InputComponent;
