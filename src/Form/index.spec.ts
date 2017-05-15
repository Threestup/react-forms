import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';
import { Some, Ok, Err, _Ok, _Err } from 'tsp-monads';
import { Form, ElementType } from '../';
import { configureButton } from './Button';
import { configureCheckbox, ICheckbox } from './Checkbox';
import { configureInput, IInput } from './Input';
import { configureSelect, ISelect } from './Select';
import { configureToggle, IToggle } from './Toggle';
import * as Validate from './Validation';
import { Update } from './Utils';
import { configureRadio, IRadio } from './Radio'

describe('Form', () => {
    let sandbox:any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('constructor()', () => {
        it('correctly sets up all form components to be empty lists', () => {
            const subject = new Form((nS:string) => null);

            expect(subject.buttons).to.deep.equal([]);
            expect(subject.checkboxes).to.deep.equal([]);
            expect(subject.radios).to.deep.equal([]);
            expect(subject.inputs).to.deep.equal([]);
            expect(subject.selects).to.deep.equal([]);
            expect(subject.toggles).to.deep.equal([]);
            expect(subject.isValid).to.equal(true);
            expect(subject.setState({})).to.equal(null);
        });
    });

    describe('validateInput', () => {
        it('calls passesValidation() with original value and rules', () => {
            const input            = configureInput({value: 'Test', rules: ['isURL']}),
                  passesValidation = sandbox.spy(Validate, 'passesValidation');

            Form.validateInput(input);
            expect(passesValidation.calledWith(input.value, input.rules)).to.equal(true);
        });

        it('calls passesContextValidation() with original value and contextRules', () => {
            const input                   = configureInput({value: 'Test', contextRules: [(v:string) => true]}),
                  passesContextValidation = sandbox.spy(Validate, 'passesContextValidation');

            Form.validateInput(input);
            expect(passesContextValidation.calledWith(input.value, input.contextRules)).to.equal(true);
        });

        it('correctly returns a new Input configuration when touch is false', () => {
            const input = configureInput();

            const passesValidation        = sandbox.stub(Validate, 'passesValidation')
                                                   .returns({errors: [], isValid: true} as Validate.IValidation),
                  passesContextValidation = sandbox.stub(Validate, 'passesContextValidation')
                                                   .returns({errors: ['1'], isValid: false} as Validate.IValidation);

            const subject = Form.validateInput(input);

            expect(subject.errors).to.deep.equal(passesValidation().errors);
            expect(subject.contextErrors).to.deep.equal(passesContextValidation().errors);
            expect(subject.isValid).to.equal(passesValidation().isValid && passesContextValidation().isValid);
            expect(subject.touched).to.equal(input.touched);
        });

        it('correctly returns a new Input configuration when touch is true', () => {
            const input = configureInput();

            const passesValidation        = sandbox.stub(Validate, 'passesValidation')
                                                   .returns({errors: [], isValid: true} as Validate.IValidation),
                  passesContextValidation = sandbox.stub(Validate, 'passesContextValidation')
                                                   .returns({errors: [], isValid: true} as Validate.IValidation);

            const subject = Form.validateInput(input, true);

            expect(subject.errors).to.deep.equal(passesValidation().errors);
            expect(subject.contextErrors).to.deep.equal(passesContextValidation().errors);
            expect(subject.isValid).to.equal(passesValidation().isValid && passesContextValidation().isValid);
            expect(subject.touched).to.equal(true);
        });
    });

    describe('updateState', () => {
        it('correctly calls the method passed into instance constructor', () => {
            let newState:any   = null;
            const fakeSetState = (nS:any) => newState = nS;

            const form = new Form(fakeSetState);
            form.updateState();

            expect(newState.form).to.deep.equal(form);
        });
    });

    describe('getIndexByName', () => {
        it('returns Err(-1) if ElementType not implemented', () => {
            let form = new Form();
            form.inputs.push(configureInput({name: 'a'}), configureInput({name: 'b'}), configureInput({name: 'c'}));
            form.selects.push(configureSelect({name: 'a'}), configureSelect({name: 'b'}), configureSelect({name: 'c'}));

            const subject = form.getIndexByName('b', ElementType.Unknown);
            expect(subject instanceof _Err).to.equal(true);
            expect((subject as _Err<number>).unwrap_err()).to.equal(-1);
        });

        describe('Checkbox', () => {
            it('returns -1 if checkbox not found by name', () => {
                let form = new Form();
                form.checkboxes.push(configureCheckbox({name: 'a'}), configureCheckbox({name: 'b'}), configureCheckbox({name: 'c'}));

                const subject = form.getIndexByName('z', ElementType.Checkbox);
                expect(subject instanceof _Err).to.equal(true);
                expect((subject as _Err<number>).unwrap_err()).to.equal(-1);
            });

            it('returns correct index if checkbox found by name', () => {
                let form = new Form();
                form.checkboxes.push(configureCheckbox({name: 'a'}), configureCheckbox({name: 'b'}), configureCheckbox({name: 'c'}));

                const subject = form.getIndexByName('b', ElementType.Checkbox);
                expect(subject instanceof _Ok).to.equal(true);
                expect((subject as _Ok<number>).unwrap()).to.equal(1);
            });
        });

        describe('Radio', () => {
            it('returns -1 if radio not found by name', () => {
                let form = new Form();
                form.radios.push(configureRadio({name: 'a'}), configureRadio({name: 'b'}), configureRadio({name: 'c'}));

                const subject = form.getIndexByName('z', ElementType.Radio);
                expect(subject instanceof _Err).to.equal(true);
                expect((subject as _Err<number>).unwrap_err()).to.equal(-1);
            });

            it('returns correct index if radio found by name', () => {
                let form = new Form();
                form.radios.push(configureRadio({name: 'a'}), configureRadio({name: 'b'}), configureRadio({name: 'c'}));

                const subject = form.getIndexByName('b', ElementType.Radio);
                expect(subject instanceof _Ok).to.equal(true);
                expect((subject as _Ok<number>).unwrap()).to.equal(1);
            });
        });

        describe('Input', () => {
            it('returns -1 if input not found by name', () => {
                let form = new Form();
                form.inputs.push(configureInput({name: 'a'}), configureInput({name: 'b'}), configureInput({name: 'c'}));

                const subject = form.getIndexByName('z', ElementType.Input);
                expect(subject instanceof _Err).to.equal(true);
                expect((subject as _Err<number>).unwrap_err()).to.equal(-1);
            });

            it('returns correct index if input found by name', () => {
                let form = new Form();
                form.inputs.push(configureInput({name: 'a'}), configureInput({name: 'b'}), configureInput({name: 'c'}));

                const subject = form.getIndexByName('b', ElementType.Input);
                expect(subject instanceof _Ok).to.equal(true);
                expect((subject as _Ok<number>).unwrap()).to.equal(1);
            });
        });

        describe('Select', () => {
            it('returns -1 if select not found by name', () => {
                let form = new Form();
                form.selects.push(configureSelect({name: 'a'}), configureSelect({name: 'b'}), configureSelect({name: 'c'}));

                const subject = form.getIndexByName('z', ElementType.Select);
                expect(subject instanceof _Err).to.equal(true);
                expect((subject as _Err<number>).unwrap_err()).to.equal(-1);
            });

            it('returns correct index if select found by name', () => {
                let form = new Form();
                form.selects.push(configureSelect({name: 'a'}), configureSelect({name: 'b'}), configureSelect({name: 'c'}));

                const subject = form.getIndexByName('b', ElementType.Select);
                expect(subject instanceof _Ok).to.equal(true);
                expect((subject as _Ok<number>).unwrap()).to.equal(1);
            });
        });

        describe('Toggle', () => {
            it('returns -1 if toggle not found by name', () => {
                let form = new Form();
                form.toggles.push(configureToggle({name: 'a'}), configureToggle({name: 'b'}), configureToggle({name: 'c'}));

                const subject = form.getIndexByName('z', ElementType.Toggle);
                expect(subject instanceof _Err).to.equal(true);
                expect((subject as _Err<number>).unwrap_err()).to.equal(-1);
            });

            it('returns correct index if toggle found by name', () => {
                let form = new Form();
                form.toggles.push(configureToggle({name: 'a'}), configureToggle({name: 'b'}), configureToggle({name: 'c'}));

                const subject = form.getIndexByName('b', ElementType.Toggle);
                expect(subject instanceof _Ok).to.equal(true);
                expect((subject as _Ok<number>).unwrap()).to.equal(1);
            });
        });
    });

    describe('updateElement', () => {
        describe('Checkbox', () => {
            it('returns instance of Form with an updated checkbox at correct index, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                const getIndexByName = sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Ok(1));

                const newElement = configureCheckbox({disabled: true});

                let form = new Form();
                form.checkboxes.push(configureCheckbox(), configureCheckbox(), configureCheckbox());

                const subject = form.updateElement(newElement, ElementType.Checkbox);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.checkboxes[getIndexByName().unwrap()]).to.deep.equal(newElement);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });

            it('returns instance of Form with untouched checkbox, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Err(-1));

                const element = configureCheckbox({disabled: true}),
                      newElement = configureCheckbox({disabled: false});

                let form = new Form();
                form.checkboxes.push(element);

                const subject = form.updateElement(newElement, ElementType.Checkbox);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.checkboxes[0]).to.deep.equal(element);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });
        });

        describe('Radio', () => {
            it('returns instance of Form with an updated radio at correct index, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                const getIndexByName = sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Ok(1));

                const newElement = configureRadio({disabled: true});

                let form = new Form();
                form.radios.push(configureRadio(), configureRadio(), configureRadio());

                const subject = form.updateElement(newElement, ElementType.Radio);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.radios[getIndexByName().unwrap()]).to.deep.equal(newElement);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });

            it('returns instance of Form with untouched radio, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Err(-1));

                const element = configureRadio({disabled: true}),
                      newElement = configureRadio({disabled: false});

                let form = new Form();
                form.radios.push(element);

                const subject = form.updateElement(newElement, ElementType.Radio);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.radios[0]).to.deep.equal(element);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });
        });

        describe('Input', () => {
            it('returns instance of Form with an updated input at correct index, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                const getIndexByName = sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Ok(1));

                const newElement = configureInput({value: 'UpdatedValue'});

                let form = new Form();
                form.inputs.push(configureInput(), configureInput(), configureInput());

                const subject = form.updateElement(newElement, ElementType.Input);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.inputs[getIndexByName().unwrap()]).to.deep.equal(newElement);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });

            it('returns instance of Form with untouched inputs, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Err(-1));

                const element = configureInput({value: 'Value'});

                let form = new Form();
                form.inputs.push(element);

                const subject = form.updateElement(configureInput({value: 'UpdatedValue'}), ElementType.Input);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.inputs[0]).to.deep.equal(element);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });
        });

        describe('Select', () => {
            it('returns instance of Form with an updated select at correct index, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                const getIndexByName = sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Ok(1));

                const newElement = configureSelect({value: '1'});

                let form = new Form();
                form.selects.push(configureSelect(), configureSelect(), configureSelect());

                const subject = form.updateElement(newElement, ElementType.Select);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.selects[getIndexByName().unwrap()]).to.deep.equal(newElement);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });

            it('returns instance of Form with untouched selects, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Err(-1));

                const element = configureSelect({value: 'Value'});

                let form = new Form();
                form.selects.push(element);

                const subject = form.updateElement(configureSelect({value: 'UpdatedValue'}), ElementType.Select);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.selects[0]).to.deep.equal(element);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });
        });

        describe('Toggle', () => {
            it('returns instance of Form with an updated toggle at correct index, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                const getIndexByName = sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Ok(1));

                const newElement = configureToggle({value: 'on'});

                let form = new Form();
                form.toggles.push(configureToggle(), configureToggle(), configureToggle());

                const subject = form.updateElement(newElement, ElementType.Toggle);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.toggles[getIndexByName().unwrap()]).to.deep.equal(newElement);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });

            it('returns instance of Form with untouched toggles, calls validateInputs(), validateForm(), and updateState()', () => {
                const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
                const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
                const reRender       = sandbox.spy(Form.prototype, 'updateState');

                sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Err(-1));

                const element = configureToggle({value: 'off'});

                let form = new Form();
                form.toggles.push(element);

                const subject = form.updateElement(configureToggle({value: 'on'}), ElementType.Toggle);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.toggles[0]).to.deep.equal(element);
                expect(validateInputs.calledOnce).to.equal(true);
                expect(validateForm.calledOnce).to.equal(true);
                expect(reRender.calledOnce).to.equal(true);
            });
        });
    });

    describe('updateValueIn', () => {
        describe('Checkbox', () => {
            it('returns instance of Form with an updated checkbox at correct index', () => {
                const getIndexByName = sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Ok(2));

                const element        = configureCheckbox({name: 'Name'});
                const updatedElement = Update(element, {values: [{label: 'Label', value: 'value'}]});

                let form = new Form();
                form.checkboxes.push(configureCheckbox(), configureCheckbox(), element);

                const subject = form.updateValueIn(updatedElement.name, updatedElement.values, ElementType.Checkbox);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.checkboxes[getIndexByName().unwrap()]).to.deep.equal(updatedElement);
            });

            it('returns instance of Form with untouched checkboxes', () => {
                sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Err(-1));

                const element = configureCheckbox({name: 'Name'});

                let form = new Form();
                form.checkboxes.push(element);

                const subject = form.updateElement(configureCheckbox({values: [{label: 'Label', value: 'value'}]}), ElementType.Checkbox);

                expect(form instanceof Form).to.equal(true);
                expect(subject.checkboxes[0]).to.deep.equal(element);
            });
        });

        describe('Radio', () => {
            it('(when radio found) returns instance of Form with an updated Radio at correct index', () => {
                const getIndexByName = sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Ok(2));

                const element        = configureRadio({name: 'Name'});
                const updatedElement = Update(element, {values: [{label: 'Label', value: 'value'}]});

                let form = new Form();
                form.radios.push(configureRadio(), configureRadio(), element);

                const subject = form.updateValueIn(updatedElement.name, updatedElement.values, ElementType.Radio);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.radios[getIndexByName().unwrap()]).to.deep.equal(updatedElement);
            });

            it('(when radio not found) returns instance of Form with untouched radios', () => {
                sandbox
                  .stub(Form.prototype, 'getIndexByName')
                  .returns(Err(-1));

                const element = configureRadio({name: 'Name'});

                let form = new Form();
                form.radios.push(element);

                const subject = form.updateElement(configureRadio({values: [{label: 'Label', value: 'value'}]}), ElementType.Radio);

                expect(form instanceof Form).to.equal(true);
                expect(subject.radios[0]).to.deep.equal(element);
            });
        });

        describe('Input', () => {
            it('returns instance of Form with an updated input at correct index', () => {
                const getIndexByName = sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Ok(2));

                const element        = configureInput({name: 'Name'});
                const updatedElement = Update(element, {value: 'UpdatedValue'});

                let form = new Form();
                form.inputs.push(configureInput(), configureInput(), element);

                const subject = form.updateValueIn(updatedElement.name, updatedElement.value, ElementType.Input);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.inputs[getIndexByName().unwrap()]).to.deep.equal(updatedElement);
            });

            it('returns instance of Form with untouched inputs', () => {
                sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Err(-1));

                const element = configureInput({name: 'Name'});

                let form = new Form();
                form.inputs.push(element);

                const subject = form.updateElement(configureInput({value: 'UpdatedValue'}), ElementType.Input);

                expect(form instanceof Form).to.equal(true);
                expect(subject.inputs[0]).to.deep.equal(element);
            });
        });

        describe('Select', () => {
            it('returns instance of Form with an updated select at correct index', () => {
                const getIndexByName = sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Ok(2));

                const element        = configureSelect({name: 'Name'});
                const updatedElement = Update(element, {value: 'UpdatedValue'});

                let form = new Form();
                form.selects.push(configureSelect(), configureSelect(), element);

                const subject = form.updateValueIn(updatedElement.name, updatedElement.value, ElementType.Select);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.selects[getIndexByName().unwrap()]).to.deep.equal(updatedElement);
            });

            it('returns instance of Form with untouched selects', () => {
                sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Err(-1));

                const element = configureSelect({name: 'Name'});

                let form = new Form();
                form.selects.push(element);

                const subject = form.updateElement(configureSelect({value: 'UpdatedValue'}), ElementType.Select);

                expect(form instanceof Form).to.equal(true);
                expect(subject.selects[0]).to.deep.equal(element);
            });
        });

        describe('Toggle', () => {
            it('returns instance of Form with an updated toggle at correct index', () => {
                const getIndexByName = sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Ok(2));

                const element        = configureToggle({name: 'Name'});
                const updatedElement = Update(element, {value: 'on'});

                let form = new Form();
                form.toggles.push(configureToggle(), configureToggle(), element);

                const subject = form.updateValueIn(updatedElement.name, updatedElement.value, ElementType.Toggle);

                expect(subject instanceof Form).to.equal(true);
                expect(subject.toggles[getIndexByName().unwrap()]).to.deep.equal(updatedElement);
            });

            it('returns instance of Form with untouched toggles', () => {
                sandbox
                    .stub(Form.prototype, 'getIndexByName')
                    .returns(Err(-1));

                const element = configureToggle({name: 'Name'});

                let form = new Form();
                form.toggles.push(element);

                const subject = form.updateElement(configureToggle({value: 'on'}), ElementType.Toggle);

                expect(form instanceof Form).to.equal(true);
                expect(subject.toggles[0]).to.deep.equal(element);
            });
        });
    });

    describe('populateFromPrevious', () => {
        describe('Checkbox', () => {
            it('should update the value of each checkbox in a form', () => {
                const updateValueIn = sandbox.spy(Form.prototype, 'updateValueIn');

                const checkboxes = [
                    configureCheckbox({name: 'Name0'}),
                    configureCheckbox({name: 'Name1'}),
                    configureCheckbox({name: 'Name2'})
                ];

                const checkboxesWithValues = checkboxes
                  .map((checkbox, index) => Update(checkbox, {values: [{label: `NewLabel${index}`, value: `NewValue${index}`}]}));

                let form = new Form();
                form.checkboxes.push(...checkboxesWithValues);
                form.checkboxes.push(configureCheckbox({name: 'Name3'}));

                let subject = new Form();
                subject.checkboxes.push(...checkboxes);
                subject.populateFromPrevious(Some(form));

                expect(updateValueIn.callCount).to.equal(form.checkboxes.length);

                form.checkboxes.forEach((checkbox:ICheckbox, index:number) => {
                    const args = updateValueIn.getCall(index).args;
                    expect(args).to.deep.equal([checkbox.name, checkbox.values, ElementType.Checkbox]);
                });

                expect(subject.checkboxes).to.deep.equal(checkboxesWithValues);
            });
        });

        describe('Radio', () => {
            it('should update the value of each radio in a form', () => {
                const updateValueIn = sandbox.spy(Form.prototype, 'updateValueIn');

                const radios = [
                    configureRadio({name: 'Name0'}),
                    configureRadio({name: 'Name1'}),
                    configureRadio({name: 'Name2'})
                ];

                const radiosWithValues = radios
                  .map((radio, index) => Update(radio, {values: [{label: `NewLabel${index}`, value: `NewValue${index}`}]}));

                let form = new Form();
                form.radios.push(...radiosWithValues);
                form.radios.push(configureRadio({name: 'Name3'}));

                let subject = new Form();
                subject.radios.push(...radios);
                subject.populateFromPrevious(Some(form));

                expect(updateValueIn.callCount).to.equal(form.radios.length);

                expect(subject.radios).to.deep.equal(radiosWithValues);

                form.radios.forEach((radio:IRadio, index:number) => {
                    const args = updateValueIn.getCall(index).args;
                    expect(args).to.deep.equal([radio.name, radio.values, ElementType.Radio]);
                });
            });
        });

        describe('Input', () => {
            it('should update the value of each input in a form', () => {
                const updateValueIn = sandbox.spy(Form.prototype, 'updateValueIn');

                const inputs = [
                    configureInput({name: 'Name0'}),
                    configureInput({name: 'Name1'}),
                    configureInput({name: 'Name2'})
                ];

                const inputsWithValues = inputs
                    .map((input, index) => Update(input, {value: `NewValue${index}`}));

                let form = new Form();
                form.inputs.push(...inputsWithValues);
                form.inputs.push(configureInput({name: 'Name3'}));

                let subject = new Form();
                subject.inputs.push(...inputs);
                subject.populateFromPrevious(Some(form));

                expect(updateValueIn.callCount).to.equal(form.inputs.length);

                form.inputs.forEach((input:IInput, index:number) => {
                    const args = updateValueIn.getCall(index).args;
                    expect(args).to.deep.equal([input.name, input.value, ElementType.Input]);
                });

                expect(subject.inputs).to.deep.equal(inputsWithValues);
            });
        });

        describe('Select', () => {
            it('should update the value of each select in a form', () => {
                const updateValueIn = sandbox.spy(Form.prototype, 'updateValueIn');

                const selects = [
                    configureSelect({name: 'Name0'}),
                    configureSelect({name: 'Name1'}),
                    configureSelect({name: 'Name2'})
                ];

                const selectsWithValues = selects
                    .map((select, index) => Update(select, {value: `NewValue${index}`}));

                let form = new Form();
                form.selects.push(...selectsWithValues);
                form.selects.push(configureSelect({name: 'Name3'}));

                let subject = new Form();
                subject.selects.push(...selects);
                subject.populateFromPrevious(Some(form));

                expect(updateValueIn.callCount).to.equal(form.selects.length);

                form.selects.forEach((select:ISelect, index:number) => {
                    const args = updateValueIn.getCall(index).args;
                    expect(args).to.deep.equal([select.name, select.value, ElementType.Select]);
                });

                expect(subject.selects).to.deep.equal(selectsWithValues);
            });
        });

        describe('Toggle', () => {
            it('should update the value of each toggle in a form', () => {
                const updateValueIn = sandbox.spy(Form.prototype, 'updateValueIn');

                const toggles = [
                    configureToggle({name: 'Name0'}),
                    configureToggle({name: 'Name1'}),
                    configureToggle({name: 'Name2'})
                ];

                const togglesWithValues = toggles
                    .map((toggle, index) => Update(toggle, {value: 'on'}));

                let form = new Form();
                form.toggles.push(...togglesWithValues);
                form.toggles.push(configureToggle({name: 'Name3'}));

                let subject = new Form();
                subject.toggles.push(...toggles);
                subject.populateFromPrevious(Some(form));

                expect(updateValueIn.callCount).to.equal(form.toggles.length);

                form.toggles.forEach((toggle:IToggle, index:number) => {
                    const args = updateValueIn.getCall(index).args;
                    expect(args).to.deep.equal([toggle.name, toggle.value, ElementType.Toggle]);
                });

                expect(subject.toggles).to.deep.equal(togglesWithValues);
            });
        });
    });

    describe('validateForm', () => {
        it('returns a correctly updated instance of Form when no inputs present', () => {
            let form    = new Form();
            form.inputs = []; // just to make sure it's empty

            const subject = form.validateForm();
            expect(subject instanceof Form).to.equal(true);
            expect(subject.isValid).to.equal(true);
        });

        it('returns a correctly updated instance of Form when all inputs are valid', () => {
            let form = new Form();
            form.inputs.push(configureInput({isValid: true}));
            form.inputs.push(configureInput({isValid: true}));

            const subject = form.validateForm();
            expect(subject instanceof Form).to.equal(true);
            expect(subject.isValid).to.equal(true);
        });

        it('returns a correctly updated instance of Form if at least one input is not valid', () => {
            let form = new Form();
            form.inputs.push(configureInput({isValid: true}));
            form.inputs.push(configureInput({isValid: false}));
            form.inputs.push(configureInput({isValid: true}));

            const subject = form.validateForm();
            expect(subject instanceof Form).to.equal(true);
            expect(subject.isValid).to.equal(false);
        });
    });

    describe('validateInputs', () => {
        it('returns a correctly updated instance of Form after inputs have been mapped over validateInput()', () => {
            const validateInput = sandbox
                .stub(Form, 'validateInput')
                .returns(true);

            let form = new Form();
            form.inputs.push(configureInput());
            form.inputs.push(configureInput());

            const subject = form.validateInputs();
            expect(subject instanceof Form).to.equal(true);
            expect(subject.inputs.length).to.equal(2);
            subject.inputs.forEach((i:IInput) => {
                expect(i).to.equal(validateInput());
            });
        });

        it('calls validateInput() with true if called with touch = true', () => {
            const validateInput = sandbox.spy(Form, 'validateInput');

            const input = configureInput();

            let form = new Form();
            form.inputs.push(input);

            form.validateInputs(true);

            expect(validateInput.calledWith(input, true)).to.equal(true);
        });
    });

    describe('submit', () => {
        it('calls validateInputs(), validateForm(), and callback() when valid', () => {
            const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
            const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
            const reRender       = sandbox.spy(Form.prototype, 'updateState');

            let form = new Form();
            form.inputs.push(configureInput());

            let callbackCalled = false;
            form.submit(() => callbackCalled = true);

            expect(validateInputs.calledOnce).to.equal(true);
            expect(validateInputs.calledWith(true)).to.equal(true);
            expect(validateForm.calledOnce).to.equal(true);
            expect(reRender.called).to.equal(false);
            expect(callbackCalled).to.equal(true);
        });

        it('calls validateInputs(), validateForm(), and updateState() when invalid', () => {
            sandbox.stub(Validate, 'passesValidation')
                   .returns({errors: ['1'], isValid: false} as Validate.IValidation);

            const validateInputs = sandbox.spy(Form.prototype, 'validateInputs');
            const validateForm   = sandbox.spy(Form.prototype, 'validateForm');
            const reRender       = sandbox.spy(Form.prototype, 'updateState');

            let form = new Form();
            form.inputs.push(configureInput());

            let callbackCalled = false;
            form.submit(() => callbackCalled = true);

            expect(validateInputs.calledOnce).to.equal(true);
            expect(validateInputs.calledWith(true)).to.equal(true);
            expect(validateForm.calledOnce).to.equal(true);
            expect(reRender.calledOnce).to.equal(true);
            expect(callbackCalled).to.equal(false);
        });
    });

    describe('serializeInputs', () => {
        it('correctly serializes inputs', () => {
            let form = new Form();
            form.inputs.push(configureInput({name: 'a', value: '1'}));
            form.inputs.push(configureInput({name: 'b', value: '2'}));

            const subject = form.serializeInputs();

            expect(subject).to.deep.equal({
                a: '1', b: '2'
            });
        });

        it('returns empty object if no inputs present', () => {
            let form      = new Form();
            const subject = form.serializeInputs();
            expect(subject).to.deep.equal({});
        });
    });

    describe('serializeSelects', () => {
        it('correctly serializes selects', () => {
            let form = new Form();
            form.selects.push(configureSelect({name: 'a', value: '1'}));
            form.selects.push(configureSelect({name: 'b', value: ['2', '3']}));

            const subject = form.serializeSelects();

            expect(subject).to.deep.equal({
                a: '1', b: ['2', '3']
            });
        });

        it('returns empty object if no selects present', () => {
            let form      = new Form();
            const subject = form.serializeSelects();
            expect(subject).to.deep.equal({});
        });
    });

    describe('getButtonByName', () => {
        it('correctly returns a IButton getConfig if found by name', () => {
            const button = configureButton({name: 'Test', className: 'test', text: 'Test Text'});

            let form = new Form();
            form.buttons.push(button);

            const subject = form.getButtonByName('Test');

            expect(subject).to.deep.equal(button);
        });

        it('correctly returns a default IButton getConfig if NOT found by name', () => {
            const form = new Form();

            const onClick = () => null;

            const subject = Update(form.getButtonByName('Test'), {onClick});

            expect(subject).to.deep.equal(configureButton({name: 'Test', onClick}));
        });
    });

    describe('getCheckboxByName', () => {
        it('correctly returns a ICheckbox getConfig if found by name', () => {
            const checkbox = configureCheckbox({name: 'Test'});

            let form = new Form();
            form.checkboxes.push(checkbox);

            const subject = form.getCheckboxByName('Test');

            expect(subject).to.deep.equal(checkbox);
        });

        it('correctly returns a default ICheckbox getConfig if NOT found by name', () => {
            const form = new Form();

            const onChange = (nC:ICheckbox) => null;

            const subject = Update(form.getCheckboxByName('Test'), {onChange});

            expect(subject).to.deep.equal(configureCheckbox({name: 'Test', onChange}));
        });
    });

    describe('getRadioByName', () => {
        it('correctly returns an IRadio getConfig if found by name', () => {
            const radio = configureRadio({name: 'Test'});

            let form = new Form();
            form.radios.push(radio);

            const subject = form.getRadioByName('Test');

            expect(subject).to.deep.equal(radio);
        });

        it('correctly returns a default IRadio getConfig if NOT found by name', () => {
            const form = new Form();

            const onChange = (nR:IRadio) => null;

            const subject = Update(form.getRadioByName('Test'), {onChange});

            expect(subject).to.deep.equal(configureRadio({name: 'Test', onChange}));
        });
    });

    describe('getInputByName', () => {
        it('correctly returns a IInput getConfig if found by name', () => {
            const input = configureInput({name: 'Test', label: 'Test Label'});

            let form = new Form();
            form.inputs.push(input);

            const subject = form.getInputByName('Test');

            expect(subject).to.deep.equal(input);
        });

        it('correctly returns a default IInput getConfig if NOT found by name', () => {
            const form = new Form();

            const onUpdate = (nI:IInput) => null;

            const subject = Update(form.getInputByName('Test'), {onUpdate});

            expect(subject).to.deep.equal(configureInput({name: 'Test', onUpdate}));
        });
    });

    describe('getInputsByNameMatch', () => {
        it('correctly returns a list of IInput configs matched by name', () => {
            const input1 = configureInput({name: 'Test', label: 'Test Label 1'});
            const input2 = configureInput({name: 'Test', label: 'Test Label 2'});

            let form = new Form();
            form.inputs.push(input1);
            form.inputs.push(input2);

            const subject = form.getInputsByNameMatch('Test');

            expect(subject).to.deep.equal([input1, input2]);
        });

        it('correctly returns an empty list if NOT matched by name', () => {
            const input1 = configureInput({name: 'Test_abc', label: 'Test Label 1'});
            const input2 = configureInput({name: 'Test_def', label: 'Test Label 2'});

            let form = new Form();
            form.inputs.push(input1);
            form.inputs.push(input2);

            const subject = form.getInputsByNameMatch('TEST');

            expect(subject).to.deep.equal([]);
        });
    });

    describe('getSelectByName', () => {
        it('correctly returns a ISelect getConfig if found by name', () => {
            const select = configureSelect({name: 'Test'});

            let form = new Form();
            form.selects.push(select);

            const subject = form.getSelectByName('Test');

            expect(subject).to.deep.equal(select);
        });

        it('correctly returns a default ISelect getConfig if NOT found by name', () => {
            const form = new Form();

            const onUpdate = (nS:ISelect) => null;

            const subject = Update(form.getSelectByName('Test'), {onUpdate});

            expect(subject).to.deep.equal(configureSelect({name: 'Test', onUpdate}));
        });
    });

    describe('getSelectsByNameMatch', () => {
        it('correctly returns a list of ISelect configs matched by name', () => {
            const select1 = configureSelect({name: 'Test', label: 'Test Label 1'});
            const select2 = configureSelect({name: 'Test', label: 'Test Label 2'});

            let form = new Form();
            form.selects.push(select1);
            form.selects.push(select2);

            const subject = form.getSelectsByNameMatch('Test');

            expect(subject).to.deep.equal([select1, select2]);
        });

        it('correctly returns an empty list if NOT matched by name', () => {
            const select1 = configureSelect({name: 'Test_abc', label: 'Test Label 1'});
            const select2 = configureSelect({name: 'Test_def', label: 'Test Label 2'});

            let form = new Form();
            form.selects.push(select1);
            form.selects.push(select2);

            const subject = form.getSelectsByNameMatch('TEST');

            expect(subject).to.deep.equal([]);
        });
    });


    describe('getToggleByName', () => {
        it('correctly returns a IToggle getConfig if found by name', () => {
            const toggle = configureToggle({name: 'Test'});

            let form = new Form();
            form.toggles.push(toggle);

            const subject = form.getToggleByName('Test');

            expect(subject).to.deep.equal(toggle);
        });

        it('correctly returns a default IToggle getConfig if NOT found by name', () => {
            const form = new Form();

            const onUpdate = (nT:IToggle) => null;

            const subject = Update(form.getToggleByName('Test'), {onUpdate});

            expect(subject).to.deep.equal(configureToggle({name: 'Test', onUpdate}));
        });
    });
});
