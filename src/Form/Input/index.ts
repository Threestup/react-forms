import { FormUpdateEvent } from '../.';

export type ContextRule = (value:string) => boolean;
export type InputType = 'text' | 'email' | 'password' | 'date' | 'time' | 'textarea';

export interface IInput {
    contextRules:ContextRule[];
    contextErrors:string[];
    contextErrorMessage:string;
    disabled:boolean;
    errors:string[];
    errorMessage:string;
    isValid:boolean;
    label:string;
    name:string;
    onUpdate:FormUpdateEvent<IInput>;
    placeholder:string;
    rules:string[];
    touched:boolean;
    type:InputType;
    value:string;
    wrapperClassName:string;
}

export type IInputPartial = Partial<IInput>;

const defaultInputConfig:IInput = {
    contextRules: [],
    contextErrors: [],
    contextErrorMessage: 'There has been an error',
    disabled: false,
    errors: [],
    errorMessage: 'There has been an error',
    isValid: true,
    label: '',
    name: '',
    onUpdate: (newInput:IInput) => null,
    placeholder: '',
    rules: [],
    touched: false,
    type: 'text',
    value: '',
    wrapperClassName: '',
};

export const configureInput = (override:IInputPartial = {}):IInput => {
    return Object.assign({}, defaultInputConfig, override);
};

export default configureInput;
