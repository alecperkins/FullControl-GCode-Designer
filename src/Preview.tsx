import React from "react";
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader';
import { OrbitControls } from '@react-three/drei';
import { Canvas  } from '@react-three/fiber';
import { saveAs } from 'file-saver';
import copy from 'copy-to-clipboard';

function downloadGcode (gcode: string) {
    saveAs(new Blob([gcode]), 'file.gcode');
}

export default function Preview (props: { gcode: string }) {
    const [show3d, setShow3d] = React.useState(true);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div>
                <label><input name="view" type="radio" onChange={ () => setShow3d(!show3d) } checked={ show3d } /> 3D</label>
                <label><input name="view" type="radio" onChange={ () => setShow3d(!show3d) } checked={ !show3d } /> GCode</label>
                <button onClick={ () => copy(props.gcode) }>Copy</button>
                <button onClick={ () => downloadGcode(props.gcode) }>Download</button>
            </div>
            <div style={{ width: '100%', flexGrow: 1 }}>
                {
                    show3d ? (
                        <Viewer3D gcode={ props.gcode } />
                        ) : (
                        <ViewerCode gcode={ props.gcode } />
                    )
                }
            </div>
        </div>
    );
}




function Viewer3D (props: { gcode: string }) {
    const gcode_object = (new GCodeLoader()).parse(props.gcode);
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[100, 100, 100]} />
            <primitive object={ gcode_object } />
            <OrbitControls enableDamping={ false } { ...{} as any }/>
        </Canvas>
    );
}

function ViewerCode (props: { gcode: string }) {
    return <div style={{ width: '100%', height: '100%' }}><pre style={{ width: '100%', height: '100%' }}><textarea style={{ width: '100%', height: '100%' }} value={ props.gcode } /></pre></div>;
}