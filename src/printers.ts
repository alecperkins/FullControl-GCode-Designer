export const PrusaMini = {
    start: `;GCode generated with FullControl GCode Designer software - contact Andy Gleadall (a.gleadall@lboro.ac.uk) for more information

M201 X1250 Y1250 Z400 E5000 ; sets maximum accelerations, mm/sec^2
M203 X180 Y180 Z12 E80 ; sets maximum feedrates, mm/sec
M204 P1250 R1250 T1250 ; sets acceleration (P, T) and retract acceleration (R), mm/sec^2
M205 X8.00 Y8.00 Z2.00 E10.00 ; sets the jerk limits, mm/sec
M205 S0 T0 ; sets the minimum extruding and travel feed rate, mm/sec


G90 ; use absolute coordinates
M83 ; extruder relative mode
M104 S170 ; set extruder temp for bed leveling
M140 S80
M109 R170 ; wait for bed leveling temp
M190 S80
G28 ; home all without mesh bed level
G29 ; mesh bed leveling 
M104 S230
G92 E0.0
G1 Y-2.0 X179 F2400
G1 Z3 F720
M109 S230

; intro line
G1 X170 F1000
G1 Z0.2 F720
G1 X110.0 E8.0 F900
M73 P0 R91
G1 X40.0 E10.0 F700
G92 E0.0

M221 S100 ; set flow
G21 ; set units to millimeters
G90 ; use absolute coordinates
M83 ; use relative distances for extrusion
M900 K0 ; No linear advance


G92 E0.0

G1 Z0.200 F9000.000


G1 E-3.20000 F4200.00000
G1 Z0.400 F9000.000
G1 X20.0 Y10.0
G1 Z0.300
G1 E3.20000 F2400.00000


M106 S255 ; set fan speed

;END OF THE START GCODE
`,
    end: `;START OF THE END GCODE


G1 E-5.0 F4200.00000


G91 ;Relative positioning
G1 Z0.5 F2400 ;Raise Z
G90 ;Absolute positionning

G1 X178 Y178 F4200 ; park print head

M104 S0 ; turn off temperature
M140 S0 ; turn off heatbed
M107 ; turn off fan
M221 S100 ; reset flow
M900 K0 ; reset LA
M84 ; disable motors
M73 P100 R0
`,
}