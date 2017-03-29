import { expect } from 'chai';
import { configureSelect, ISelect } from '.';

describe('Select', () => {
    describe('configureSelect', () => {
        it('returns correctly configured default Select', () => {
            const subject = configureSelect();

            expect(subject.disabled).to.equal(false);
            expect(subject.label).to.equal('');
            expect(subject.multiple).to.equal(false);
            expect(subject.name).to.equal('');
            expect(subject.onUpdate(configureSelect())).to.equal(null);
            expect(subject.options).to.deep.equal([]);
            expect(subject.value).to.equal('');
            expect(subject.wrapperClassName).to.equal('');
        });

        it('returns correctly re-configured Select when override object', () => {
            let newSelection:ISelect|null = null;

            const onUpdate = (nS:ISelect) => newSelection = nS;

            // Could use ISelectPartial but want to ensure we test replacing every getConfig key
            const overrideConfig:ISelect = {
                disabled: true,
                label: 'New Label',
                multiple: true,
                name: 'New Name',
                onUpdate,
                options: [{value: 'A', label: 'Label for A'}],
                value: ['a', 'b'],
                wrapperClassName: 'NewClassName',
            };

            const subject = configureSelect(overrideConfig);

            const updatedSelection = configureSelect();

            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.label).to.equal(overrideConfig.label);
            expect(subject.multiple).to.equal(overrideConfig.multiple);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onUpdate).to.equal(overrideConfig.onUpdate);
            expect(subject.options).to.deep.equal(overrideConfig.options);
            expect(subject.value).to.deep.equal(overrideConfig.value);
            expect(subject.wrapperClassName).to.deep.equal(overrideConfig.wrapperClassName);

            subject.onUpdate(updatedSelection);
            expect(newSelection).to.deep.equal(updatedSelection);
        });
    });
});
