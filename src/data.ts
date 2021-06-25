
import useSWR from "swr";

function loadData (def: any) {
    let d;
    try {
        d = JSON.parse(window.localStorage.getItem('data') as string)
    } catch (error) {
    }
    d = d || def;
    return d;
}

const data: any = loadData({
    features: {},
    feature_list: [],
    params: {},
    param_list: [],
});

let save_timeout;
function saveData () {
    clearTimeout(save_timeout as any);
    save_timeout = setTimeout(() => {
        window.localStorage.setItem('data', JSON.stringify(data));
    }, 1000);
}


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
        case 'params': {
            if (parts[2]) {
                res = {...data.params[parts[2]]}
            } else {
                res = Array.from(data.param_list);
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
        case 'params': {
            if (parts[2]) {
                if (!data.params[parts[2]]) {
                    data.param_list.push(payload.id);
                }
                data.params[parts[2]] = {...payload};
            } else {
                data.param_list = Array.from(payload);
            };
            break;
        }
        default: {
            const err: any = new Error();
            err.status = 404;
            return Promise.reject(err);
        }
    }
    saveData();
    return Promise.resolve(payload);
}

export function deleteData (key) {
    const parts = key.split('/');
    switch (parts[1]) {
        case 'features': {
            if (parts[2]) {
                delete data.features[parts[2]];
                data.feature_list = data.feature_list.filter(id => id !== parts[2]);
                saveData();
                return Promise.resolve();
            };
            break;
        }
        case 'params': {
            if (parts[2]) {
                delete data.params[parts[2]];
                data.param_list = data.param_list.filter(id => id !== parts[2]);
                saveData();
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
