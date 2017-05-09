import { FormUpdateEvent } from '../.';

export interface IOption {
    value:any;
    label:string;
}

export interface ISelect<T = any> {
    disabled:boolean;
    label:string;
    multiple:boolean;
    name:string;
    onUpdate:FormUpdateEvent<ISelect>;
    options:IOption[];
    defaultOptions:IOption[];
    value:string|string[];
    wrapperClassName:string;
    selectData:T; 
}

export type ISelectPartial<T = any> = Partial<ISelect<T>>;

const defaultSelectConfig:ISelect = {
    disabled: false,
    label: '',
    multiple: false,
    name: '',
    onUpdate: (newSelect:ISelect) => null,
    options: [],
    defaultOptions: [],
    value: '',
    wrapperClassName: '',
    selectData: null
};

export function configureSelect<T = any>(override:ISelectPartial<T> = {}):ISelect<T> {
    return Object.assign({}, defaultSelectConfig, override);
};

export default configureSelect;
