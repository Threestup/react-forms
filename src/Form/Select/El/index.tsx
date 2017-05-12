import { equals, filter, map } from 'ramda';
import * as React from 'react';
import { ISelect, IOption } from '../.';
import { appendToWrapperClass, Update } from '../../Utils';

export interface IProps {
    config:ISelect;
}

export const SelectComponent = (props:IProps) => {
    const {config} = props;

    const getErrorMessageClass = (isValid:boolean, touched:boolean) => {
        let className = 'error-message';

        if (touched && !isValid)
            className += ' show';

        return className;
    };

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

        if (config.multiple)
            value = map((o:any) => o.value, filter((option:any) => option.selected, target.options as any));
        else
            value = target.value;

        config.onUpdate(Update(config, {value}));
    };

    return (
        <div className={appendToWrapperClass(config.wrapperClassName, 'select')}>
            <label htmlFor={config.name}>{config.label}</label>

            <select name={config.name}
                    multiple={config.multiple}
                    onChange={onChange}
                    defaultValue={config.value}
                    disabled={config.disabled}>
                {config.defaultOptions.map(renderOption, config.defaultOptions)}
                {config.options.map(renderOption, config.options)}
            </select>

            <small className={getErrorMessageClass(equals(config.isValid, true), config.touched)}>
                Please select a value
            </small>
        </div>
    );
};

export default SelectComponent;
