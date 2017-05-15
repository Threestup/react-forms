import { expect } from 'chai';
import { configureRadio, IRadio } from '.';

describe('Radio', () => {
    describe('configureRadio', () => {
        it('returns correctly configured default Radio', () => {
            const subject = configureRadio();

            expect(subject.disabled).to.equal(false);
            expect(subject.name).to.equal('');
            expect(subject.onChange(configureRadio())).to.equal(null);
            expect(subject.selectedValue).to.equal('');
            expect(subject.values).to.deep.equal([]);
            expect(subject.wrapperClassName).to.equal('');
        });

        it('returns correctly re-configured Radio when override object', () => {
            let newRadio:IRadio | null = null;

            const onChange = (nR:IRadio) => newRadio = nR;

            // Could use IRadioPartial but want to ensure we test replacing every getConfig key
            const overrideConfig: IRadio = {
                disabled: true,
                name: 'New Name',
                onChange,
                selectedValue: 'Other Value',
                values: [{ label: 'New Label', value: 'newValue' }],
                wrapperClassName: 'NewClassName'
            };

            const subject = configureRadio(overrideConfig);

            const updatedRadio = configureRadio();

            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onChange).to.equal(overrideConfig.onChange);
            expect(subject.selectedValue).to.equal(overrideConfig.selectedValue);
            expect(subject.values).to.deep.equal(overrideConfig.values);
            expect(subject.wrapperClassName).to.equal(overrideConfig.wrapperClassName);

            subject.onChange(updatedRadio);
            expect(newRadio).to.deep.equal(updatedRadio);
        });
    });
});
