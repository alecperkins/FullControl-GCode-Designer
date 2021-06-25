import React from "react";
import styles from "./App.module.scss";
import Button from "react-bootstrap/Button";

import { AllFeatureTypes, LineCartesian, LineEquationPolar } from "./features";
import featuresToGCode from "./featuresToGCode";
import { deleteData, putData, useData } from "./data";
import { useState } from "react";
import Preview from "./Preview";
import Variable from "./features/Variable";
import { features } from "process";


function FeatureRow (props: { feature_id: string, onRemove: any }) {
  const feature_req = useData(`/features/${ props.feature_id }`);
  async function onChange (update) {
    await putData(`/features/${ props.feature_id }`, update);
    feature_req.mutate();
  }
  let content: any;

  if (feature_req.data) {
    if (feature_req.data.type === LineEquationPolar.type) {
      content = <LineEquationPolar.Form feature={ feature_req.data } onChange={ onChange } onRemove={ props.onRemove } />
    } else if (feature_req.data.type === LineCartesian.type) {
      content = <LineCartesian.Form feature={ feature_req.data } onChange={ onChange } onRemove={ props.onRemove } />
    } else {
      content = `Unknown feature type ${ feature_req.data.type }`;
    }
  } else {
    content = 'Loading...';
  }

  return (
    <li>
      { props.feature_id } { feature_req.data?.type }<br />
      {
        content
      }
      <label>enabled <input type="checkbox" checked /></label>
      <Button onClick={ () => props.onRemove(props.feature_id) }>Remove</Button>
    </li>
  );
}

function VariableRow (props: { variable_id: string, onRemove: any }) {
  const feature_req = useData(`/variables/${ props.variable_id }`);
  async function onChange (update) {
    await putData(`/variables/${ props.variable_id }`, update);
    feature_req.mutate();
  }
  let content: any;

  if (feature_req.data) {
    content = <Variable.Form variable={ feature_req.data } onChange={ onChange } onRemove={ props.onRemove } />
  } else {
    content = 'Loading...';
  }

  return (
    <li>
      {
        content
      }
      <Button onClick={ () => props.onRemove(props.variable_id) }>Remove</Button>
    </li>
  );
}

function FeatureList (props: { features: Array<string>, onRemove: any }) {
  return (
    <ol>
      {
        props.features.map(feature_id => (
          <FeatureRow key={ feature_id } feature_id={ feature_id } onRemove={ () => props.onRemove(feature_id) } />
        ))
      }
    </ol>
  )
}

function VariableList (props: { variables: Array<string>, onRemove: any }) {
  return (
    <ol>
      {
        props.variables.map(variable_id => (
          <VariableRow key={ variable_id } variable_id={ variable_id } onRemove={ () => props.onRemove(variable_id) } />
        ))
      }
    </ol>
  )
}

export default function App () {
  const features_req = useData("/features");
  const variables_req = useData("/variables");
  const [gcode, setGcode] = useState('');

  async function addFeature (feature_type: AllFeatureTypes) {
    const new_feature = feature_type.create();
    await putData(`/features/${ new_feature.id }`, new_feature);
    features_req.mutate();
  }

  async function removeFeature (id: string) {
    await deleteData(`/features/${ id }`);
    features_req.mutate();
  }

  async function addVariable () {
    const new_feature = Variable.create();
    await putData(`/variables/${ new_feature.id }`, new_feature);
    variables_req.mutate();
  }

  async function removeVariable (id: string) {
    await deleteData(`/variables/${ id }`);
    features_req.mutate();
  }

  async function generateGCode () {
    const start = Date.now();
    const new_gcode = await featuresToGCode();
    setGcode(new_gcode);
    console.log(Date.now() - start, 'ms gcode');
  }

  console.log('App', features_req.data);

  if (!features_req.data || !variables_req.data) {
    return <div>Loading…</div>;
  }


  return (
    <div className={ styles.scope }>
      <div>
        <VariableList variables={ variables_req.data } onRemove={ removeVariable } />
        <Button onClick={ addVariable }>Add Variable</Button>
      </div>
      <div className={ styles.editor }>
        <FeatureList features={ features_req.data } onRemove={ removeFeature } />
        <Button variant="secondary" onClick={ () => addFeature(LineCartesian) }>Add Line (Cartesian)</Button> { /* TODO: copy previous end coordinates */}
        <Button variant="secondary" onClick={ () => addFeature(LineEquationPolar) }>Add Line Eq (Polar)</Button> { /* TODO: copy previous end coordinates */}
      </div>
      <div className={ styles.preview }>
        <Button variant="primary" onClick={ generateGCode }>Generate GCode</Button>
        <Preview gcode={ gcode } />
      </div>
    </div>
  );
}
