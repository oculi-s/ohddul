import { exec, execSync } from "child_process";
import dt from "@/module/dt";

const callback = (error, stdout, stderr) => {
    if (error)
        return `Git (error) ${error.message.trim()}`;
    else if (stdout)
        return `Git (stdout) ${stdout.trim()}`;
    else
        return `Git (stderr) ${stderr.trim()}`;
}

// git SSH key
const id = process.env.GIT_USER;
const pw = process.env.GIT_TOKEN;
const url = `https://${id}:${pw}@github.com/oculi-s/ohddul`;
const base = async () => {
    exec("git config --global user.email oculis0925@yonsei.ac.kr");
    exec("git config --global user.name oculis");
}

export default async function handler(req, res) {
    const { action } = req.query;
    switch (action) {
        case "pull":
            await base();
            exec(`git pull ${url}`, (o1, o2, o3) => {
                console.log('[Pull] ' + callback(o1, o2, o3));
            })
            res.status(200).send();
            break;
        case "push":
            await base();
            const date = dt.toString();
            exec("git add .", () => {
                exec(`git commit -m ${date}`, (o1, o2, o3) => {
                    console.log('[Commit] ' + callback(o1, o2, o3));
                    exec(`git push ${url}`, (o1, o2, o3) => {
                        console.log('[Push] ' + callback(o1, o2, o3));
                    });
                });
            });
            res.status(200).send();
            break;
        default:
            res.status(400).send(false);
            break;
    }
}