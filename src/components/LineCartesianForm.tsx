import React from 'react';
import Feature, { LineCartesian } from '../features';

import styles from './LineCartesianForm.module.scss';

function Field (props: { value: string, name: string, onBlur: Function }) {
    const [value, setValue] = React.useState('');
    React.useEffect(() => setValue(props.value), [props.value]);
    return <input required value={ value } name={ props.name } onChange={ (e) => setValue(e.target.value) } onBlur={ (e) => props.onBlur(e) } />
}


export default function LineCartesianForm (props: { feature: LineCartesian, onChange: any, onRemove: any }) {
    const line = props.feature;
    return (
        <div className={ styles.scope }>
            <div className={ styles.name }>Line (cartesian)</div>
            <fieldset>
                <legend>From</legend>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>X (mm)</span>
                    <Field value={ line.X1 } name='X1' onBlur={ (e: any) => props.onChange(props.feature.id, { X1: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Y (mm)</span>
                    <Field value={ line.Y1 } name='Y1' onBlur={ (e: any) => props.onChange(props.feature.id, { Y1: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Z (mm)</span>
                    <Field value={ line.Z1 } name='Z1' onBlur={ (e: any) => props.onChange(props.feature.id, { Z1: e.target.value }) }/>
                </label>
            </fieldset>
  
            <fieldset>
                <legend>To</legend>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>X (mm)</span>
                    <Field value={ line.X2 } name='X2' onBlur={ (e: any) => props.onChange(props.feature.id, { X2: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Y (mm)</span>
                    <Field value={ line.Y2 } name='Y2' onBlur={ (e: any) => props.onChange(props.feature.id, { Y2: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Z (mm)</span>
                    <Field value={ line.Z2 } name='Z2' onBlur={ (e: any) => props.onChange(props.feature.id, { Z2: e.target.value }) }/>
                </label>
            </fieldset>
            <fieldset>
                <legend>Extrusion</legend>
                <label>
                    Mode
                    <select>
                        <option>
                            Print
                        </option>
                        <option>
                            Travel
                        </option>
                    </select>
                </label>
                {
                    props.feature.mode === 'Print' && <>
                        <label>
                            Width (mm)
                            <Field value={ line.NomWidth } name='NomWidth' onBlur={ (e: any) => props.onChange(props.feature.id, { NomWidth: e.target.value }) }/>
                        </label>
                        <label>
                            Height (mm)
                            <input value={ line.NomHeight } name='NomHeight' onBlur={ (e: any) => props.onChange(props.feature.id, { NomHeight: e.target.value }) }/>
                        </label>
                    </>
                }
            </fieldset>
        </div>
    );
}