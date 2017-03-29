import { expect } from 'chai';
import { appendToWrapperClass, DefaultClassName } from './Utils'

describe('Utils', () => {
    describe('appendToWrapperClass', () => {
        it('returns "form-element form-element-input" when class provided is empty', () => {
            const subject = appendToWrapperClass('');
            expect(subject).to.equal(`${DefaultClassName} ${DefaultClassName}-input`);
        });

        it('returns "form-element form-element-select test" when class provided is "test" and element is select', () => {
            const subject = appendToWrapperClass('test', 'select');
            expect(subject).to.equal(`${DefaultClassName} ${DefaultClassName}-select test`);
        });
    });
});
