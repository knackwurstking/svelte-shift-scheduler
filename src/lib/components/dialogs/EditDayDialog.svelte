<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import * as db from "../../js/db";
    import * as utils from "../../js/utils";

    /** @type {Date} */
    export let date;

    /** @type {import("../settings").Shift | null} */
    let defaultShift;
    /** @type {import("../settings").Shift | null} */
    let shift;
    /** @type {string} */
    let note;

    /** @type {string} */
    let current = "-1";

    /** @type {import("../settings").Settings} */
    let settings = JSON.parse(
        localStorage.getItem("settings") || '{ "shifts": [], "startDate": "", "shiftRhythm": []}'
    );
    $: settings, date && load();

    function load() {
        const data = db.get(date.getFullYear(), date.getMonth())[db.getKeyFromDate(date)];
        defaultShift = utils.calcShiftStep(settings, date);
        shift = data?.shift || null;
        if (shift)
            current = settings.shifts.findIndex(s => s.name === shift?.name).toString();
        note = data?.note || "";
    }
</script>

<dialog open>
    <article>
        <h2 class="title">
            {date.getFullYear()} / {(date.getMonth() + 1).toString().padStart(2, "0")} / {date
                .getDate()
                .toString()
                .padStart(2, "0")}
        </h2>

        <select bind:value={current}>
            <option value="-1" selected={current === "-1"}>(Default) {defaultShift?.name || ""}</option>

            {#each settings.shifts as shift, index}
                <option value={index.toString()} selected={current === index.toString()}>{shift.name}</option>
            {/each}
        </select>

        <label for="note">
            Note
            <textarea name="note" cols="30" rows="10" bind:value={note} />
        </label>

        <button
            on:click={() =>
                dispatch("submit", {
                    shift: settings.shifts.find((_s, i) => i.toString() === current) || null,
                    note: note,
                })}
        >
            OK
        </button>
    </article>
</dialog>

<style>
    article {
        padding: var(--spacing);
    }

    label textarea[name="note"] {
        resize: none;
    }
</style>