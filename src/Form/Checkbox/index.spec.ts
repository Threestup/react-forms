import { expect } from 'chai';
import { configureCheckbox, ICheckbox } from '.';

describe('Checkbox', () => {
    describe('configureCheckbox', () => {
        it('returns correctly configured default Checkbox', () => {
            const subject = configureCheckbox();

            expect(subject.disabled).to.equal(false);
            expect(subject.name).to.equal('');
            expect(subject.onChange(configureCheckbox())).to.equal(null);
            expect(subject.selectedValues).to.deep.equal([]);
            expect(subject.values).to.deep.equal([]);
            expect(subject.wrapperClassName).to.equal('');
        });

        it('returns correctly re-configured Checkbox when override object', () => {
            let newCheckbox:ICheckbox|null = null;

            const onChange = (nI:ICheckbox) => newCheckbox = nI;

            // Could use ICheckboxPartial but want to ensure we test replacing every getConfig key
            const overrideConfig:ICheckbox = {
                disabled: true,
                name: 'New Name',
                onChange,
                selectedValues: ['Other Value'],
                values: [{label: 'New Label', value: 'newValue'}],
                wrapperClassName: 'NewClassName'
            };

            const subject = configureCheckbox(overrideConfig);

            const updatedCheckbox = configureCheckbox();

            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onChange).to.equal(overrideConfig.onChange);
            expect(subject.selectedValues).to.deep.equal(overrideConfig.selectedValues);
            expect(subject.values).to.deep.equal(overrideConfig.values);
            expect(subject.wrapperClassName).to.equal(overrideConfig.wrapperClassName);

            subject.onChange(updatedCheckbox);
            expect(newCheckbox).to.deep.equal(updatedCheckbox);
        });
    });
});
