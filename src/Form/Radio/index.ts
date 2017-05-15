import { FormUpdateEvent } from '../.';


export interface RadioValue {
    label:string;
    value:string;
}

export interface IRadio {
    disabled:boolean;
    name:string;
    onChange:FormUpdateEvent<IRadio>;
    selectedValue:string;
    values:RadioValue[];
    wrapperClassName:string;
}

export type IRadioPartial = Partial<IRadio>;

const defaultRadioConfig:IRadio = {
    disabled: false,
    name: '',
    onChange: (newRadio:IRadio) => null,
    selectedValue: '',
    values: [],
    wrapperClassName: '',
};

export function configureRadio (override:IRadioPartial = {}):IRadio {
    return Object.assign({}, defaultRadioConfig, override);
};

export default configureRadio;
