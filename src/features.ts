
interface BaseFeature {
    id: string;
    comments: string;
}

export interface LineCartesianAttributes extends BaseFeature {
    X1: string;
    Y1: string;
    Z1: string;
    X2: string;
    Y2: string;
    Z2: string;
    TravelSpeed: string;
    mode: 'Print' | 'Travel';
    NomWidth: string;
    NomHeight: string;
    // E EvalueOverride
    // F SpeedOverride
    // T ToolNumber
}

export class LineCartesian implements LineCartesianAttributes {

    name = 'LineCartesian';

    id: string;
    comments: string;
    Y1: string;
    X1: string;
    Z1: string;
    X2: string;
    Y2: string;
    Z2: string;
    TravelSpeed: string;
    mode: 'Print' | 'Travel';
    NomWidth: string;
    NomHeight: string;

    constructor (attrs: LineCartesianAttributes) {
        this.id = Math.random().toString(); // TODO: ULID?
        this.X1 = attrs.X1 ?? 'R0';
        this.Y1 = attrs.Y1 ?? 'R0';
        this.Z1 = attrs.Z1 ?? 'R0';
        this.X2 = attrs.X2 ?? 'R0';
        this.Y2 = attrs.Y2 ?? 'R0';
        this.Z2 = attrs.Z2 ?? 'R0';
        this.TravelSpeed = attrs.TravelSpeed;
        this.mode = attrs.mode ?? 'Print';
        this.NomWidth = attrs.NomWidth ?? '0.45';
        this.NomHeight = attrs.NomHeight ?? '0.2';
        this.comments = attrs.comments ?? '';
    }

    update (change: Partial<LineCartesianAttributes>) {
        this.X1 = change.X1 ?? this.X1;
        this.Y1 = change.Y1 ?? this.Y1;
        this.Z1 = change.Z1 ?? this.Z1;
        this.X2 = change.X2 ?? this.X2;
        this.Y2 = change.Y2 ?? this.Y2;
        this.Z2 = change.Z2 ?? this.Z2;
        this.TravelSpeed = change.TravelSpeed ?? this.TravelSpeed;
        this.mode = change.mode ?? this.mode;
        this.NomWidth = change.NomWidth ?? this.NomWidth;
        this.NomHeight = change.NomHeight ?? this.NomHeight;
        this.comments = change.comments ?? this.comments;
    }

    toJSON () {
        return {
            X1: this.X1,
            Y1: this.Y1,
            Z1: this.Z1,
            X2: this.X2,
            Y2: this.Y2,
            Z2: this.Z2,
            TravelSpeed: this.TravelSpeed,
            mode: this.mode,
            NomWidth: this.NomWidth,
            NomHeight: this.NomHeight,
            comments: this.comments,
        };
    }

    // TODO: pass current print state (position, speed, )
    toGCode (print_config: { extrusion_multiplier: number } = { extrusion_multiplier: 1 }) {
        
        
        const x1 = parseFloat(this.X1); // TODO: convert relative instructions
        const y1 = parseFloat(this.Y1);
        const z1 = parseFloat(this.Z1);
        const x2 = parseFloat(this.X2);
        const y2 = parseFloat(this.Y2);
        const z2 = parseFloat(this.Z2);
        const w = parseFloat(this.NomWidth);
        const h = parseFloat(this.NomHeight);
        const f = this.TravelSpeed ? parseFloat(this.TravelSpeed) : null;

        // Calculate volume of extrusion
        const length = Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 0.5);
        const e = length * w * h * print_config.extrusion_multiplier;

        const gcode_line = [
            this.mode === 'Print' ? 'G1' : 'G0',
            // f ? `F${ f }` : '',
            `X${ x2 }`,
            `Y${ y2 }`,
            `Z${ z2 }`,
            `E${ e }`,
        ].filter(x => x);

        return gcode_line.join(' ');
    }
}



export default LineCartesian; // | LinePolar;


