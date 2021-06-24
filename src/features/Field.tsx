import React from "react";

export default function Field (props: { value: string, name: string, onBlur: any, placeholder?: string }) {
    const [value, setValue] = React.useState('');
    React.useEffect(() => setValue(props.value), [props.value]);
    return <input required placeholder={ props.placeholder } value={ value } name={ props.name } onChange={ (e) => setValue(e.target.value) } onBlur={ (e) => props.onBlur(e) } />
}
