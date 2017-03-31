import 'jsdom-global/register';

import { expect } from 'chai';
import { mount } from 'enzyme';
import { head } from 'ramda';
import * as React from 'react';
import * as sinon from 'sinon';
import InputComponent, { IState } from '.';
import { configureInput, IInput } from '../.';
import { Form } from '../../.';
import * as FormUtils from '../../Utils';

const mountComponent = (config = configureInput()) => {
    return mount(<InputComponent config={config}/>);
};

describe('Input/El', () => {
    let sandbox:any, clock:any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        clock   = sinon.useFakeTimers();
    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    describe('getLabelClass', () => {
        it('returns "active" when active is true', () => {
            const subject = InputComponent.getLabelClass(true, true);
            expect(subject).to.equal('active');
        });

        it('returns "" when active is false and valEmpty is true', () => {
            const subject = InputComponent.getLabelClass(false, true);
            expect(subject).to.equal('');
        });

        it('returns "active" when active is false and valEmpty is false', () => {
            const subject = InputComponent.getLabelClass(false, false);
            expect(subject).to.equal('active');
        });
    });

    describe('getInputClass', () => {
        it('returns "valid" when isValid is true and touched is true', () => {
            const subject = InputComponent.getInputClass(true, true);
            expect(subject).to.equal('valid');
        });

        it('returns "invalid" when isValid is false and touched is true', () => {
            const subject = InputComponent.getInputClass(false, true);
            expect(subject).to.equal('invalid');
        });

        it('returns "" when isValid is true and touched is false', () => {
            const subject = InputComponent.getInputClass(true, false);
            expect(subject).to.equal('');
        });

        it('returns "" when isValid is false and touched is false', () => {
            const subject = InputComponent.getInputClass(false, false);
            expect(subject).to.equal('');
        });
    });

    describe('getErrorMessageClass', () => {
        it('returns "error-message" when isValid is true and touched is true', () => {
            const subject = InputComponent.getErrorMessageClass(true, true);
            expect(subject).to.equal('error-message');
        });

        it('returns "error-message show" when isValid is false and touched is true', () => {
            const subject = InputComponent.getErrorMessageClass(false, true);
            expect(subject).to.equal('error-message show');
        });

        it('returns "error-message" when isValid is true and touched is false', () => {
            const subject = InputComponent.getErrorMessageClass(true, false);
            expect(subject).to.equal('error-message');
        });

        it('returns "error-message show" when isValid is false and touched is false', () => {
            const subject = InputComponent.getErrorMessageClass(false, false);
            expect(subject).to.equal('error-message');
        });
    });

    describe('constructor()', () => {
        it('correctly sets up the initial state when value empty', () => {
            const config = configureInput({value: '', isValid: true});

            const subject = mountComponent(config).state() as IState;

            expect(subject.value).to.equal('');
            expect(subject.isValid).to.equal(true);
            expect(subject.active).to.equal(false);
            expect(subject.touched).to.equal(false);
        });

        it('correctly sets up the initial state when value present', () => {
            const config = configureInput({value: 'Test', isValid: false});

            const subject = mountComponent(config).state() as IState;

            expect(subject.value).to.equal('Test');
            expect(subject.isValid).to.equal(false);
            expect(subject.active).to.equal(false);
            expect(subject.touched).to.equal(false);
        });
    });

    describe('componentWillReceiveProps', () => {
        it('updates state when touched is true', () => {
            const subject       = mountComponent();
            const originalState = subject.state() as IState;

            const setState = sandbox.spy(subject.instance(), 'setState');

            const newConfig = configureInput({isValid: false, touched: true});
            subject.setProps({config: newConfig});

            expect(setState.calledWith(FormUtils.Update(originalState, {
                value: originalState.value, isValid: newConfig.isValid, touched: true
            }))).to.equal(true);
        });

        it('updates state when touched is false and value is non-empty', () => {
            const subject       = mountComponent();
            const originalState = subject.state();

            const setState = sandbox.spy(subject.instance(), 'setState');

            const newConfig = configureInput({value: 'a', isValid: false, touched: false});
            subject.setProps({config: newConfig});

            expect(setState.calledWith(FormUtils.Update(originalState, {
                value: newConfig.value, isValid: newConfig.isValid, touched: true
            }))).to.equal(true);
        });

        it('updates state when touched is false and value is empty and value is different to previous value', () => {
            const originalConfig = configureInput({value: 'abc'});

            const subject       = mountComponent(originalConfig);
            const originalState = subject.state();

            const setState = sandbox.spy(subject.instance(), 'setState');

            const newConfig = configureInput({value: '', isValid: false, touched: false});
            subject.setProps({config: newConfig});

            expect(setState.calledWith(FormUtils.Update(originalState, {
                value: newConfig.value, isValid: newConfig.isValid, touched: true
            }))).to.equal(true);
        });

        it('does NOT update state when touched is false', () => {
            const subject = mountComponent();

            const setState = sandbox.spy(subject.instance(), 'setState');

            const newConfig = configureInput({isValid: true, touched: false});
            subject.setProps({config: newConfig});

            expect(setState.called).to.equal(false);
        });
    });

    describe('handleFocus', () => {
        it('calls Update() when called', () => {
            const subject       = mountComponent();
            const originalState = subject.state();

            const setState = sandbox.spy(subject.instance(), 'setState');

            (subject.instance() as InputComponent).handleFocus();

            expect(setState.calledWith(FormUtils.Update(originalState, {active: true})))
                .to.equal(true);
        });
    });

    describe('handleBlur', () => {
        it('calls the validate method with correct parameters', () => {
            const newConfig = configureInput({value: 'Initial Value'});

            const validate = sandbox.spy(InputComponent.prototype, 'validate');

            const subject = mountComponent(newConfig);

            (subject.instance() as InputComponent).handleBlur();

            expect(validate.calledWith(newConfig.value, true))
                .to.equal(true);
        });
    });

    describe('setValue', () => {
        it('calls Update() with the value provided in an event', () => {
            const subject       = mountComponent();
            const originalState = subject.state();

            const setState = sandbox.spy(subject.instance(), 'setState');

            const event = {target: {value: 'New Value'}};
            (subject.instance() as InputComponent).setValue(event as any);

            expect(setState.calledWith(FormUtils.Update(originalState, {value: event.target.value})))
                .to.equal(true);
        });

        it('calls validate method with correct parameters after given timeout if touched', () => {
            const validate = sandbox.spy(InputComponent.prototype, 'validate');

            const subject = mountComponent(configureInput({touched: true}));

            const event = {target: {value: 'New Value'}};
            (subject.instance() as InputComponent).setValue(event as any);

            clock.tick(InputComponent.validateTimeout);

            expect(validate.calledWith(event.target.value))
                .to.equal(true);
        });

        it('calls validate method with correct parameters after given timeout if NOT touched', () => {
            const validate = sandbox.spy(InputComponent.prototype, 'validate');

            const subject = mountComponent(configureInput({touched: true}));

            const event = {target: {value: 'New Value'}};
            (subject.instance() as InputComponent).setValue(event as any);

            clock.tick(InputComponent.validateTimeoutExtended);

            expect(validate.calledWith(event.target.value))
                .to.equal(true);
        });
    });

    describe('validate', () => {
        it('calls Form.validateInput with correct parameters', () => {
            const validateInput = sandbox.spy(Form, 'validateInput');

            const config = configureInput();

            const subject = mountComponent(config);
            (subject.instance() as InputComponent).validate('Test Value');

            expect(validateInput.calledWith(Object.assign({}, config, {value: 'Test Value'})))
                .to.equal(true);
        });

        it('calls setState() with correct parameters when deactivate is true', () => {
            const validateInput = sandbox.stub(Form, 'validateInput')
                                         .returns(configureInput({isValid: false}));

            const subject       = mountComponent();
            const originalState = subject.state();

            const setState = sandbox.spy(subject.instance(), 'setState');

            (subject.instance() as InputComponent).validate('Value', true);

            expect(setState.calledWith(FormUtils.Update(originalState, {
                active: false,
                isValid: validateInput().isValid,
                touched: true
            }))).to.equal(true);
        });

        it('calls setState() with correct parameters when deactivate is false or undefined', () => {
            const validateInput = sandbox.stub(Form, 'validateInput')
                                         .returns(configureInput({isValid: false}));

            const subject = mountComponent();
            subject.setState({active: true});
            const originalState = subject.state() as IState;

            const setState = sandbox.spy(subject.instance(), 'setState');

            (subject.instance() as InputComponent).validate('Value');

            expect(setState.calledWith(FormUtils.Update(originalState, {
                active: originalState.active,
                isValid: validateInput().isValid,
                touched: true
            }))).to.equal(true);
        });

        it('calls props.onUpdate() with new – validated – Input', () => {
            const newValue = 'New Value';

            const validateInput = sandbox.stub(Form, 'validateInput')
                                         .returns(configureInput({value: newValue, isValid: true}));

            let newInput:IInput | null = null;
            const onUpdate             = (nI:IInput) => newInput = nI;

            const config  = configureInput({onUpdate});
            const subject = mountComponent(config);

            (subject.instance() as InputComponent).validate(newValue);

            expect(newInput).to.deep.equal(validateInput());
        });
    });

    describe('UI', () => {
        describe('input', () => {
            it('should correctly render the component structure', () => {
                const subject = mountComponent().find('div');

                expect(subject.hasClass('form-element')).to.equal(true);

                expect(subject.children().length).to.equal(4);

                expect(subject.childAt(0).name()).to.equal('label');
                expect(subject.childAt(1).name()).to.equal('input');
                expect(subject.childAt(2).name()).to.equal('small');
                expect(subject.childAt(3).name()).to.equal('small');
            });
        });

        describe('textarea', () => {
            it('should correctly render the component structure', () => {
                const subject = mountComponent(configureInput({type: 'textarea'})).find('div');

                expect(subject.hasClass('form-element')).to.equal(true);

                expect(subject.children().length).to.equal(4);

                expect(subject.childAt(0).name()).to.equal('label');
                expect(subject.childAt(1).name()).to.equal('textarea');
                expect(subject.childAt(2).name()).to.equal('small');
                expect(subject.childAt(3).name()).to.equal('small');
            });
        });

        describe('Wrapper', () => {
            it('calls appendToWrapperClass() with correct parameters', () => {
                const appendToWrapperClass = sandbox.spy(FormUtils, 'appendToWrapperClass');
                const config               = configureInput({wrapperClassName: 'test-class'});
                mountComponent(config);
                expect(appendToWrapperClass.calledWith('test-class'))
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
            it('calls getLabelClass() with correct parameters', () => {
                const getLabelClass = sandbox.spy(InputComponent, 'getLabelClass');
                const config        = configureInput({value: 'Test Value'});
                mountComponent(config);
                expect(getLabelClass.calledWith(false, false))
                    .to.equal(true);
            });

            it('assigns correct class through getLabelClass()', () => {
                const getLabelClass = sandbox.stub(InputComponent, 'getLabelClass')
                                             .returns('TestClassName');

                const subject = mountComponent().find('label').first();

                expect(subject.props().className).to.equal(getLabelClass());
            });

            it('inserts text from getConfig correctly', () => {
                const config  = configureInput({name: 'Test Name', label: 'Test Label'});
                const subject = mountComponent(config).find('label').first();
                expect(subject.props().htmlFor).to.equal(config.name);
                expect(subject.text()).to.equal(config.label);
            });
        });

        describe('<input> element', () => {
            it('calls getInputClass() with correct parameters', () => {
                const getInputClass = sandbox.spy(InputComponent, 'getInputClass');
                const config        = configureInput({isValid: false, touched: true});
                mountComponent(config);
                expect(getInputClass.calledWith(false, true))
                    .to.equal(true);
            });

            it('assigns correct class through getInputClass()', () => {
                const getInputClass = sandbox.stub(InputComponent, 'getInputClass')
                                             .returns('TestClassName');

                const subject = mountComponent().find('input').first();

                expect(subject.props().className).to.equal(getInputClass());
            });

            it('assigns "type" attribute correctly', () => {
                const config  = configureInput({type: 'email'});
                const subject = mountComponent(config).find('input').first();
                expect(subject.props().type).to.equal('email');
            });

            it('assigns "disabled" attribute correctly', () => {
                const config  = configureInput({disabled: true});
                const subject = mountComponent(config).find('input').first();
                expect(subject.props().disabled).to.equal(true);
            });

            it('assigns "name" attribute correctly', () => {
                const config  = configureInput({name: 'Email'});
                const subject = mountComponent(config).find('input').first();
                expect(subject.props().name).to.equal('Email');
            });

            it('assigns "placeholder" attribute correctly', () => {
                const config  = configureInput({placeholder: 'Test Placeholder'});
                const subject = mountComponent(config).find('input').first();
                expect(subject.props().placeholder).to.equal('Test Placeholder');
            });

            it('assigns "onFocus" attribute correctly – calls handleFocus() on focus', () => {
                const handleFocus = sandbox.spy(InputComponent.prototype, 'handleFocus');
                const subject     = mountComponent().find('input').first();
                subject.simulate('focus');
                expect(handleFocus.calledOnce).to.equal(true);
            });

            it('assigns "onBlur" attribute correctly – calls handleBlur() on blur', () => {
                const handleBlur = sandbox.spy(InputComponent.prototype, 'handleBlur');
                const subject    = mountComponent().find('input').first();
                subject.simulate('blur');
                expect(handleBlur.calledOnce).to.equal(true);
            });

            it('assigns "onChange" attribute correctly – calls onChange() on change', () => {
                const setValue = sandbox.spy(InputComponent.prototype, 'setValue');

                const subject = mountComponent().find('input').first();

                const fakeEvent = {target: {value: 'New Value'}};
                subject.simulate('change', fakeEvent);

                const {target} = head(setValue.lastCall.args) as Event;

                expect(target).to.deep.equal(fakeEvent.target);
            });

            it('assigns "value" attribute correctly', () => {
                const config  = configureInput({value: 'Test Value'});
                const subject = mountComponent(config).find('input').first();
                expect(subject.props().value).to.equal(config.value);
            });
        });

        describe('<textarea> element', () => {
            it('calls getInputClass() with correct parameters', () => {
                const getInputClass = sandbox.spy(InputComponent, 'getInputClass');
                const config        = configureInput({type: 'textarea', isValid: true, value: 'Not Empty'});
                mountComponent(config);
                expect(getInputClass.calledWith(true, false))
                    .to.equal(true);
            });

            it('assigns correct class through getInputClass()', () => {
                const getInputClass = sandbox.stub(InputComponent, 'getInputClass')
                                             .returns('TestClassName');

                const subject = mountComponent(configureInput({type: 'textarea'})).find('textarea').first();

                expect(subject.props().className).to.equal(getInputClass());
            });

            it('has no "type" attribute', () => {
                const config  = configureInput({type: 'textarea'});
                const subject = mountComponent(config).find('textarea').first();
                expect(subject.props().type).to.be.undefined;
            });

            it('assigns "disabled" attribute correctly', () => {
                const config  = configureInput({type: 'textarea', disabled: true});
                const subject = mountComponent(config).find('textarea').first();
                expect(subject.props().disabled).to.equal(true);
            });

            it('assigns "name" attribute correctly', () => {
                const config  = configureInput({type: 'textarea', name: 'Description'});
                const subject = mountComponent(config).find('textarea').first();
                expect(subject.props().name).to.equal('Description');
            });

            it('assigns "placeholder" attribute correctly', () => {
                const config  = configureInput({type: 'textarea', placeholder: 'Test Placeholder'});
                const subject = mountComponent(config).find('textarea').first();
                expect(subject.props().placeholder).to.equal('Test Placeholder');
            });

            it('assigns "onFocus" attribute correctly – calls handleFocus() on focus', () => {
                const handleFocus = sandbox.spy(InputComponent.prototype, 'handleFocus');
                const subject     = mountComponent(configureInput({type: 'textarea'})).find('textarea').first();
                subject.simulate('focus');
                expect(handleFocus.calledOnce).to.equal(true);
            });

            it('assigns "onBlur" attribute correctly – calls handleBlur() on blur', () => {
                const handleBlur = sandbox.spy(InputComponent.prototype, 'handleBlur');
                const subject    = mountComponent(configureInput({type: 'textarea'})).find('textarea').first();
                subject.simulate('blur');
                expect(handleBlur.calledOnce).to.equal(true);
            });

            it('assigns "onChange" attribute correctly – calls onChange() on change', () => {
                const setValue = sandbox.spy(InputComponent.prototype, 'setValue');

                const subject = mountComponent(configureInput({type: 'textarea'})).find('textarea').first();

                const fakeEvent = {target: {value: 'New Value'}};
                subject.simulate('change', fakeEvent);

                const {target} = head(setValue.lastCall.args) as Event;

                expect(target).to.deep.equal(fakeEvent.target);
            });

            it('assigns "value" attribute correctly', () => {
                const config  = configureInput({type: 'textarea', value: 'Test Value'});
                const subject = mountComponent(config).find('textarea').first();
                expect(subject.props().value).to.equal(config.value);
            });
        });

        describe('.error-message element', () => {
            describe('errors', () => {
                it('calls getErrorMessageClass() with correct parameters', () => {
                    const getErrorMessageClass = sandbox.spy(InputComponent, 'getErrorMessageClass');

                    const config = configureInput({
                        errors: ['1'],
                        contextErrors: [],
                        touched: true,
                    });

                    mountComponent(config);

                    const {args} = getErrorMessageClass.getCall(0);

                    expect(args[0]).to.equal(false);
                    expect(args[1]).to.equal(true);
                });

                it('assigns correct class through getErrorMessageClass()', () => {
                    const getErrorMessageClass = sandbox.stub(InputComponent, 'getErrorMessageClass')
                                                        .returns('error-message TestClassName1');

                    const subject = mountComponent().find('.error-message').at(0);

                    expect(subject.props().className).to.equal(getErrorMessageClass());
                });

                it('inserts errorMessage from getConfig if not empty', () => {
                    const config  = configureInput({errorMessage: 'Test Error Message'});
                    const subject = mountComponent(config).find('.error-message').at(0);
                    expect(subject.text()).to.equal(config.errorMessage);
                });

                it('inserts default error message if one from getConfig empty', () => {
                    const config  = configureInput({errorMessage: ''});
                    const subject = mountComponent(config).find('.error-message').at(0);
                    expect(subject.text()).to.equal(InputComponent.defaultErrorMessage);
                });
            });

            describe('contextErrors', () => {
                it('calls getErrorMessageClass() with correct parameters', () => {
                    const getErrorMessageClass = sandbox.spy(InputComponent, 'getErrorMessageClass');

                    const config = configureInput({
                        errors: [],
                        contextErrors: ['1'],
                        value: 'Test Initial Value'
                    });

                    mountComponent(config);

                    const {args} = getErrorMessageClass.getCall(1);

                    expect(args[0]).to.equal(false);
                    expect(args[1]).to.equal(false);
                });

                it('assigns correct class through getErrorMessageClass()', () => {
                    const getErrorMessageClass = sandbox.stub(InputComponent, 'getErrorMessageClass')
                                                        .returns('error-message TestClassName2');

                    const subject = mountComponent().find('.error-message').at(1);

                    expect(subject.props().className).to.equal(getErrorMessageClass());
                });

                it('inserts errorMessage from getConfig if not empty', () => {
                    const config  = configureInput({contextErrorMessage: 'Test Context Error Message'});
                    const subject = mountComponent(config).find('.error-message').at(1);
                    expect(subject.text()).to.equal(config.contextErrorMessage);
                });

                it('inserts default error message if one from getConfig empty', () => {
                    const config  = configureInput({contextErrorMessage: ''});
                    const subject = mountComponent(config).find('.error-message').at(1);
                    expect(subject.text()).to.equal(InputComponent.defaultErrorMessage);
                });
            });
        });
    });
});