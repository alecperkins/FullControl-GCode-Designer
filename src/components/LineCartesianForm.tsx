import React from 'react';
import { LineCartesianAttributes, LineEquationPolarAttributes } from '../features';

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


export function LineEquationPolarForm (props: { feature: LineEquationPolarAttributes, onChange: any, onRemove: any }) {
    const line = props.feature;
    function onChange (update) {
        props.onChange({ ...props.feature, ...update });
    }
    return (
        <div className={ styles.scope }>
            <div className={ styles.name }>Line Eq Polar</div>
  
            <fieldset>
                <legend>Center</legend>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>X (mm)</span>
                    <Field value={ line.X } name='X' placeholder='' onBlur={ (e: any) => onChange({ X: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Y (mm)</span>
                    <Field value={ line.Y } name='Y' placeholder='' onBlur={ (e: any) => onChange({ Y: e.target.value }) }/>
                </label>
            </fieldset>

            <fieldset>
                <legend>Formulas</legend>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Angle F</span>
                    <Field value={ line.AngleF } name='AngleF' placeholder='' onBlur={ (e: any) => onChange({ AngleF: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Radius F</span>
                    <Field value={ line.RadialF } name='RadialF' placeholder='' onBlur={ (e: any) => onChange({ RadialF: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Z F</span>
                    <Field value={ line.ZF } name='ZF' placeholder='' onBlur={ (e: any) => onChange({ ZF: e.target.value }) }/>
                </label>

            </fieldset>

            <fieldset>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>T start</span>
                    <Field value={ line.Tstart } name='Tstart' placeholder='' onBlur={ (e: any) => onChange({ Tstart: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>T end</span>
                    <Field value={ line.Tend } name='Tend' placeholder='' onBlur={ (e: any) => onChange({ Tend: e.target.value }) }/>
                </label>
                <label className={ styles.field }>
                    <span className={ styles.labelText }>Num Segments</span>
                    <Field value={ line.NumSegments } name='NumSegments' placeholder='' onBlur={ (e: any) => onChange({ NumSegments: e.target.value }) }/>
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
