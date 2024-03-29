import { writable, get } from "svelte/store";

const storageKey = "shift-setup-store";

/** @type {import("svelte/store").Writable<_ShiftSetup>} */
const shiftSetup = writable((() => {
  const setupJSON = localStorage.getItem(storageKey);
  if (setupJSON) {
    /** @type {_ShiftSetup} */
    const setup = JSON.parse(setupJSON);

    return {
      shifts: setup.shifts || [],
      rhythm: setup.rhythm || [],
      startDate: typeof setup.startDate !== "string" ? "" : setup.startDate,
    }
  }

  return {
    shifts: [],
    rhythm: [],
    startDate: "",
  };
})());

shiftSetup.subscribe((setup) => {
  localStorage.setItem(storageKey, JSON.stringify({
    shifts: setup.shifts,
    rhythm: setup.rhythm,
    startDate: setup.startDate,
  }));
})

export function create() {
  /**
   * @param {number} index
   */
  function getShift(index) {
    const setupCopy = get(shiftSetup);
    return setupCopy.shifts[index];
  }

  /**
   * @param {number} id
   */
  function getShiftIndex(id) {
    const setupCopy = get(shiftSetup);
    return setupCopy.shifts.findIndex(shift => shift.id === id);
  }

  /**
   * @param {number} id
   * @returns {_Shift | undefined}
   */
  function getShiftForID(id) {
    const setupCopy = get(shiftSetup);
    return setupCopy.shifts.find(shift => shift.id === id);
  }

  /**
   * @param {string} name
   * @returns {_Shift | undefined}
   */
  function getShiftForName(name) {
    const setupCopy = get(shiftSetup);
    return setupCopy.shifts.find(shift => shift.name === name);
  }

  /**
   * @param {_Shift} shift
   */
  function updateShift(shift) {
    shiftSetup.update(setup => {
      let index = setup.shifts.findIndex(s => s.id === shift.id);

      if (index === -1) {
        index = setup.shifts.findIndex(s => s.name === shift.name);
      };

      if (index === -1) return setup;

      setup.shifts[index].id = shift.id || setup.shifts[index].id;
      setup.shifts[index].name = shift.name;
      setup.shifts[index].shortName = shift.shortName || setup.shifts[index].shortName;
      setup.shifts[index].color = shift.color || setup.shifts[index].color;
      setup.shifts[index].visible = typeof shift.visible === "boolean"
        ? shift.visible
        : setup.shifts[index].visible;

      return setup;
    });
  }

  /**
   * @param {string} date
   */
  function updateStartDate(date) {
    shiftSetup.update(setup => {
      return {
        ...setup,
        startDate: date,
      };
    });
  }

  /**
   * @param {number[]} rhythm
   */
  function updateRhythm(rhythm) {
    if (rhythm.find(id => typeof id !== "number")) return;

    shiftSetup.update(setup => {
      return {
        ...setup,
        rhythm: rhythm,
      }
    })
  }

  /**
   * @param {_Shift} shift
   * @returns {_Shift}
   */
  function mergeShift(shift) {
    const setupCopy = get(shiftSetup);

    let index = setupCopy.shifts.findIndex(s => s.id === shift.id);

    if (index === -1) {
      index = setupCopy.shifts.findIndex(s => s.name === shift.name);
    };

    if (index === -1) {
      shiftSetup.update(setup => {
        setup.shifts.push(shift);
        return setup;
      });

      return shift;
    }

    shift.id = setupCopy.shifts[index].id;
    shift.name = setupCopy.shifts[index].name;
    shift.shortName = setupCopy.shifts[index].shortName;
    shift.color = setupCopy.shifts[index].color;
    shift.visible = setupCopy.shifts[index].visible;

    return shift;
  }

  /**
   * @param {Date} date
   */
  function calcShiftStep(date) {
    const setup = get(shiftSetup);

    if (!setup.startDate || !setup.rhythm.length) return null;

    const startDate = new Date(setup.startDate);

    if (startDate.getTime() > date.getTime()) {
      const daysDiff =
        (startDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      let index = Math.round(
        setup.rhythm.length - (daysDiff % setup.rhythm.length)
      );

      if (index === setup.rhythm.length) index = 0;

      const s = setup.shifts.find(
        (shift) => shift.id === setup.rhythm[index]
      );

      return s || null;
    }

    const daysDiff = Math.round(
      (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const s = setup.shifts.find(
      (shift) =>
        shift.id === setup.rhythm[daysDiff % setup.rhythm.length]
    );

    return s || null;
  }

  return {
    ...shiftSetup,
    calcShiftStep,
    getShift,
    getShiftForID,
    getShiftForName,
    getShiftIndex,
    mergeShift,
    updateRhythm,
    updateShift,
    updateStartDate,
  }
};
