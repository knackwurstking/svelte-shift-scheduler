/**
 * @typedef Modes
 * @type {"auto" | "dark" | "light"}
 *
 * @typedef Themes
 * @type {"custom" | "picocss" | "green"}
 * 
 * @typedef ShiftID 
 * @type {number}
 *
 * @typedef Shift
 * @type {{
 *  id: number;
 *  name: string;
 *  shortName: string;
 *  visible: boolean;
 *  color?: string;
 * }}
 *
 * @typedef Settings
 * @type {{
 *  shifts: Shift[];
 *  startDate: string | Date;
 *  shiftRhythm: ShiftID[];
 *  currentTheme: Themes;
 *  mode: Modes;
 * }}
 */

export const defaultSettings = `{
    "shifts": [],
    "startDate": "",
    "shiftRhythm": [],
    "currentTheme": "custom",
    "mode": "auto"
}`;

/**
 * @type {Settings}
 */
export let data;

export function load() {
  data = JSON.parse(localStorage.getItem("settings") || defaultSettings);
}

export function save() {
  localStorage.setItem("settings", JSON.stringify(data));
}

/**
 *
 * @param {number} id
 * @returns {undefined | Shift}
 */
export function getShift(id) {
  if (!data) return;
  return data.shifts.find((shift) => shift.id === id);
}
