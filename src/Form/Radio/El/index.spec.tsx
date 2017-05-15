import 'jsdom-global/register';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import RadioComponent from '.';
import { configureRadio, IRadio } from '../.';
import * as FormUtils from '../../Utils';

const renderComponent = (config = configureRadio()) => {
    return shallow(<RadioComponent config={config} />);
};

describe('Radio/El', () => {
    let sandbox:any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('onChange', () => {
        it('should change selectedValue to new value if the clecked value is not equal', () => {
            let updatedRadio:IRadio | null = null;

            const onChange = (nR:IRadio) => updatedRadio = nR;
            const selectedValue = 'Tarte';
            const config = configureRadio({ onChange, selectedValue });

            const val = 'a';
            RadioComponent.onChange(val, config);

            expect(updatedRadio!.selectedValue).to.equal(val);
        });

        it('should change selectedValue to undefined if changed value is the same', () => {
            let updatedRadio:IRadio | null = null;

            const onChange = (nR:IRadio) => updatedRadio = nR;
            const selectedValue = 'Pie';
            const config = configureRadio({ onChange, selectedValue });

            const val = 'Pie';
            RadioComponent.onChange(val, config);

            expect(updatedRadio!.selectedValue).to.equal(undefined);
        });
    });

    describe('UI', () => {
        describe('Wrapper', () => {
            it('calls appendToWrapperClass() with correct parameters', () => {
                const appendToWrapperClass = sandbox.spy(FormUtils, 'appendToWrapperClass');
                const config = configureRadio({ wrapperClassName: 'test-class' });
                renderComponent(config);
                expect(appendToWrapperClass.calledWith('test-class'))
                    .to.equal(true);
            });

            it('assigns correct class through getWrapperClass()', () => {
                const appendToWrapperClass = sandbox.stub(FormUtils, 'appendToWrapperClass')
                    .returns('TestClassName');

                const subject = renderComponent().find('ul').first();

                expect(subject.props().className).to.equal(appendToWrapperClass());
            });
        });

        it('should render the correct number of radios', () => {
            const values = [{ label: 'Sam', value: 'sam' }, { label: 'Rae', value: 'rae' }];
            const config = configureRadio({ values });
            const subject = renderComponent(config).find('ul');
            expect(subject.children().length).to.equal(values.length);
        });

        describe('<input/>', () => {
            it('a radio should be correctly configured', () => {
                let updatedRadio:IRadio | null = null;

                const onChange = (nR:IRadio) => updatedRadio = nR;

                const config = configureRadio({
                    disabled: true,
                    name: 'New Name',
                    onChange,
                    selectedValue: 'val1',
                    values: [{ label: 'Label A', value: 'val1' }, { label: 'Label b', value: 'val2' }],
                    wrapperClassName: 'Test Class Name'
                });

                const index = 1;

                const subject = renderComponent(config).find('input').at(index);

                const props = subject.props() as any;

                expect(props.id).to.equal(config.values[index].value);
                expect(props.disabled).to.equal(config.disabled);
                expect(props.type).to.equal('radio');
                expect(props.value).to.equal(config.values[index].value);
                expect(props.name).to.equal(config.name);
                expect(props.checked).to.equal(config.values[index].value === config.selectedValue);

                subject.simulate('change');

                expect(updatedRadio!.selectedValue).to.equal('val2');
            });
        });

        describe('<label/>', () => {
            it('a label should be correctly configured', () => {
                const config = configureRadio({
                    values: [{ label: 'Label A', value: 'val1' }, { label: 'Label b', value: 'val2' }],
                });

                const index = 0;

                const subject = renderComponent(config).find('label').at(index);

                expect(subject.props().htmlFor).to.equal(config.values[index].value);
                expect(subject.text()).to.equal(config.values[index].label);
            });
        });
    });
});