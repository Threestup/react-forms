import { contains, remove } from 'ramda';
import * as React from 'react';
import { ICheckbox } from '../index';
import { appendToWrapperClass, Update } from '../../Utils';

export interface IProps {
    config:ICheckbox;
}

export class CheckboxComponent extends React.Component<IProps, {}> {

    static onClick(v: string, conf: ICheckbox) {
        let newSelectedValues = [...conf.selectedValues];

        if (contains(v, newSelectedValues)) {
            const index = newSelectedValues.indexOf(v);
            newSelectedValues = remove(index, 1, newSelectedValues);
        } else {
            newSelectedValues.push(v);
        }

        conf.onClick(Update(conf, {selectedValues: newSelectedValues}));
    }

    render() {
        const { config } = this.props;

        return (
            <ul className={appendToWrapperClass(config.wrapperClassName, 'checkbox')}>
                {config.values.map(_ => (
                  <li>
                      <input type="checkbox" disabled={config.disabled} id={_.value}
                             onClick={e => CheckboxComponent.onClick(_.value, config)}
                             value={_.value}
                             name={config.name}
                             checked={contains(_.value, config.selectedValues)}/>

                      <label htmlFor={_.value}>{_.label}</label>
                  </li>
                ))
                }
            </ul>
        );
    }
}

export default CheckboxComponent;
