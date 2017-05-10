import * as React from 'react';
import { IRadio, RadioValue } from '../index'
import { appendToWrapperClass, Update } from '../../Utils';

export interface IProps {
    config:IRadio;
}

export class RadioComponent extends React.Component<IProps, {}> {

    static onClick (v:string, conf:IRadio) {
        const newSelectedValue = (v === conf.selectedValue) ? undefined : v
        conf.onClick(Update(conf, { selectedValue: newSelectedValue }));
    }

    render () {
        const { config } = this.props;

        return (
            <ul className={appendToWrapperClass(config.wrapperClassName, 'radio')}>
                {config.values.map((_:RadioValue) => (
                    <li>
                        <input
                            type="radio"
                            disabled={config.disabled}
                            id={_.value}
                            onClick={e => RadioComponent.onClick(_.value, config)}
                            value={_.value}
                            name={config.name}
                            checked={_.value === config.selectedValue}
                        />
                        <label htmlFor={_.value}>{_.label}</label>
                    </li>
                ))
                }
            </ul>
        );
    }
}

export default RadioComponent;
