import fs from "fs";

export const parsePath = (url: string) => {
    return url.replace(/^@/, process.cwd());
};

const text = (path: string, def: string = "") => {
    try {
        return fs.readFileSync(parsePath(path), "utf-8");
    } catch (e) {
        return def;
    }
};

const json = (path: string, def: Object = {}) => {
    try {
        return JSON.parse(text(path));
    } catch (e) {
        return def;
    }
};

const save = (path: string, data: Object) => {
    try {
        fs.mkdirSync(parsePath(path).split("/").slice(0, -1).join("/"), {
            recursive: true,
        });
        fs.writeFileSync(parsePath(path), JSON.stringify(data));
        return true;
    } catch (e) {
        return false;
    }
};
const move = (from: string, to: string) => {
    try {
        fs.mkdirSync(parsePath(to).split("/").slice(0, -1).join("/"), {
            recursive: true,
        });
        fs.renameSync(parsePath(from), parsePath(to));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const remove = (path: string) => {
    try {
        fs.unlinkSync(parsePath(path));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const Fs = { text, json, save, move, remove };
export default Fs;
