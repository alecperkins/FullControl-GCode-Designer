import LineCartesian from "./LineCartesian";
import LineEquationPolar from "./LineEquationPolar";

export { LineCartesian, LineEquationPolar };

export type AllFeatureTypes = typeof LineCartesian | typeof LineEquationPolar;

