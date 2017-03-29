export interface IButton {
    className:string;
    disabled:boolean;
    name:string;
    onClick:() => void;
    text:string;
}

export type IButtonPartial = Partial<IButton>;

const defaultButtonConfig:IButton = {
    className: '',
    disabled: false,
    name: '',
    onClick: () => null,
    text: '',
};

export const configureButton = (override:IButtonPartial = {}):IButton => {
    return Object.assign({}, defaultButtonConfig, override);
};

export default configureButton;