/*


        Rem         Call AddLine(dblCurrentX, dblCurrentY, dblCurrentZ, dblXnew2, dblYnew2, dblZnew2, strPrintTravelNew, dblWidthNew, dblHeightNew, dblE, dblFspeed, iToolNumber, iCurrentToolNumber, dblPrintSpeed, dblTravelSpeed, i, strFeatIDtree, strFeatIDrenumbered, arrCommands, lCurrentCommand, dblFeedstockFilamentDiameter, strExtrusionUnits)
        
        
        arrCommands(cX1, lCurrentCommand) = dblCurrentX
        arrCommands(cY1, lCurrentCommand) = dblCurrentY
        arrCommands(cZ1, lCurrentCommand) = dblCurrentZ
        arrCommands(cX2, lCurrentCommand) = dblXnew2
        arrCommands(cY2, lCurrentCommand) = dblYnew2
        arrCommands(cZ2, lCurrentCommand) = dblZnew2
        arrCommands(cCommandType, lCurrentCommand) = strPrintTravelNew

        If strPrintTravelNew = "Print" Then
            arrCommands(cW, lCurrentCommand) = dblWidthNew
            arrCommands(cH, lCurrentCommand) = dblHeightNew
            If dblE <> 0 Then
                arrCommands(cE, lCurrentCommand) = dblE
            Else
                dblLength = ((dblXnew2 - dblCurrentX) ^ 2 + (dblYnew2 - dblCurrentY) ^ 2 + (dblZnew2 - dblCurrentZ) ^ 2) ^ 0.5
                arrCommands(cE, lCurrentCommand) = dblLength * dblWidthNew * dblHeightNew * Emultiplier
            End If
            
            If dblFspeed <> 0 Then
                arrCommands(cF, lCurrentCommand) = dblFspeed
            Else
                arrCommands(cF, lCurrentCommand) = dblPrintSpeed
            End If
            
        Else
            arrCommands(cW, lCurrentCommand) = 0
            arrCommands(cH, lCurrentCommand) = 0
            arrCommands(cE, lCurrentCommand) = 0
            
            If dblFspeed <> 0 Then
                arrCommands(cF, lCurrentCommand) = dblFspeed
            Else
                arrCommands(cF, lCurrentCommand) = dblTravelSpeed
            End If
            
        End If


        'Begin the GCODE string for a printed line command
        If arrCommands(cCommandType, iSub) = "Print" Then
            strCODE = "G1"
        Else
            strCODE = "G0"
        End If
            
        'If speed has changed, add it to the GCODE
        If Not dblCheckTheSame(CDbl(dblFsub), CDbl(dblCurrentSpeed), 10) Then
            strCODE = strCODE & " F" & Format(dblFsub, "###")
            dblCurrentSpeed = dblFsub
        End If
        'If X has changed, add it to the GCODE
        If Not dblCheckTheSame(CDbl(arrCommands(cX1, iSub)), CDbl(arrCommands(cX2, iSub)), 10) Then
            dblXsub = CDbl(arrCommands(cX2, iSub)) + dblXoffset
            strCODE = strCODE & " X" & Format(dblXsub, "##0.0##")
        End If
        'If Y has changed, add it to the GCODE
        If Not dblCheckTheSame(CDbl(arrCommands(cY1, iSub)), CDbl(arrCommands(cY2, iSub)), 10) Then
            dblYsub = CDbl(arrCommands(cY2, iSub)) + dblYoffset
            strCODE = strCODE & " Y" & Format(dblYsub, "##0.0##")
        End If
        'If Z has changed, add it to the GCODE
        If Not dblCheckTheSame(CDbl(arrCommands(cZ1, iSub)), CDbl(arrCommands(cZ2, iSub)), 10) Then
            dblZsub = CDbl(arrCommands(cZ2, iSub)) + dblZoffset
            strCODE = strCODE & " Z" & Format(dblZsub, "##0.0##")
        End If
        
        'If printing occurs, add the E value to the GCODE string
        If arrCommands(cCommandType, iSub) = "Print" Then
            'If any of X, Y or Z have changed, add an E term to the GCODE
            If Len(strCODE) > 2 Then
                strCODE = strCODE & " E" & Format(dblEsub, "##0.0#####")
            End If
        End If

*/