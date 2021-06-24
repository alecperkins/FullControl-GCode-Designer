
export interface BaseFeatureAttributes {
    id: string;
    comments: string;
    type: string;
    is_enabled: boolean;
}

export function createFeature<T extends BaseFeatureAttributes> (type: string, attrs: Omit<T, keyof BaseFeatureAttributes>) {
    return {
        ...attrs,
        type,
        id: Math.random().toString(), // TODO: ULID?,
        comments: '',
        is_enabled: true,
    } as T;
}
