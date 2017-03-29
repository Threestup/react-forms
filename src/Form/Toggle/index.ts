import { FormUpdateEvent } from '../.';

export type ToggleValue = 'on' | 'off';

export interface IToggle {
    disabled:boolean;
    label:string;
    name:string;
    onUpdate:FormUpdateEvent<IToggle>;
    value:ToggleValue;
    wrapperClassName:string;
}

export type ITogglePartial = Partial<IToggle>;

const defaultToggleConfig:IToggle = {
    disabled: false,
    label: '',
    name: '',
    onUpdate: (nT:IToggle) => null,
    value: 'off',
    wrapperClassName: '',
};

export const configureToggle = (override:ITogglePartial = {}):IToggle => {
    return Object.assign({}, defaultToggleConfig, override);
};

export default configureToggle;
