const cacheStore = new Map();
const pendingRequests = new Map();

const getFromCache = async (key, fetcher, options = {}) => {
    const { ttlMs = 0, force = false } = options;
    const now = Date.now();
    const cached = cacheStore.get(key);

    if (!force && cached) {
        if (cached.expiresAt > now) {
            return cached.value;
        }

        cacheStore.delete(key);
    }

    if (!force && pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    const request = Promise.resolve()
        .then(fetcher)
        .then((value) => {
            if (pendingRequests.get(key) === request) {
                cacheStore.set(key, {
                    value,
                    expiresAt: Date.now() + ttlMs,
                });
            }

            return value;
        })
        .finally(() => {
            if (pendingRequests.get(key) === request) {
                pendingRequests.delete(key);
            }
        });

    pendingRequests.set(key, request);
    return request;
};

const invalidateCache = (key) => {
    cacheStore.delete(key);
    pendingRequests.delete(key);
};

const invalidateByPrefix = (prefix) => {
    for (const key of cacheStore.keys()) {
        if (key.startsWith(prefix)) {
            cacheStore.delete(key);
        }
    }

    for (const key of pendingRequests.keys()) {
        if (key.startsWith(prefix)) {
            pendingRequests.delete(key);
        }
    }
};

const clearCache = () => {
    cacheStore.clear();
    pendingRequests.clear();
};

export {
    getFromCache,
    invalidateCache,
    invalidateByPrefix,
    clearCache,
};
