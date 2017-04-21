import { expect } from 'chai';
import { forEach, gte, lt } from 'ramda';
import { passesValidation, passesContextValidation } from './Validation';
import { ContextRule } from './Input';

type TestCases = ITestCase[];
type ContextTestCases = IContextTestCase[];

interface IValidation {
    isValid:boolean;
    errors:string[];
}

interface ITestCase {
    value:string;
    rules:string[];
    passes:IValidation;
    throws?:boolean;
}

interface IContextTestCase {
    value:string;
    rules:ContextRule[];
    passes:IValidation;
}

describe('Validation', () => {
    describe('passesContextValidation', () => {
        const
            longerThanOrEqual3 = (v:string) => gte(v.length, 3),
            shorterThan10      = (v:string) => lt(v.length, 10),
            shorterThan14      = (v:string) => lt(v.length, 14);

        const testCases:ContextTestCases = [
            {value: 'Longer', rules: [longerThanOrEqual3], passes: {isValid: true, errors: []}},
            {value: 'sh', rules: [longerThanOrEqual3], passes: {isValid: false, errors: ['0']}},
            {value: 'sho', rules: [longerThanOrEqual3], passes: {isValid: true, errors: []}},
            {value: 'VeryLongText', rules: [shorterThan10], passes: {isValid: false, errors: ['0']}},
            {value: 'VeryLong', rules: [longerThanOrEqual3, shorterThan10], passes: {isValid: true, errors: []}},
            {
                value: 'VeryLongTextIndeed',
                rules: [shorterThan10, shorterThan14],
                passes: {isValid: false, errors: ['0', '1']}
            }
        ];

        const functor = (testCase:IContextTestCase) => {
            it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                expect(passesContextValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
            });
        };

        forEach(functor, testCases);
    });

    describe('passesValidation', () => {
        describe('isEmail', () => {
            const testCases:TestCases = [
                {value: 'test@a', rules: ['isEmail'], passes: {isValid: false, errors: ['isEmail']}},
                {value: 'test@a.b', rules: ['isEmail'], passes: {isValid: false, errors: ['isEmail']}},
                {value: 'test@website.com', rules: ['isEmail'], passes: {isValid: true, errors: []}}
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });

        describe('isEmail, required', () => {
            const testCases:TestCases = [
                {value: 'test@a.b', rules: ['isEmail', 'required'], passes: {isValid: false, errors: ['isEmail']}},
                {value: '', rules: ['isEmail', 'required'], passes: {isValid: false, errors: ['isEmail', 'required']}},
                {value: 'test@website.com', rules: ['isEmail', 'required'], passes: {isValid: true, errors: []}}
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });

        describe('required', () => {
            const testCases:TestCases = [
                {value: 'a', rules: ['required'], passes: {isValid: true, errors: []}},
                {value: '', rules: ['required'], passes: {isValid: false, errors: ['required']}},
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });

        describe('isURL', () => {
            const testCases:TestCases = [
                {value: 'jobheron', rules: ['isURL'], passes: {isValid: false, errors: ['isURL']}},
                {value: 'www.website.com', rules: ['isURL'], passes: {isValid: true, errors: []}},
                {value: 'www.website.com/', rules: ['isURL'], passes: {isValid: true, errors: []}},
                {value: 'website.com', rules: ['isURL'], passes: {isValid: true, errors: []}},
                {value: 'http://website.com', rules: ['isURL'], passes: {isValid: true, errors: []}},
                {value: 'http//website.com', rules: ['isURL'], passes: {isValid: false, errors: ['isURL']}},
                {value: 'https://website.com', rules: ['isURL'], passes: {isValid: true, errors: []}}
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });

        describe('isLength', () => {
            const testCases:TestCases = [
                {value: 'ab', rules: ['isLength:3:15'], passes: {isValid: false, errors: ['isLength']}},
                {value: 'ab_', rules: ['isLength:3:15'], passes: {isValid: true, errors: []}},
                {
                    value: 'whatever',
                    rules: ['isLength:3,15'],
                    passes: {isValid: false, errors: ['isLength']},
                    throws: true
                }
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });

        describe('equals', () => {
            const testCases:TestCases = [
                {value: 'Test ', rules: ['equals:Test'], passes: {isValid: false, errors: ['equals']}},
                {value: 'test', rules: ['equals:Test'], passes: {isValid: false, errors: ['equals']}},
                {value: '15:30:45', rules: ['equals:15:30:45'], passes: {isValid: true, errors: []}},
                {value: '8', rules: ['equals:8'], passes: {isValid: true, errors: []}},
                {value: '"', rules: ['equals:"'], passes: {isValid: true, errors: []}},
                {value: '\'', rules: ['equals:\''], passes: {isValid: true, errors: []}}
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });

        describe('matches', () => {
            const testCases:TestCases = [
                {value: 'Test test Test', rules: ['matches:([A-Z])\\w+:g'], passes: {isValid: true, errors: []}},
                {
                    value: 'test test test',
                    rules: ['matches:([A-Z])\\w+:g'],
                    passes: {isValid: false, errors: ['matches']}
                },

                {
                    value: 'test',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: false, errors: ['matches']}
                },
                {
                    value: 'test1',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: false, errors: ['matches']}
                },

                {
                    value: 'Test1',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },
                {
                    value: 'tEst 1 ',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },

                {
                    value: '1 TEST',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: false, errors: ['matches']}
                },
                {
                    value: '1 tEST',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },

                {
                    value: 'Tes"t',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: false, errors: ['matches']}
                },
                {
                    value: 'Tes"t0',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },
                {
                    value: 'Tes!t1',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },
                {
                    value: 'Tes@t1',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },
                {
                    value: 'Tes#t1',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },
                {
                    value: 'Tes$t1',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                },
                {
                    value: 'Tes%t1',
                    rules: ['matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                }
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });

        describe('isLength, matches', () => {
            const testCases:TestCases = [
                {
                    value: 'Test test Test',
                    rules: ['isLength:3:255', 'matches:([A-Z])\\w+:g'],
                    passes: {isValid: true, errors: []}
                },
                {
                    value: 'test test test',
                    rules: ['isLength:3:255', 'matches:([A-Z])\\w+:g'],
                    passes: {isValid: false, errors: ['matches']}
                },
                {
                    value: 'Test test Test',
                    rules: ['isLength:3:9', 'matches:([A-Z])\\w+:g'],
                    passes: {isValid: false, errors: ['isLength']}
                },
                {
                    value: 'Test test Test',
                    rules: ['isLength:50:255', 'matches:([A-Z])\\w+:g'],
                    passes: {isValid: false, errors: ['isLength']}
                },
                {
                    value: 'Test1',
                    rules: ['isLength:6:255', 'matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: false, errors: ['isLength']}
                },
                {
                    value: 'tEst_password1',
                    rules: ['isLength:6:255', 'matches:^.*(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$'],
                    passes: {isValid: true, errors: []}
                }
            ];

            const functor = (testCase:ITestCase) => {
                it('should correctly evaluate ' + testCase.value + ' => ' + testCase.rules + ' to ' + testCase.passes, () => {
                    if (testCase.throws)
                        expect(() => passesValidation(testCase.value, testCase.rules)).to.throw();
                    else
                        expect(passesValidation(testCase.value, testCase.rules)).to.deep.equal(testCase.passes);
                });
            };

            forEach(functor, testCases);
        });
    });
});
