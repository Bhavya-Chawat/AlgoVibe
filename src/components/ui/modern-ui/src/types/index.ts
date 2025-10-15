export interface ButtonProps {
    label: string;
    onClick: () => void;
    style?: React.CSSProperties;
}

export interface InputProps {
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectProps {
    options: string[];
    onChange: (selected: string) => void;
    selected: string;
}

export interface CardProps {
    title: string;
    content: string;
    style?: React.CSSProperties;
}