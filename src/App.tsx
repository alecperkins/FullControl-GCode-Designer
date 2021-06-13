import React from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import Button from 'react-bootstrap/Button';
import { features } from 'process';
import LineCartesianForm from './components/LineCartesianForm';

import Feature, { LineCartesian } from './features';
import featuresToGCode from './featuresToGCode';



type FeatureUpdateFn = (id: string, change: Partial<LineCartesian>) => void;


function FeatureRow (props: { feature: Feature, onChange: FeatureUpdateFn, onRemove: any }) {
  return (
    <li>
      <LineCartesianForm feature={ props.feature } onChange={ props.onChange } onRemove={ props.onRemove } />
      <label>enabled <input type='checkbox' /></label>
      <Button onClick={ () => props.onRemove(props.feature.id) }>Remove</Button>
    </li>
  );
}

function FeatureList (props: { features: Array<Feature>, onChange: FeatureUpdateFn, onRemove: any }) {

  return (
    <ol>
      {
        props.features.map(feature => (
          <FeatureRow key={ feature.id } feature={ feature } onChange={ props.onChange } onRemove={ props.onRemove } />
        ))
      }
    </ol>
  )
}

export default function App () {
  const [features, setFeatures] = React.useState<Array<Feature>>([]);

  function addFeature () {
    setFeatures((prev) => [...prev, new LineCartesian({} as any)]);
  }

  function updateFeature (id: string, change: Partial<LineCartesian>) {
    setFeatures((prev) => {
      return prev.map(f => {
        if (f.id === id) {
          f.update(change);
        }
        return f;
      });
    });
  }

  function removeFeature (id: string) {
    setFeatures((prev) => {
      return prev.filter(f => f.id !== id);
    });
  }

  function generateGCode () {
    const gcode = featuresToGCode(features);
    console.log(gcode);
  }

  return (
    <div className={ styles.scope }>
      <Button variant='primary' onClick={ generateGCode }>Generate GCode</Button>
      <FeatureList features={ features } onChange={ updateFeature } onRemove={ removeFeature } />
      <Button variant='secondary' onClick={ addFeature }>Add Line (Cartesian)</Button> { /* TODO: copy previous end coordinates */}
    </div>
  );
}
