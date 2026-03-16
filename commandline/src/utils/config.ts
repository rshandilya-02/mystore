// utils/config.ts
import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_DIR =
  process.env.APPDATA || path.join(os.homedir(), ".config");

const APP_DIR = path.join(CONFIG_DIR, "mydrive");
const CONFIG_FILE = path.join(APP_DIR, "config.json");

export function saveToken(token: string) {

    if (!fs.existsSync(APP_DIR)) {
        fs.mkdirSync(APP_DIR, { recursive: true });
    }

    fs.writeFileSync(CONFIG_FILE,
        JSON.stringify({ token }, null, 2)
    );
}

export function getToken() {

    if (!fs.existsSync(CONFIG_FILE)) {
        return null;
    }

    const data = JSON.parse(
        fs.readFileSync(CONFIG_FILE, "utf-8")
    );

    return data.token;
}