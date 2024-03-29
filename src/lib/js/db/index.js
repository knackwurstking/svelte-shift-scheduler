import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

/**
 * @param {any} data
 * @returns {boolean}
 */
export function validate(data) {
  try {
    for (const [k, v] of Object.entries(data)) {
      if (typeof k === "string") {
        if (!Object.hasOwn(v, "shift") || !Object.hasOwn(v, "note")) {
          return false;
        }

        // check "shift"
        if (v.shift !== null) {
          if (
            !Object.hasOwn(v.shift, "id") ||
            !Object.hasOwn(v.shift, "name") ||
            !Object.hasOwn(v.shift, "shortName") ||
            !Object.hasOwn(v.shift, "visible")
          ) {
            return false;
          }

          if (
            typeof v.shift.id !== "number" ||
            typeof v.shift.name !== "string" ||
            typeof v.shift.shortName !== "string" ||
            typeof v.shift.visible !== "boolean"
          ) {
            return false;
          }
        }

        // check "note"
        if (typeof v.note !== "string") {
          return false;
        }
      }
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * @returns {{ year: number, month: number }[]}
 */
export function listKeys() {
  /** @type {{ year: number, month: number }[]}  */
  const keys = [];

  for (let x = 0; x < window.localStorage.length; x++) {
    const key = window.localStorage.key(x);
    const split = key.split("-", 3);

    if (split.length === 3) {
      if (split[0] !== "db") continue;

      const year = parseInt(split[1], 10);
      const month = parseInt(split[2], 10);

      if (isNaN(year) || isNaN(month)) continue;
      if (month < 0 || month > 11) continue;

      keys.push({ year, month });
    }
  }

  return keys;
}

/**
 * @param {number} year
 * @param {number} month
 * @returns {Promise<_DBData>}
 */
export async function get(year, month) {
  const rawData = window.localStorage.getItem(`db-${year}-${month}`);
  if (!rawData) return {};
  return JSON.parse(rawData);
}

/**
 * @param {number} year
 * @param {number} month
 * @param {_DBData} data
 */
export async function set(year, month, data) {
  window.localStorage.setItem(`db-${year}-${month}`, JSON.stringify(data));
}

/**
 * @param {number} year
 * @param {number} month
 */
export async function remove(year, month) {
  window.localStorage.removeItem(`db-${year}-${month}`);
}

/**
 * @param {number} year
 * @param {number} month
 * @param {string} key
 * @returns {Promise<_DBDataValue>}
 */
export async function getData(year, month, key) {
  const data = await get(year, month);
  return data[key] || { shift: null, note: "" };
}

/**
 * @param {number} year
 * @param {number} month 
 * @param {string} key 
 * @param {_Shift | null} shift
 * @param {string} note
 */
export async function setData(year, month, key, shift, note) {
  const data = await get(year, month);
  data[key] = { shift: shift, note: note };
  await set(year, month, data);
}

/**
 * @param {number} year
 * @param {number} month 
 * @param {string} key 
 */
export async function removeData(year, month, key) {
  const data = await get(year, month);
  delete data[key];
  if (!Object.keys(data).length) await remove(year, month);
  else await set(year, month, data);
}

export async function getAll() {
  /** @type {{ [key: string]: _DBData }} */
  const data = {};
  for (const { year, month } of listKeys()) {
    data[`db-${year}-${month}`] = await get(year, month);
  }
  return data;
}

/**
 *
 * @param {{ [key: string]: _DBData }} data
 * @param {"browser" | "android"} platform
 */
export async function exportDatabase(data, platform = "browser") {
  switch (platform) {
    case "browser":
      await _exportBrowser(data);
      break;
    case "android":
      await _exportAndroid(data);
      break;
    default:
      throw `Unknown platform "${platform}"`;
  }
}

/**
 *
 * @param {{ [key: string]: _DBData }} data
 */
async function _exportBrowser(data) {
  const blob = new Blob([JSON.stringify(data)], { type: "octet/stream" });

  const a = document.createElement("a");

  a.setAttribute("href", window.URL.createObjectURL(blob));
  a.setAttribute("download", "shift-scheduler-storage-data.json");

  a.click();
}

/**
 *
 * @param {{ [key: string]: _DBData }} data
 */
async function _exportAndroid(data) {
  const file = "shift-scheduler-storage-data.json";

  const result = await Filesystem.writeFile({
    path: file,
    data: JSON.stringify(data),
    encoding: Encoding.UTF8,
    directory: Directory.Cache,
  });

  Share.share({
    title: file,
    url: result.uri,
    dialogTitle: "Storage data backup",
  });
}
