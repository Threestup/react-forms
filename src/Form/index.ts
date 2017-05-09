import { and, equals, filter, find, findIndex, gte, update } from 'ramda';
import { Option, Some, Result, Ok, Err } from 'tsp-monads';
import { IButton, configureButton } from './Button';
import { CheckboxValue, configureCheckbox, ICheckbox } from './Checkbox';
import { IInput, configureInput, IInputPartial } from './Input';
import { ISelect, configureSelect } from './Select';
import { IToggle, configureToggle, ToggleValue } from './Toggle';
import { passesValidation, passesContextValidation } from './Validation';
import { Update } from './Utils';

export type FormUpdateEvent<T> = (newElement:T) => void;

export enum ElementType {Unknown = 1, Input, Select, Button, Toggle, Checkbox}

export interface ISerializedValues<T> {
    [k:string]:T;
}

export class Form {
    buttons:IButton[];
    checkboxes:ICheckbox[];
    inputs:IInput[];
    selects:ISelect[];
    toggles:IToggle[];
    isValid:boolean;
    readonly setState:(newState:any) => void;

    constructor(setState:(newState:any) => void = (nS:any) => null) {
        this.buttons    = [];
        this.checkboxes = [];
        this.inputs     = [];
        this.selects    = [];
        this.toggles    = [];
        this.isValid    = true;
        this.setState   = setState;
    }

    static validateInput(input:IInput, touch = false):IInput {
        const {value, rules, contextRules} = input;

        const result        = passesValidation(value, rules),
              contextResult = passesContextValidation(value, contextRules);

        let updateConfig:IInputPartial = {
            errors: result.errors,
            contextErrors: contextResult.errors,
            isValid: and(result.isValid, contextResult.isValid),
            touched: touch ? true : input.touched
        };

        return Object.assign({}, input, updateConfig);
    }

    updateState():this {
        this.setState({form: this});
        return this;
    }

    getIndexByName(n:string, type:ElementType):Result<number, number> {
        let index = -1;

        switch (type) {
            case ElementType.Checkbox:
                index = findIndex((i:ICheckbox) => equals(i.name, n), this.checkboxes);
                break;
            case ElementType.Input:
                index = findIndex((i:IInput) => equals(i.name, n), this.inputs);
                break;
            case ElementType.Select:
                index = findIndex((i:ISelect) => equals(i.name, n), this.selects);
                break;
            case ElementType.Toggle:
                index = findIndex((i:IToggle) => equals(i.name, n), this.toggles);
                break;
            default:
                break;
        }

        return (gte(index, 0)) ? Ok(index) : Err(index);
    }

    updateElement(newElement:IInput|ISelect|IToggle|ICheckbox, type:ElementType):this {
        this.getIndexByName(newElement.name, type).match({
            ok: (_) => {
                switch (type) {
                    case ElementType.Checkbox:
                        this.checkboxes = update(_, newElement as ICheckbox, this.checkboxes);
                        break;
                    case ElementType.Input:
                        this.inputs = update(_, newElement as IInput, this.inputs);
                        break;
                    case ElementType.Select:
                        this.selects = update(_, newElement as ISelect, this.selects);
                        break;
                    case ElementType.Toggle:
                        this.toggles = update(_, newElement as IToggle, this.toggles);
                        break;
                }
            },
            err: (_) => null
        });

        return this
            .validateInputs()
            .validateForm()
            .updateState();
    }

    updateValueIn(n:string, v:string|string[]|ToggleValue|CheckboxValue[], type:ElementType):this {
        this.getIndexByName(n, type).match({
            ok: (_) => {
                switch (type) {
                    case ElementType.Checkbox:
                        this.checkboxes = update(_, Update(this.checkboxes[_], {
                            values: v as CheckboxValue[]
                        }), this.checkboxes);
                        break;
                    case ElementType.Input:
                        this.inputs = update(_, Update(this.inputs[_], {
                            value: v as string
                        }), this.inputs);
                        break;
                    case ElementType.Select:
                        this.selects = update(_, Update(this.selects[_], {
                            value: v as string|string[]
                        }), this.selects);
                        break;
                    case ElementType.Toggle:
                        this.toggles = update(_, Update(this.toggles[_], {
                            value: v as ToggleValue
                        }), this.toggles);
                        break;
                }
            },
            err: (_) => null
        });

        return this;
    }

    populateFromPrevious(form:Option<Form>):this {
        form.match({
            some: (_) => {
                _.checkboxes.forEach((c:ICheckbox) => this.updateValueIn(c.name, c.values, ElementType.Checkbox));
                _.inputs.forEach((i:IInput) => this.updateValueIn(i.name, i.value, ElementType.Input));
                _.selects.forEach((s:ISelect) => this.updateValueIn(s.name, s.value, ElementType.Select));
                _.toggles.forEach((t:IToggle) => this.updateValueIn(t.name, t.value, ElementType.Toggle));
            },
            none: () => null
        });

        return this;
    }

    validateForm():this {
        const invalidInputs = filter((i:IInput) => equals(i.isValid, false), this.inputs);
        this.isValid        = equals(invalidInputs.length, 0);
        return this;
    }

    validateInputs(touch = false):this {
        this.inputs = this.inputs.map((i:IInput) => Form.validateInput(i, touch));
        return this;
    }

    submit(cb:Function) {
        this
            .validateInputs(true)
            .validateForm();

        if (this.isValid)
            cb();
        else
            this.updateState();
    }

    serializeInputs():ISerializedValues<string> {
        let o:ISerializedValues<string> = {};
        this.inputs.forEach(_ => o[_.name] = _.value);
        return o;
    }

    serializeSelects():ISerializedValues<string|string[]> {
        let o:ISerializedValues<string|string[]> = {};
        this.selects.forEach(_ => o[_.name] = _.value);
        return o;
    }

    getButtonByName(n:string):IButton {
        return Some(find((button:IButton) => equals(button.name, n), this.buttons))
            .unwrap_or(configureButton({name: n}));
    }

    getCheckboxByName(n:string):ICheckbox {
        return Some(find((i:ICheckbox) => equals(i.name, n), this.checkboxes))
            .unwrap_or(configureCheckbox({name: n}));
    }

    getInputByName(n:string):IInput {
        return Some(find((i:IInput) => equals(i.name, n), this.inputs))
            .unwrap_or(configureInput({name: n}));
    }

    getInputsByNameMatch(n:string):IInput[] {
        return filter((i:IInput) => new RegExp(n, 'g').test(i.name), this.inputs);
    }

    getSelectByName(n:string):ISelect {
        return Some(find((s:ISelect) => equals(s.name, n), this.selects))
            .unwrap_or(configureSelect({name: n}));
    }

    getSelectsByNameMatch(n:string):ISelect[] {
        return filter((i:ISelect) => new RegExp(n, 'g').test(i.name), this.selects);
    }

    getToggleByName(n:string):IToggle {
        return Some(find((t:IToggle) => equals(t.name, n), this.toggles))
            .unwrap_or(configureToggle({name: n}));
    }
}

export default Form;
