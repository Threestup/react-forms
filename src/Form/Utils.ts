import { gt } from 'ramda';

export function Update<T>(initialState:T, overrideObject:Partial<T>):T {
    return Object.assign({}, initialState, overrideObject);
}

export type Element = 'input' | 'textarea' | 'select' | 'tab-selection' | 'toggle' | 'checkbox' | 'radio';

export const DefaultClassName = 'form-element';

export const appendToWrapperClass = (addClassName:string, element:Element = 'input') => {
    const baseClassName    = DefaultClassName,
          elementClassName = `${baseClassName}-${element}`;

    let classNames:string[] = [];

    classNames.push(baseClassName, elementClassName, addClassName);

    return classNames
        .filter(_ => gt(_.length, 0))
        .join(' ');
};