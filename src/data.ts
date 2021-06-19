
import useSWR from "swr";

const data: any = {
    features: {},
    feature_list: [],
};
(window as any).data = data;

export function getData (key: string) {
    console.log(`GET ${ key }`);
    const parts = key.split('/');
    let res;
    switch (parts[1]) {
        case 'features': {
            if (parts[2]) {
                res = {...data.features[parts[2]]}
            } else {
                res = Array.from(data.feature_list);
            };
            break;
        }
        default: {}
    }
    if (res) {
        console.log(`GET ${ key }`, res);
        return Promise.resolve(res);
    }
    const err: any = new Error();
    err.status = 404;
    return Promise.reject(err);
}

export function putData (key: string, payload: any) {
    console.log(`PUT ${ key }`, payload);
    const parts = key.split('/');
    switch (parts[1]) {
        case 'features': {
            if (parts[2]) {
                if (!data.features[parts[2]]) {
                    data.feature_list.push(payload.id);
                }
                data.features[parts[2]] = {...payload};
            } else {
                data.feature_list = Array.from(payload);
            };
            break;
        }
        default: {
            const err: any = new Error();
            err.status = 404;
            return Promise.reject(err);
        }
    }
    return Promise.resolve(payload);
}

export function deleteData (key) {
    const parts = key.split('/');
    switch (parts[1]) {
        case 'features': {
            if (parts[2]) {
                delete data.features[parts[2]];
                data.feature_list = data.feature_list.filter(id => id !== parts[2]);
                return Promise.resolve();
            };
            break;
        }
        default: {}
    }
    const err: any = new Error();
    err.status = 404;
    return Promise.reject(err);
}


export function useData (key) {
    return useSWR(key, getData);
}
