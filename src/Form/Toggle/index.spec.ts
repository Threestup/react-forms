import { expect } from 'chai';
import { configureToggle, IToggle } from '.';

describe('Toggle', () => {
    describe('configureToggle', () => {
        it('returns correctly configured default Toggle', () => {
            const subject = configureToggle();

            const newToggle = configureToggle({value: 'on'});

            expect(subject.disabled).to.equal(false);
            expect(subject.label).to.equal('');
            expect(subject.name).to.equal('');
            expect(subject.onUpdate(newToggle)).to.equal(null);
            expect(subject.value).to.equal('off');
            expect(subject.wrapperClassName).to.equal('');
        });

        it('returns correctly re-configured Toggle when override object', () => {
            let setToggle:any = configureToggle();

            const onUpdate = (nT:IToggle) => setToggle = nT;

            // Could use ITogglePartial but want to ensure we test replacing every getConfig key
            const overrideConfig:IToggle = {
                disabled: true,
                label: 'New Label',
                name: 'New Name',
                onUpdate,
                value: 'on',
                wrapperClassName: 'NewClassName',
            };

            const subject = configureToggle(overrideConfig);

            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.label).to.equal(overrideConfig.label);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onUpdate).to.equal(overrideConfig.onUpdate);
            expect(subject.value).to.equal(overrideConfig.value);
            expect(subject.wrapperClassName).to.equal(overrideConfig.wrapperClassName);

            const newToggle = configureToggle({value: 'on'});

            subject.onUpdate(newToggle);
            expect(setToggle).to.deep.equal(newToggle);
        });
    });
});
