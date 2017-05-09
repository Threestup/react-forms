import { FormUpdateEvent } from '../.';

export interface IOption {
    value:any;
    label:string;
}

export interface ISelect {
    disabled:boolean;
    label:string;
    multiple:boolean;
    name:string;
    onUpdate:FormUpdateEvent<ISelect>;
    options:IOption[];
    defaultOptions:IOption[];
    value:string|string[];
    wrapperClassName:string;
}

export type ISelectPartial = Partial<ISelect>;

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
};

export const configureSelect = (override:ISelectPartial = {}):ISelect => {
    return Object.assign({}, defaultSelectConfig, override);
};

export default configureSelect;
