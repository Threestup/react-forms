import 'jsdom-global/register';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import { contains } from 'ramda';
import * as React from 'react';
import * as sinon from 'sinon';
import CheckboxComponent from '.';
import { configureCheckbox, ICheckbox } from '../.';
import * as FormUtils from '../../Utils';

const renderComponent = (config = configureCheckbox()) => {
    return shallow(<CheckboxComponent config={config}/>);
};

describe('Checkbox/El', () => {
    let sandbox:any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('onClick', () => {
        it('should add an item to selectedItems if previously not there', () => {
            let updatedCheckbox:ICheckbox|null = null;

            const onClick = (nC: ICheckbox) => updatedCheckbox = nC;

            const config = configureCheckbox({onClick}),
                  val = 'a';

            CheckboxComponent.onClick(val, config);

            expect(updatedCheckbox!.selectedValues).to.deep.equal([val]);
        });

        it('should remove an item from selectedItems if previously there', () => {
            let updatedCheckbox:ICheckbox|null = null;

            const onClick = (nC: ICheckbox) => updatedCheckbox = nC,
                  selectedValues = ['a', 'b', 'c'];

            const config = configureCheckbox({onClick, selectedValues}),
                  val = 'b';

            CheckboxComponent.onClick(val, config);

            expect(updatedCheckbox!.selectedValues).to.deep.equal(['a', 'c']);
        });
    });

    describe('UI', () => {
        describe('Wrapper', () => {
            it('calls appendToWrapperClass() with correct parameters', () => {
                const appendToWrapperClass = sandbox.spy(FormUtils, 'appendToWrapperClass');
                const config               = configureCheckbox({wrapperClassName: 'test-class'});
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

        it('should render the correct number of checkboxes', () => {
            const values = [{label: 'Sam', value: 'sam'}, {label: 'Rae', value: 'rae'}];
            const config = configureCheckbox({values});
            const subject = renderComponent(config).find('ul');
            expect(subject.children().length).to.equal(values.length);
        });

        describe('<input/>', () => {
            it('a checkbox should be correctly configured', () => {
                let updatedCheckbox:ICheckbox|null = null;

                const onClick = (nC: ICheckbox) => updatedCheckbox = nC;

                const config = configureCheckbox({
                    disabled: true,
                    name: 'New Name',
                    onClick,
                    selectedValues: ['val1'],
                    values: [{label: 'Label A', value: 'val1'}, {label: 'Label b', value: 'val2'}],
                    wrapperClassName: 'Test Class Name'
                });

                const index = 0;

                const subject = renderComponent(config).find('input').at(index);

                const props = subject.props() as any;

                expect(props.id).to.equal(config.values[index].value);
                expect(props.disabled).to.equal(config.disabled);
                expect(props.type).to.equal('checkbox');
                expect(props.value).to.equal(config.values[index].value);
                expect(props.name).to.equal(config.name);
                expect(props.checked).to.equal(contains(config.values[index].value, config.selectedValues));

                subject.simulate('click');

                expect(updatedCheckbox!.selectedValues).to.deep.equal([]);
            });
        });

        describe('<label/>', () => {
            it('a label should be correctly configured', () => {
                const config = configureCheckbox({
                    values: [{label: 'Label A', value: 'val1'}, {label: 'Label b', value: 'val2'}],
                });

                const index = 0;

                const subject = renderComponent(config).find('label').at(index);

                expect(subject.props().htmlFor).to.equal(config.values[index].value);
                expect(subject.text()).to.equal(config.values[index].label);
            });
        });
    });
});