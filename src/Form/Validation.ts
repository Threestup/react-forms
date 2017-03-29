import * as validator from 'validator';
import { concat, contains, equals, forEach, gt, map, join, without } from 'ramda';
import { ContextRule } from './Input';

export interface IValidation {
    isValid:boolean;
    errors:string[];
}

export const passesContextValidation = (value:string, rules:ContextRule[]):IValidation => {
    let result:IValidation = {isValid: true, errors: []};

    if (gt(rules.length, 0)) {
        rules.forEach((rule:ContextRule, index:number) => {
            let valid = rule(value);

            if (!valid)
                result.errors.push(index.toString());
        });

        result.isValid = equals(result.errors.length, 0);
    }

    return result;
};

export const passesValidation = (value:string, rules:string[]):IValidation => {
    let result:IValidation = {isValid: true, errors: []};

    if (gt(rules.length, 0)) {
        const runValidation = (validationRule:string) => {
            let args:any[] = validationRule.split(':');

            const rule = args.shift() as string;

            switch (rule) {
                case 'equals':
                    args = [join(':', args)]; // On the off-chance there is a ":" character in value
                    break;
                case 'matches':
                    const expression = args[0], modifiers = args[1];
                    args             = [new RegExp(expression, modifiers)];
                    break;
                default:
                    args = map(arg => JSON.parse(arg), args); // JSON.parse used for numeric values
                    break;
            }

            args = concat([value], args);

            const method = (<any>validator)[rule];

            if (method) {
                if (method.apply(validator, args)) {
                    // Do nothing
                } else {
                    result.errors.push(rule);
                }
            } else {
                throw new ReferenceError(`Validator method "${rule}" not found`);
            }
        };

        if (contains('required', rules) || gt(value.length, 0))
            forEach(runValidation, without(['required'], rules));

        result.isValid = equals(result.errors.length, 0);
    }

    return result;
};
