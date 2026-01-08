export function Input(props: {
    alert?: string;
    value: string;
    onChange: (value: string) => void;
    error: string;
}) {
    return (
        <>
            <input
                placeholder={props.alert}
                value={props.value}
                onChange={(e) => {
                    props.onChange(e.target.value);
                }}
            />
            {props.error && <div style={{color: "red"}}>{props.error}</div>}
        </>
    )
}

export type InputRules = {
    pattern?: RegExp;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
};
