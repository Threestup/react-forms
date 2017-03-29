import { equals } from 'ramda';
import * as React from 'react';
import { IToggle } from '../.';
import { appendToWrapperClass, Update } from '../../Utils';

interface IProps {
    config:IToggle;
}

export const ToggleComponent = (props:IProps) => {
    const {name, value, label, disabled, wrapperClassName, onUpdate} = props.config;

    const onClick = () => {
        if (disabled)
            return;

        const newValue = equals(value, 'on') ? 'off' : 'on';

        onUpdate(Update(props.config, {value: newValue}));
    };

    const getClassName = () => {
        let className = 'toggle';

        if (equals(value, 'on'))
            className = className + ' active';

        if (disabled)
            className = className + ' disabled';

        return className;
    };

    return (
        <div className={appendToWrapperClass(wrapperClassName, 'toggle')}>
            <ul className={getClassName()} onClick={onClick}>
                <li/>
            </ul>

            <label htmlFor={name}>
                {label}
            </label>
        </div>
    );
};

export default ToggleComponent;
