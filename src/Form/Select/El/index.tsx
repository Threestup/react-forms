import { filter, map } from 'ramda';
import * as React from 'react';
import { ISelect, IOption } from '../.';
import { appendToWrapperClass, Update } from '../../Utils';

export interface IProps {
    config:ISelect;
}

export const SelectComponent = (props:IProps) => {
    const {name, label, multiple, options, defaultOptions, value, onUpdate, disabled, wrapperClassName} = props.config;

    const renderOption = (option:IOption, index:number) => {
        return (
            <option key={index} value={option.value}>
                {option.label}
            </option>
        );
    };

    const onChange = (e:React.FormEvent<HTMLSelectElement>) => {
        const target = e.target as HTMLSelectElement;

        let value:string|string[] = '';

        if (multiple)
            value = map((o:any) => o.value, filter((option:any) => option.selected, target.options as any));
        else
            value = target.value;

        onUpdate(Update(props.config, {value}));
    };

    return (
        <div className={appendToWrapperClass(wrapperClassName, 'select')}>
            <label htmlFor={name}>{label}</label>

            <select name={name}
                    multiple={multiple}
                    onChange={onChange}
                    defaultValue={value}
                    disabled={disabled}>
                {defaultOptions.map(renderOption, defaultOptions)}
                {options.map(renderOption, options)}
            </select>
        </div>
    );
};

export default SelectComponent;
