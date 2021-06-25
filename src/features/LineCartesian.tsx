import ToolPath from "../ToolPath";
import { BaseFeatureAttributes, createFeature } from "./BaseFeature";
import Field from "./Field";

import styles from '../components/LineCartesianForm.module.scss'; // TODO: relocate
import { ParamSet } from "./Param";

export interface LineCartesianAttributes extends BaseFeatureAttributes {
    X1: string;
    Y1: string;
    Z1: string;
    X2: string;
    Y2: string;
    Z2: string;
    TravelSpeed: string;
    mode: "Print" | "Travel";
    NomWidth: string;
    NomHeight: string;
    // E EvalueOverride
    // F SpeedOverride
    // T ToolNumber
}

export default class LineCartesian {

    static type = "LineCartesian";

    static defaults = {
        X1: "R0",
        Y1: "R0",
        Z1: "R0",
        X2: "R0",
        Y2: "R0",
        Z2: "R0",
    };

    static isType (feature: BaseFeatureAttributes): feature is LineCartesianAttributes {
        return feature.type === this.type;
    }

    static create () {
        return createFeature<LineCartesianAttributes>(this.type, {
            Y1: "",
            X1: "",
            Z1: "",
            X2: "",
            Y2: "",
            Z2: "",
            TravelSpeed: "",
            mode: "Print",
            NomWidth: "0.45",
            NomHeight: "0.2",
        });
    }

    static evaluate (feature: LineCartesianAttributes, toolpath: ToolPath, params: ParamSet) {

        feature.X1 = feature.X1 || this.defaults.X1;
        feature.Y1 = feature.Y1 || this.defaults.Y1;
        feature.Z1 = feature.Z1 || this.defaults.Z1;
        feature.X2 = feature.X2 || this.defaults.X2;
        feature.Y2 = feature.Y2 || this.defaults.Y2;
        feature.Z2 = feature.Z2 || this.defaults.Z2;

        // TODO: make _every_ field parsed, with params

        const x1 = feature.X1[0] === "R" ? toolpath.x + parseFloat(feature.X1.slice(1)) : parseFloat(feature.X1);
        const y1 = feature.Y1[0] === "R" ? toolpath.y + parseFloat(feature.Y1.slice(1)) : parseFloat(feature.Y1);
        const z1 = feature.Z1[0] === "R" ? toolpath.z + parseFloat(feature.Z1.slice(1)) : parseFloat(feature.Z1);
        const x2 = feature.X2[0] === "R" ? x1 + parseFloat(feature.X2.slice(1)) : parseFloat(feature.X2);
        const y2 = feature.Y2[0] === "R" ? y1 + parseFloat(feature.Y2.slice(1)) : parseFloat(feature.Y2);
        const z2 = feature.Z2[0] === "R" ? z1 + parseFloat(feature.Z2.slice(1)) : parseFloat(feature.Z2);
        const w = parseFloat(feature.NomWidth);
        const h = parseFloat(feature.NomHeight);
        // const f = feature.TravelSpeed ? parseFloat(feature.TravelSpeed) : null;

        // Calculate volume of extrusion
        const length = Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 0.5);
        const e = length * w * h * toolpath.extrusion_multiplier;

        const start_point = { x: x1, y: y1, z: z1 };
        const end_point = { x: x2, y: y2, z: z2 };

        if (!toolpath.isAtPosition(start_point)) {
            toolpath.travelTo(start_point);
        }
        toolpath.extrudeTo(end_point, e);
    }

    static Form (props: { feature: LineCartesianAttributes, onChange: any, onRemove: any }) {
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
                        Print
                        <input type="radio" name="mode" value="Print" checked={ line.mode === "Print" } onChange={ (e: any) => onChange({ mode: e.target.value }) } />
                    </label>
                    <label>
                        Travel
                        <input type="radio" name="mode" value="Travel" checked={ line.mode === "Travel" } onChange={ (e: any) => onChange({ mode: e.target.value }) } />
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
}
