import 'jsdom-global/register';

import { equals } from 'ramda';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import Select from './';
import { IOption, configureSelect, ISelect } from '../.';
import * as FormUtils from '../../Utils';

const getOptions = (count:number) => {
    let options:IOption[] = [];

    for (let i = 0; i < count; i++) {
        options.push({value: (i.toString()), label: ('Label' + i.toString())});
    }

    return options;
};

const renderComponent = (config = configureSelect()) => {
    return shallow(<Select config={config}/>);
};

describe('Select/El', () => {
    let sandbox:any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('default', () => {
        it('should correctly render the component structure', () => {
            const optionsCount = 1;

            const options  = getOptions(optionsCount);
            const newProps = configureSelect({name: 'Select', label: 'Test Label', options, value: 'a'});

            const subject = renderComponent(newProps).find('div');

            expect(subject.hasClass('form-element')).to.equal(true);

            expect(subject.childAt(0).name()).to.equal('label');
            expect(subject.childAt(0).props().htmlFor).to.equal(newProps.name);
            expect(subject.childAt(0).text()).to.equal(newProps.label);

            expect(subject.childAt(1).name()).to.equal('select');
            expect(subject.childAt(1).props().name).to.equal(newProps.name);
            expect(subject.childAt(1).props().multiple).to.equal(false);
            expect(subject.childAt(1).props().defaultValue).to.equal(newProps.value);
            expect(subject.childAt(1).props().disabled).to.equal(newProps.disabled);

            expect(subject.childAt(1).children().length).to.equal(optionsCount);
        });

        it('should correctly render the component with a default value', () => {
            const optionsCount = 1;

            const options  = getOptions(optionsCount);
            const defaultOptions  = [{value: 'IAmATest', label: 'Please Select'}]
            const newProps = configureSelect({name: 'Select', label: 'Test Label', options, defaultOptions, value: defaultOptions[0].value});

            const subject = renderComponent(newProps).find('div');

            expect(subject.childAt(1).props().defaultValue).to.equal(newProps.value);
            expect(subject.childAt(1).children().length).to.equal(optionsCount + defaultOptions.length);
            expect(subject.childAt(1).children().first().props().children).to.equal(defaultOptions[0].label);
            expect(subject.childAt(1).children().at(1).props().children).to.equal(options[0].label);
        });

        describe('Wrapper', () => {
            it('calls appendToWrapperClass() with correct parameters', () => {
                const appendToWrapperClass = sandbox.spy(FormUtils, 'appendToWrapperClass');

                const config = configureSelect({wrapperClassName: 'test-class'});
                renderComponent(config);
                expect(appendToWrapperClass.calledWith('test-class', 'select'))
                    .to.equal(true);
            });

            it('assigns correct class through getWrapperClass()', () => {
                const appendToWrapperClass = sandbox.stub(FormUtils, 'appendToWrapperClass')
                                                    .returns('TestClassName');

                const subject = renderComponent().find('div').first();

                expect(subject.props().className).to.equal(appendToWrapperClass());
            });
        });

        it('correctly executes callback when clicked', () => {
            const
                name         = 'TestName',
                optionsCount = 6,
                selectValue  = '2';

            let expectedNewSelection:ISelect = configureSelect();

            const onUpdate = (newSelection:ISelect) => {
                expectedNewSelection = newSelection;
            };

            const options  = getOptions(optionsCount);
            const newProps = configureSelect({name, options, value: 'z', onUpdate});

            const subject = renderComponent(newProps).find('select');

            subject.simulate('change', {target: {value: selectValue}});

            expect(expectedNewSelection.name).to.deep.equal(newProps.name);
            expect(expectedNewSelection.options).to.deep.equal(newProps.options);
            expect(expectedNewSelection.value).to.equal(selectValue);
        });
    });

    describe('multiple', () => {
        it('should correctly render the component structure', () => {
            const optionsCount = 6;

            const options  = getOptions(optionsCount);
            const newProps = configureSelect({name: 'Select', options, value: ['0', '3'], multiple: true});

            const subject = renderComponent(newProps).find('select');

            expect(subject.props().name).to.equal(newProps.name);
            expect(subject.props().multiple).to.equal(true);
            expect(subject.props().defaultValue).to.deep.equal(newProps.value);

            expect(subject.children().length).to.equal(optionsCount);
        });

        it('correctly executes callback when clicked', () => {
            const
                name         = 'TestName',
                optionsCount = 5,
                selectValue1 = '0',
                selectValue2 = '3';

            let expectedNewSelection:ISelect = configureSelect();

            const onUpdate = (newSelection:ISelect) => {
                expectedNewSelection = newSelection;
            };

            const options  = getOptions(optionsCount);
            const newProps = configureSelect({name, options, value: ['1'], multiple: true, onUpdate});

            const subject = renderComponent(newProps).find('select');

            subject.simulate('change', {
                target: {
                    value: selectValue1,
                    options: options.map((option:IOption) => ({
                        value: option.value,
                        selected: equals(option.value, selectValue1)
                    }))
                }
            });

            expect(expectedNewSelection.name).to.deep.equal(newProps.name);
            expect(expectedNewSelection.options).to.deep.equal(newProps.options);
            expect(expectedNewSelection.value).to.deep.equal([selectValue1]);

            subject.simulate('change', {
                target: {
                    value: selectValue2,
                    options: options.map((option:IOption) => ({
                        value: option.value,
                        selected: equals(option.value, selectValue1) || equals(option.value, selectValue2)
                    }))
                }
            });
        });
    });
});
