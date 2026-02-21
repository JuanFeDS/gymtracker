export const loadJSON = <T>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) as T : fallback;
    } catch (error) {
        console.warn(`Error loading key ${key}`, error);
        return fallback;
    }
};

export const saveJSON = <T>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error saving key ${key}`, error);
    }
};

export const removeKey = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn(`Error removing key ${key}`, error);
    }
};
