import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import ToggleComponent from './';
import { configureToggle, IToggle } from '../.';
import * as FormUtils from '../../Utils';

const mountComponent = (config = configureToggle()) => {
    return mount(<ToggleComponent config={config}/>);
};

describe('Toggle/El', () => {
    let sandbox:any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('UI', () => {
        it('should correctly render the component structure', () => {
            const subject = mountComponent().find('div');

            expect(subject.hasClass('form-element')).to.equal(true);

            expect(subject.children().length).to.equal(2);

            expect(subject.childAt(0).name()).to.equal('ul');
            expect(subject.childAt(1).name()).to.equal('label');
        });

        describe('Wrapper', () => {
            it('calls appendToWrapperClass() with correct parameters', () => {
                const appendToWrapperClass = sandbox.spy(FormUtils, 'appendToWrapperClass');

                const config = configureToggle({wrapperClassName: 'test-class'});
                mountComponent(config);
                expect(appendToWrapperClass.calledWith('test-class', 'toggle'))
                    .to.equal(true);
            });

            it('assigns correct class through getWrapperClass()', () => {
                const appendToWrapperClass = sandbox.stub(FormUtils, 'appendToWrapperClass')
                                                    .returns('TestClassName');

                const subject = mountComponent().find('div').first();

                expect(subject.props().className).to.equal(appendToWrapperClass());
            });
        });

        describe('<label> element', () => {
            it('assigns htmlFor and inserts text from getConfig correctly', () => {
                const config  = configureToggle({name: 'Test Name', label: 'Test Label'});
                const subject = mountComponent(config).find('label').first();

                expect(subject.props().htmlFor).to.equal(config.name);
                expect(subject.text()).to.equal(config.label);
            });
        });

        describe('<ul> element', () => {
            it('assigns class "active" if value is "on"', () => {
                const subject = mountComponent(configureToggle({value: 'on'})).find('ul').first();

                expect(subject.hasClass('toggle')).to.equal(true);
                expect(subject.hasClass('active')).to.equal(true);
            });

            it('does not assign class "active" if value is "off"', () => {
                const subject = mountComponent(configureToggle({value: 'off'})).find('ul').first();

                expect(subject.hasClass('toggle')).to.equal(true);
                expect(subject.hasClass('active')).to.equal(false);
            });

            it('assigns "onClick" attribute correctly – calls onToggle() on click – when initial value is "off"', () => {
                let setToggle = configureToggle();

                const onUpdate = (t:IToggle) => setToggle = t;

                const initialConfig = configureToggle({
                    name: 'Test Name', label: 'Test Label', value: 'off', onUpdate
                });

                const subject = mountComponent(initialConfig).find('ul').first();

                subject.simulate('click');

                expect(setToggle.name).to.equal(initialConfig.name);
                expect(setToggle.label).to.equal(initialConfig.label);
                expect(setToggle.onUpdate).to.equal(initialConfig.onUpdate);
                expect(setToggle.value).to.equal('on');
            });

            it('assigns "onClick" attribute correctly – calls onToggle() on click – when initial value is "on"', () => {
                let setToggle = configureToggle();

                const onUpdate = (t:IToggle) => setToggle = t;

                const initialConfig = configureToggle({
                    name: 'Test Name', label: 'Test Label', value: 'on', onUpdate
                });

                const subject = mountComponent(initialConfig).find('ul').first();

                subject.simulate('click');

                expect(setToggle.name).to.equal(initialConfig.name);
                expect(setToggle.label).to.equal(initialConfig.label);
                expect(setToggle.onUpdate).to.equal(initialConfig.onUpdate);
                expect(setToggle.value).to.equal('off');
            });
        });
    });
});
