// import { BaseFeatureAttributes, createFeature } from "./BaseFeature";
import Field from "./Field";



export interface ParamAttributes {
    id: string;
    name: string;
    value: string;
    notes: string;
}

export type ParamSet = Array<ParamAttributes>;

export default class Param {

    static create () {
        return {
            id: Math.random().toString(),
            name: '',
            value: '',
            notes: '',
        }
    }

    static Form (props: { param: ParamAttributes, onChange: any, onRemove: any }) {
        function onChange (update) {
            props.onChange({ ...props.param, ...update });
        }
        return (
            <div>
                <label>
                    <span>Name</span>
                    <Field value={ props.param.name } name='name' onBlur={ (e: any) => onChange({ name: e.target.value }) }/>
                </label>
                <label>
                    <span>Value</span>
                    <Field value={ props.param.value } name='value' onBlur={ (e: any) => onChange({ value: e.target.value }) }/>
                </label>
            </div>
        );
    }
}
