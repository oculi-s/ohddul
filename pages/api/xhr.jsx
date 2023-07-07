const Fetch = async (url, props) => {
    props = JSON.stringify(props || {});
    let res = await fetch(url, {
        body: props, method: 'post'
    });
    if (res.ok) {
        try {
            return await res.json();
        } catch {
            return res.status;
        }
    }
    return false;
}

export const json = {
    read: async (props) => {
        return await Fetch('/api/json/read', props);
    }, write: async (props) => {
        return await Fetch('/api/json/write', props);
    }, queue: async (props) => {
        return await Fetch('/api/json/queue', props);
    }, up: async (props) => {
        return await Fetch('/api/json/up', props);
    }, toggle: async (props) => {
        return await Fetch('/api/json/toggle', props);
    }
}

export const user = {
    find: async (props) => {
        return await Fetch('/api/user/find', props);
    }, change: async (props) => {
        return await Fetch('/api/user/change', props);
    }
}