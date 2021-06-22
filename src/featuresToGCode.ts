
import { getData } from "./data";
import { LineCartesianAttributes, LineEquationPolarAttributes } from "./features";
import { PrusaMini } from "./printers";
import { Parser } from "hot-formula-parser";
interface ToolPosition {
    x: number;
    y: number;
    z: number;
}

const feature_defaults = {
    X1: 'R0',
    Y1: 'R0',
    Z1: 'R0',
    X2: 'R0',
    Y2: 'R0',
    Z2: 'R0',
}

const print_config: { extrusion_multiplier: number } = { extrusion_multiplier: 1 };

function lineEquationPolarToGcode (feature: LineEquationPolarAttributes, previous: ToolPosition) {

    let x1 = previous.x;
    let y1 = previous.y;
    let z1 = previous.z;

    let x2 = x1;
    let y2 = y1;
    let z2 = z1;

    const Tstart = parseFloat(feature.Tstart);
    const Tend = parseFloat(feature.Tend);
    const num_segments = parseFloat(feature.NumSegments);
    const Tstep = (Tend - Tstart) / num_segments;
    
    const AngleF = feature.AngleF;
    const RadialF = feature.RadialF;
    const ZF = feature.ZF;
    const w = parseFloat(feature.NomWidth); // TODO: support equations
    const h = parseFloat(feature.NomHeight);
    // const E = 
    
    const parser = new Parser();
    
    const lines: Array<string> = [];

    let Zval = previous.z;
    for (let Tval = Tstart; Tval < Tend; Tval += Tstep) {
        parser.setVariable('Tval', Tval);
        parser.setVariable('Zval', Zval);
        const Aval = parser.parse(AngleF).result;
        const Rval = parser.parse(RadialF).result;
        parser.setVariable('Aval', Aval);
        parser.setVariable('Rval', Rval);
        Zval = parser.parse(ZF).result;
        // TODO: E F T
        x2 = Rval * Math.cos(Aval);
        y2 = Rval * Math.sin(Aval);
        z2 = Zval;
        const length = Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 0.5);
        const e = length * w * h * print_config.extrusion_multiplier;
        const travel_line: Array<string> = [];
        if (x1 !== previous.x) {
            travel_line.push(`X${ x1 }`);
        }
        if (y1 !== previous.y) {
            travel_line.push(`Y${ y1 }`);
        }
        if (z1 !== previous.z) {
            travel_line.push(`Z${ z1 }`);
        }
        if (travel_line.length > 0) {
            travel_line.unshift('G0');
            lines.push(travel_line.join(' '));
        }

        const gcode_line = [
            feature.mode === 'Print' ? 'G1' : 'G0',
            // f ? `F${ f }` : '',
            x2 !== x1 ? `X${ x2 }` : '',
            y2 !== y1 ? `Y${ y2 }` : '',
            z2 !== z1 ? `Z${ z2 }` : '',
            `E${ e }`,
        ].filter(x => x);
        lines.push(gcode_line.join(' '));
    }

    return { lines, endpoint: { x: x2, y: y2, z: z2 } };
}

// TODO: printer.extrudeTo(); printer.travelTo()
// function _xyz (x1: number, y1: number, z1: number, x2: number, y2: number, z2)


function lineCartesianToGcode (feature: LineCartesianAttributes, previous: ToolPosition) {

    const lines: Array<string> = [];

    feature.X1 = feature.X1 || feature_defaults.X1;
    feature.Y1 = feature.Y1 || feature_defaults.Y1;
    feature.Z1 = feature.Z1 || feature_defaults.Z1;
    feature.X2 = feature.X2 || feature_defaults.X2;
    feature.Y2 = feature.Y2 || feature_defaults.Y2;
    feature.Z2 = feature.Z2 || feature_defaults.Z2;
    
    const x1 = feature.X1[0] === 'R' ? previous.x + parseFloat(feature.X1.slice(1)) : parseFloat(feature.X1);
    const y1 = feature.Y1[0] === 'R' ? previous.y + parseFloat(feature.Y1.slice(1)) : parseFloat(feature.Y1);
    const z1 = feature.Z1[0] === 'R' ? previous.z + parseFloat(feature.Z1.slice(1)) : parseFloat(feature.Z1);
    const x2 = feature.X2[0] === 'R' ? x1 + parseFloat(feature.X2.slice(1)) : parseFloat(feature.X2);
    const y2 = feature.Y2[0] === 'R' ? y1 + parseFloat(feature.Y2.slice(1)) : parseFloat(feature.Y2);
    const z2 = feature.Z2[0] === 'R' ? z1 + parseFloat(feature.Z2.slice(1)) : parseFloat(feature.Z2);
    const w = parseFloat(feature.NomWidth);
    const h = parseFloat(feature.NomHeight);
    const f = feature.TravelSpeed ? parseFloat(feature.TravelSpeed) : null;

    console.log(feature, x1, feature.X1[0] === 'R', previous.x, parseFloat(feature.X1.slice(1)))

    // Calculate volume of extrusion
    const length = Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 0.5);
    const e = length * w * h * print_config.extrusion_multiplier;

    const travel_line: Array<string> = [];
    if (x1 !== previous.x) {
        travel_line.push(`X${ x1 }`);
    }
    if (y1 !== previous.y) {
        travel_line.push(`Y${ y1 }`);
    }
    if (z1 !== previous.z) {
        travel_line.push(`Z${ z1 }`);
    }
    if (travel_line.length > 0) {
        travel_line.unshift('G0');
        lines.push(travel_line.join(' '));
    }

    const gcode_line = [
        feature.mode === 'Print' ? 'G1' : 'G0',
        // f ? `F${ f }` : '',
        x2 !== x1 ? `X${ x2 }` : '',
        y2 !== y1 ? `Y${ y2 }` : '',
        z2 !== z1 ? `Z${ z2 }` : '',
        `E${ e }`,
    ].filter(x => x);
    lines.push(gcode_line.join(' '));

    console.log({ x1, y1, z1, x2, y2, z2 });

    return { lines, endpoint: { x: x2, y: y2, z: z2 } };
}

function toGcode (feature: LineCartesianAttributes | LineEquationPolarAttributes, previous: ToolPosition) {
    if (feature.type === 'LineCartesian') {
        return lineCartesianToGcode(feature, previous);
    }
    return lineEquationPolarToGcode(feature, previous);
}

export default async function featuresToGCode (feature_ids: Array<string>) {
    const features = await Promise.all(feature_ids.map(id => getData(`/features/${ id }`)));

    const feature_lines: Array<string> = [];

    let nozzle_position: ToolPosition = {
        x: 0,
        y: 0,
        z: 0,
    }
    features.forEach((feature,i) => {
        const { lines, endpoint } = toGcode(feature, nozzle_position);
        nozzle_position = endpoint;
        feature_lines.push(
            `\n; ${ i + 1 }: ${ feature.type }`,
            ...lines,
        );
    });

    const lines = [
        // PrusaMini.start,
        "G90 ; use absolute coordinates",
        "M83 ; extruder relative mode\n\n",
        ...feature_lines,
        // PrusaMini.end,
    ];
    return lines.join('\n');
}
