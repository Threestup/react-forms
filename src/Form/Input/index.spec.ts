import { expect } from 'chai';
import { configureInput, IInput } from '.';

describe('Input', () => {
    describe('configureInput', () => {
        it('returns correctly configured default Input', () => {
            const subject = configureInput();

            expect(subject.contextRules).to.deep.equal([]);
            expect(subject.contextErrors).to.deep.equal([]);
            expect(subject.contextErrorMessage).to.equal('There has been an error');
            expect(subject.disabled).to.equal(false);
            expect(subject.errors).to.deep.equal([]);
            expect(subject.errorMessage).to.equal('There has been an error');
            expect(subject.isValid).to.equal(true);
            expect(subject.label).to.equal('');
            expect(subject.name).to.equal('');
            expect(subject.onUpdate(configureInput())).to.equal(null);
            expect(subject.placeholder).to.equal('');
            expect(subject.rules).to.deep.equal([]);
            expect(subject.touched).to.equal(false);
            expect(subject.type).to.equal('text');
            expect(subject.value).to.equal('');
            expect(subject.wrapperClassName).to.equal('');
            expect(subject.inputData).to.equal(null);
        });

        it('returns correctly re-configured Input when override object', () => {
            let newInput:IInput|null = null;

            const onUpdate = (nI:IInput) => newInput = nI;

            // Could use IInputPartial but want to ensure we test replacing every getConfig key
            const overrideConfig:IInput<number> = {
                contextRules: [(v:string) => true],
                contextErrors: ['0'],
                contextErrorMessage: 'New Context Error Message',
                disabled: true,
                errors: ['isLength'],
                errorMessage: 'New Error Message',
                isValid: false,
                label: 'New Label',
                name: 'New Name',
                onUpdate,
                placeholder: 'New Placeholder',
                rules: ['isLength:3'],
                touched: true,
                type: 'email',
                value: 'New Value',
                wrapperClassName: 'NewClassName',
                inputData: 1
            };

            const subject = configureInput(overrideConfig);

            const updatedInput = configureInput();

            expect(subject.contextRules).to.deep.equal(overrideConfig.contextRules);
            expect(subject.contextErrors).to.deep.equal(overrideConfig.contextErrors);
            expect(subject.contextErrorMessage).to.equal(overrideConfig.contextErrorMessage);
            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.errors).to.deep.equal(overrideConfig.errors);
            expect(subject.errorMessage).to.equal(overrideConfig.errorMessage);
            expect(subject.isValid).to.equal(overrideConfig.isValid);
            expect(subject.label).to.equal(overrideConfig.label);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onUpdate).to.equal(overrideConfig.onUpdate);
            expect(subject.placeholder).to.equal(overrideConfig.placeholder);
            expect(subject.rules).to.deep.equal(overrideConfig.rules);
            expect(subject.touched).to.equal(overrideConfig.touched);
            expect(subject.type).to.equal(overrideConfig.type);
            expect(subject.value).to.equal(overrideConfig.value);
            expect(subject.wrapperClassName).to.equal(overrideConfig.wrapperClassName);
            expect(subject.inputData).to.equal(overrideConfig.inputData);

            subject.onUpdate(updatedInput);
            expect(newInput).to.deep.equal(updatedInput);
        });
    });
});
