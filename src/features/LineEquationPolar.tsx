import ToolPath from "../ToolPath";
import { BaseFeatureAttributes, createFeature } from "./BaseFeature";
import { Parser } from "hot-formula-parser";
import Field from "./Field";

import styles from '../components/LineCartesianForm.module.scss'; // TODO: relocate

export interface LineEquationPolarAttributes extends BaseFeatureAttributes {
    X: string;
    Y: string;
    AngleF: string;
    RadialF: string;
    ZF: string;
    Tstart: string;
    Tend: string;
    NumSegments: string;
    NomWidth: string;
    NomHeight: string;
    // E EvalueOverride
    // F SpeedOverride
    // T ToolNumber
}

export default class LineEquationPolar {

    static type = "LineEquationPolar";

    static defaults = {};

    static isType (feature: BaseFeatureAttributes): feature is LineEquationPolarAttributes {
        return feature.type === this.type;
    }

    static create () {
        return createFeature<LineEquationPolarAttributes>(this.type, {
            X: "",
            Y: "",
            AngleF: "",
            RadialF: "",
            ZF: "",
            Tstart: "",
            Tend: "",
            NumSegments: "",
            NomWidth: "0.45",
            NomHeight: "0.2",
        });
    }

    static evaluate (feature: LineEquationPolarAttributes, toolpath: ToolPath) {

        const Tstart = parseFloat(feature.Tstart);
        const Tend = parseFloat(feature.Tend);
        const num_segments = parseFloat(feature.NumSegments);
        const Tstep = (Tend - Tstart) / num_segments;
        
        const cx = parseFloat(feature.X);
        const cy = parseFloat(feature.Y);
        const AngleF = feature.AngleF;
        const RadialF = feature.RadialF;
        const ZF = feature.ZF;
        const w = parseFloat(feature.NomWidth);
        const h = parseFloat(feature.NomHeight);
        console.log({ cx, cy, AngleF, RadialF, ZF, w, h });
        // const E // TODO: E value, F value
        
        const parser = new Parser();

        let Zval = toolpath.z;
        let x1 = toolpath.x;
        let y1 = toolpath.y;
        let z1 = toolpath.z;

        let x2 = x1;
        let y2 = y1;
        let z2 = z1;
        for (let Tval = Tstart; Tval < Tend; Tval += Tstep) {
            parser.setVariable("Tval", Tval);
            parser.setVariable("Zval", Zval);
            const Aval = parser.parse(AngleF).result;
            const Rval = parser.parse(RadialF).result;
            parser.setVariable("Aval", Aval);
            parser.setVariable("Rval", Rval);
            Zval = parser.parse(ZF).result;
            // TODO: E F T
            // TODO: use Decimal.js, printer precision
            x2 = cx + Rval * Math.cos(Aval);
            y2 = cy + Rval * Math.sin(Aval);
            z2 = Zval;
            const length = Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 0.5);
            const e = length * w * h * toolpath.extrusion_multiplier;

            toolpath.extrudeTo({ x: x2, y: y2, z: z2 }, e);
            x1 = x2;
            y1 = y2;
            z1 = z2;
        }
    }

    static Form (props: { feature: LineEquationPolarAttributes, onChange: any, onRemove: any }) {
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
                    <label>
                        Width (mm)
                        <Field value={ line.NomWidth } name='NomWidth' onBlur={ (e: any) => onChange({ NomWidth: e.target.value }) }/>
                    </label>
                    <label>
                        Height (mm)
                        <input value={ line.NomHeight } name='NomHeight' onBlur={ (e: any) => onChange({ NomHeight: e.target.value }) }/>
                    </label>
                </fieldset>
            </div>
        );
    }
    
}
