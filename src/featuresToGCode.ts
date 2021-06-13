
import Feature from './features';
import { PrusaMini } from './printers';

export default function featuresToGCode (features: Array<Feature>) {
    const lines = [
        PrusaMini.start,
        ...features.map((f,i) => `; Feature ${ i }: ${ f.name }\n${ f.toGCode() }`),
        PrusaMini.end,
    ];
    return lines.join('\n');
}
