import { FormUpdateEvent } from '../.';

export type ContextRule = (value:string) => boolean;
export type InputType = 'text' | 'email' | 'password' | 'date' | 'time' | 'textarea';

export interface IInput<T = any> {
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
    inputData:T;
}

export type IInputPartial<T = any> = Partial<IInput<T>>;

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
    inputData: null
};

export function configureInput<T = any>(override:IInputPartial<T> = {}):IInput<T> {
    return Object.assign({}, defaultInputConfig, override);
};

export default configureInput;
