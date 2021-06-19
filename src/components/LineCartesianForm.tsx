import React from 'react';
import { LineCartesianAttributes } from '../features';

import styles from './LineCartesianForm.module.scss';

function Field (props: { value: string, name: string, onBlur: Function, placeholder?: string }) {
    const [value, setValue] = React.useState('');
    React.useEffect(() => setValue(props.value), [props.value]);
    return <input required placeholder={ props.placeholder } value={ value } name={ props.name } onChange={ (e) => setValue(e.target.value) } onBlur={ (e) => props.onBlur(e) } />
}


export default function LineCartesianForm (props: { feature: LineCartesianAttributes, onChange: any, onRemove: any }) {
    const line = props.feature;
    function onChange (update) {
        props.onChange({ ...props.feature, ...update });
    }
    return (
        <div className={ styles.scope }>
            <div className={ styles.name }>Line (cartesian)</div>
            <fieldset>
                <legend>From</legend>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>X (mm)</span>
                    <Field value={ line.X1 } name='X1' placeholder='R0' onBlur={ (e: any) => onChange({ X1: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Y (mm)</span>
                    <Field value={ line.Y1 } name='Y1' placeholder='R0' onBlur={ (e: any) => onChange({ Y1: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Z (mm)</span>
                    <Field value={ line.Z1 } name='Z1' placeholder='R0' onBlur={ (e: any) => onChange({ Z1: e.target.value }) }/>
                </label>
            </fieldset>
  
            <fieldset>
                <legend>To</legend>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>X (mm)</span>
                    <Field value={ line.X2 } name='X2' placeholder='R0' onBlur={ (e: any) => onChange({ X2: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Y (mm)</span>
                    <Field value={ line.Y2 } name='Y2' placeholder='R0' onBlur={ (e: any) => onChange({ Y2: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Z (mm)</span>
                    <Field value={ line.Z2 } name='Z2' placeholder='R0' onBlur={ (e: any) => onChange({ Z2: e.target.value }) }/>
                </label>
            </fieldset>
            <fieldset>
                <legend>Extrusion</legend>
                <label>
                    Mode
                    <select onChange={ (e: any) => onChange({ mode: e.target.value }) }>
                        <option value='Print'>
                            Print
                        </option>
                        <option value='Travel'>
                            Travel
                        </option>
                    </select>
                </label>
                {
                    props.feature.mode === 'Print' && <>
                        <label>
                            Width (mm)
                            <Field value={ line.NomWidth } name='NomWidth' onBlur={ (e: any) => onChange({ NomWidth: e.target.value }) }/>
                        </label>
                        <label>
                            Height (mm)
                            <input value={ line.NomHeight } name='NomHeight' onBlur={ (e: any) => onChange({ NomHeight: e.target.value }) }/>
                        </label>
                    </>
                }
            </fieldset>
        </div>
    );
}