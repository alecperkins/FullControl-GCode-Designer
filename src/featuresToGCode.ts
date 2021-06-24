
import { getData } from "./data";
import { LineCartesian, LineEquationPolar } from "./features";
import { LineCartesianAttributes } from "./features/LineCartesian";
import { LineEquationPolarAttributes } from "./features/LineEquationPolar";
import ToolPath from "./ToolPath";

function evaluate (feature: LineCartesianAttributes | LineEquationPolarAttributes, toolpath: ToolPath) {
    if (LineCartesian.isType(feature)) {
        LineCartesian.evaluate(feature, toolpath);
    } else if (LineEquationPolar.isType(feature)) {
        LineEquationPolar.evaluate(feature, toolpath);
    }
}

export default async function featuresToGCode (feature_ids: Array<string>) {
    const features = await Promise.all(feature_ids.map(id => getData(`/features/${ id }`)));

    const toolpath = new ToolPath();

    toolpath.addComment("START OF FEATURES");

    features.forEach((feature,i) => {
        toolpath.addComment(`${ i + 1 }: ${ feature.type }`);
        evaluate(feature, toolpath);
    });

    return toolpath.toGCode();
}
