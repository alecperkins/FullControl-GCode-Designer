
interface Point { x: number; y: number; z: number }

export default class ToolPath {
    x: number;
    y: number;
    z: number;
    e: number | null;
    f: number;

    extrusion_multiplier: number;
    lines: Array<string>;

    constructor () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.e = null;
        this.f = 0;
        this.extrusion_multiplier = 1;

        this.lines = [
            "G90 ; use absolute coordinates",
            "M83 ; extruder relative mode\n\n",
        ];
    }

    extrudeTo (point: Point, e: number, feedrate?: number) {
        const line: Array<string> = [
            'G1',
        ];
        if (point.x !== this.x) {
            line.push(`X${ point.x }`);
        }
        if (point.y !== this.y) {
            line.push(`Y${ point.y }`);
        }
        if (point.z !== this.z) {
            line.push(`Z${ point.z }`);
        }
        line.push(`E${ e }`);
        this.lines.push(line.join(' '));
    }

    travelTo (point: Point, feedrate?: number) {
        const line: Array<string> = [];
        if (point.x !== this.x) {
            line.push(`X${ point.x }`);
        }
        if (point.y !== this.y) {
            line.push(`Y${ point.y }`);
        }
        if (point.z !== this.z) {
            line.push(`Z${ point.z }`);
        }
        if (line.length > 0) {
            line.unshift('G0');
            this.lines.push(line.join(' '));
        }
    }

    isAtPosition (point: Point) {
        return (
            point.x !== this.x
            || point.y !== this.y
            || point.z !== this.z
        );
    }

    addComment (comment: string) {
        this.lines.push(`; ${ comment }`);
    }

    addLine (line: string) {
        this.lines.push(line);
    }

    toGCode () {
        // TODO: start_code, end_code
        return this.lines.join('\n');
    }

    setMachine () {} // sets start and end code, extrusion
    setFilament () {}

    // TODO: setFeedrate ()
    // setTool

}
