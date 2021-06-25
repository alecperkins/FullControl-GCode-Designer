import React from "react";

export default function Field (props: { as?: string, value: string, name: string, onBlur: any, placeholder?: string }) {
    const [value, setValue] = React.useState('');
    React.useEffect(() => setValue(props.value), [props.value]);
    const field_props = {
        placeholder: props.placeholder,
        value: value,
        name: props.name,
        onChange: (e) => setValue(e.target.value),
        onBlur: props.onBlur,
        style: { fontFamily: 'Menlo', fontSize: 14 }
    }
    if (props.as === 'textarea') {
        return <textarea {...field_props} />
    }
    return <input {...field_props} />
}
