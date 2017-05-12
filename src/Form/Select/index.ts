import { FormUpdateEvent } from '../.';

export interface IOption {
    value:any;
    label:string;
}

export interface ISelect<T = any> {
    defaultOptions:IOption[];
    disabled:boolean;
    label:string;
    multiple:boolean;
    name:string;
    onUpdate:FormUpdateEvent<ISelect>;
    options:IOption[];
    required:boolean;
    selectData:T;
    touched:boolean;
    valid:boolean;
    value:string|string[];
    wrapperClassName:string;
}

export type ISelectPartial<T = any> = Partial<ISelect<T>>;

const defaultSelectConfig:ISelect = {
    defaultOptions: [],
    disabled: false,
    label: '',
    multiple: false,
    name: '',
    onUpdate: (newSelect:ISelect) => null,
    options: [],
    required: false,
    selectData: null,
    touched: false,
    valid: true,
    value: '',
    wrapperClassName: ''
};

export function configureSelect<T = any>(override:ISelectPartial<T> = {}):ISelect<T> {
    return Object.assign({}, defaultSelectConfig, override);
};

export default configureSelect;
