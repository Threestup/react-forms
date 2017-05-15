import { FormUpdateEvent } from '../.';

export interface CheckboxValue {
    label: string;
    value: string;
}

export interface ICheckbox {
    disabled:boolean;
    name:string;
    onChange:FormUpdateEvent<ICheckbox>;
    selectedValues:string[];
    values:CheckboxValue[];
    wrapperClassName:string;
}

export type ICheckboxPartial = Partial<ICheckbox>;

const defaultCheckboxConfig:ICheckbox = {
    disabled: false,
    name: '',
    onChange: (newCheckbox:ICheckbox) => null,
    selectedValues: [],
    values: [],
    wrapperClassName: '',
};

export function configureCheckbox(override:ICheckboxPartial = {}):ICheckbox {
    return Object.assign({}, defaultCheckboxConfig, override);
};

export default configureCheckbox;
