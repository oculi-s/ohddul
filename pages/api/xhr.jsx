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

export const crawl = {
    meta: async (props) => {
        return await Fetch('/api/crawl/meta', props);
    }, group: async (props) => {
        return await Fetch('/api/crawl/group', props);
    }, price: async (props) => {
        return await Fetch('/api/crawl/price', props);
    }, earn: async (props) => {
        return await Fetch('/api/crawl/earn', props);
    }, share: async (props) => {
        return await Fetch('/api/crawl/share', props);
    }
}
export const dart = {
    list: async (props) => {
        return await Fetch('/api/dart/list', props);
    }, earn: async (props) => {
        return await Fetch('/api/dart/earn', props);
    },
}