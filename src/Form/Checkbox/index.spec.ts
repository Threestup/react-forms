import { expect } from 'chai';
import { configureCheckbox, ICheckbox } from '.';

describe('Checkbox', () => {
    describe('configureCheckbox', () => {
        it('returns correctly configured default Checkbox', () => {
            const subject = configureCheckbox();

            expect(subject.disabled).to.equal(false);
            expect(subject.label).to.equal('');
            expect(subject.name).to.equal('');
            expect(subject.onClick(configureCheckbox())).to.equal(null);
            expect(subject.selectedValues).to.deep.equal([]);
            expect(subject.values).to.deep.equal([]);
            expect(subject.wrapperClassName).to.equal('');
        });

        it('returns correctly re-configured Checkbox when override object', () => {
            let newCheckbox:ICheckbox|null = null;

            const onClick = (nI:ICheckbox) => newCheckbox = nI;

            // Could use ICheckboxPartial but want to ensure we test replacing every getConfig key
            const overrideConfig:ICheckbox = {
                disabled: true,
                label: 'New Label',
                name: 'New Name',
                onClick,
                selectedValues: ['Other Value'],
                values: [{label: 'New Label', value: 'newValue'}],
                wrapperClassName: 'NewClassName'
            };

            const subject = configureCheckbox(overrideConfig);

            const updatedCheckbox = configureCheckbox();

            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.label).to.equal(overrideConfig.label);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onClick).to.equal(overrideConfig.onClick);
            expect(subject.selectedValues).to.deep.equal(overrideConfig.selectedValues);
            expect(subject.values).to.deep.equal(overrideConfig.values);
            expect(subject.wrapperClassName).to.equal(overrideConfig.wrapperClassName);

            subject.onClick(updatedCheckbox);
            expect(newCheckbox).to.deep.equal(updatedCheckbox);
        });
    });
});
