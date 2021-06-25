
import { getData } from "./data";
import { LineCartesian, LineEquationPolar } from "./features";
import { LineCartesianAttributes } from "./features/LineCartesian";
import { LineEquationPolarAttributes } from "./features/LineEquationPolar";
import { VariableSet } from "./features/Variable";
import ToolPath from "./ToolPath";

function evaluate (feature: LineCartesianAttributes | LineEquationPolarAttributes, toolpath: ToolPath, variables: VariableSet) {
    if (LineCartesian.isType(feature)) {
        LineCartesian.evaluate(feature, toolpath, variables);
    } else if (LineEquationPolar.isType(feature)) {
        LineEquationPolar.evaluate(feature, toolpath, variables);
    }
}

export default async function featuresToGCode () {
    const variable_ids = await getData("/variables");
    const variables: VariableSet = await Promise.all(variable_ids.map(id => getData(`/variables/${ id }`)));
    const feature_ids = await getData("/features/");
    const features: Array<LineCartesianAttributes | LineEquationPolarAttributes> = await Promise.all(feature_ids.map(id => getData(`/features/${ id }`)));

    const toolpath = new ToolPath();

    toolpath.addComment("START OF FEATURES");

    features.forEach((feature,i) => {
        toolpath.addComment(`${ i + 1 }: ${ feature.type }`);
        evaluate(feature, toolpath, variables);
    });

    return toolpath.toGCode();
}
