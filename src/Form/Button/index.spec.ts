import { expect } from 'chai';
import { configureButton, IButton } from '.';

describe('Button', () => {
    describe('configureButton', () => {
        it('returns correctly configured default Button', () => {
            const subject = configureButton();

            expect(subject.className).to.equal('');
            expect(subject.disabled).to.equal(false);
            expect(subject.name).to.equal('');
            expect(subject.onClick()).to.equal(null);
            expect(subject.text).to.equal('');
        });

        it('returns correctly re-configured Button when override object', () => {
            let newEvent:any = null;

            const onClick = () => newEvent = {};

            // Could use IButtonPartial but want to ensure we test replacing every getConfig key
            const overrideConfig:IButton = {
                className: 'NewClassName',
                disabled: true,
                name: 'New Name',
                onClick,
                text: 'Click me!',
            };

            const subject = configureButton(overrideConfig);

            expect(subject.className).to.equal(overrideConfig.className);
            expect(subject.disabled).to.equal(overrideConfig.disabled);
            expect(subject.name).to.equal(overrideConfig.name);
            expect(subject.onClick).to.equal(overrideConfig.onClick);
            expect(subject.text).to.equal(overrideConfig.text);

            subject.onClick();
            expect(newEvent).to.deep.equal({});
        });
    });
});
