import { expect } from 'chai';
import { configureSelect, ISelect } from '.';

describe('Select', () => {
    describe('configureSelect', () => {
        it('returns correctly configured default Select', () => {
            const subject = configureSelect();

            expect(subject.defaultOptions).to.deep.equal([]);
            expect(subject.disabled).to.equal(false);
            expect(subject.label).to.equal('');
            expect(subject.multiple).to.equal(false);
            expect(subject.name).to.equal('');
            expect(subject.onUpdate(configureSelect())).to.equal(null);
            expect(subject.options).to.deep.equal([]);
            expect(subject.required).to.equal(false);
            expect(subject.selectData).to.equal(null);
            expect(subject.touched).to.equal(false);
            expect(subject.valid).to.equal(true);
            expect(subject.value).to.equal('');
            expect(subject.wrapperClassName).to.equal('');
        });

        it('returns correctly re-configured Select when override object', () => {
            let newSelection:ISelect|null = null;

            const onUpdate = (nS:ISelect) => newSelection = nS;

            // Could use ISelectPartial but want to ensure we test replacing every getConfig key
            const overrideConfig:ISelect<number> = {
                defaultOptions: [{value: 'A', label: 'Label for A'}],
                disabled: true,
                label: 'New Label',
                multiple: true,
                name: 'New Name',
                onUpdate,
                options: [{value: 'A', label: 'Label for A'}],
                required: true,
                selectData: 1,
                touched: true,
                valid: false,
                value: ['a', 'b'],
                wrapperClassName: 'NewClassName'
            };

            const subject = configureSelect(overrideConfig);

            const updatedSelection = configureSelect();

            expect(subject.defaultOptions).to.deep.equal(overrideConfig.defaultOptions);
            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.label).to.equal(overrideConfig.label);
            expect(subject.multiple).to.equal(overrideConfig.multiple);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onUpdate).to.equal(overrideConfig.onUpdate);
            expect(subject.options).to.deep.equal(overrideConfig.options);
            expect(subject.required).to.deep.equal(overrideConfig.required);
            expect(subject.selectData).to.deep.equal(overrideConfig.selectData);
            expect(subject.touched).to.deep.equal(overrideConfig.touched);
            expect(subject.valid).to.deep.equal(overrideConfig.valid);
            expect(subject.value).to.deep.equal(overrideConfig.value);
            expect(subject.wrapperClassName).to.deep.equal(overrideConfig.wrapperClassName);

            subject.onUpdate(updatedSelection);
            expect(newSelection).to.deep.equal(updatedSelection);
        });
    });
});
