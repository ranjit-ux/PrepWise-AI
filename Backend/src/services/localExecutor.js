import { exec } from "child_process";
import fs from "fs";
import path from "path";

const TEMP_DIR = path.join(process.cwd(), "temp");

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

export const runLocalCode = (code, language, input) => {
    return new Promise((resolve) => {

        if (language !== "cpp") {
            return resolve({
                status: "Error",
                stderr: "Only C++ supported"
            });
        }

        const id = Date.now() + "_" + Math.random().toString(36).slice(2);

        const filePath = path.join(TEMP_DIR, `temp_${id}.cpp`);
        const execPath = path.join(TEMP_DIR, `temp_${id}.exe`);

        const compileCmd = `g++ "${filePath}" -o "${execPath}"`;
        const runCmd = `"${execPath}"`;

        fs.writeFileSync(filePath, code);

        const execute = () => {
            const child = exec(runCmd, { timeout: 2000, maxBuffer: 1024 * 1024, }, (err, stdout, stderr) => {

                try {
                    fs.unlinkSync(filePath);
                    if (fs.existsSync(execPath)) fs.unlinkSync(execPath);
                } catch {}

                if (err) {

                    if(err.killed) {
                        return resolve({
                            status: "Time Limit Exceeded",
                            stdout: "",
                            stderr: "Execution timed out"
                        });
                    }

                    return resolve({
                        status: "Runtime Error",
                        stdout: stdout || "",
                        stderr: stderr || err.message
                    });
                }

                resolve({
                    status: "Accepted",
                    stdout: stdout || "",
                });
            });

            child.stdin.write((input || "") + "\n");
            child.stdin.end();
        };

        exec(compileCmd, (err, _, stderr) => {
            if (err) {
                fs.unlinkSync(filePath);
                return resolve({
                    status: "Compilation Error",
                    stderr
                });
            }
            execute();
        });
    });
};