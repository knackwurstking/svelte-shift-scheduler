<script>
    import { createEventDispatcher } from "svelte";

    import {
        Button,
        Dialog,
        Input,
        Text,
    } from "svelte-css";

    import * as Store from "../../stores";

    import * as lang from "../../js/lang";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog.Root} */
    let dialog;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    let id;
    let name = "";
    let shortName = "";
    let hidden = false;
    let color;

    let disableColor = false;

    /**************
     * Store: view
     **************/

    const view = Store.view.create();

    /******************************
     * Function Export Definitions
     ******************************/

    /**
     * @param {import("../../stores/shift-setup").Shift | null | undefined} shift
     */
    export async function open(shift = null) {
        if (shift) {
            id = shift.id;
            name = shift.name;
            shortName = shift.shortName;
            hidden = !shift.visible;
            color = shift.color;
            disableColor = shift.color === "transparent";
        } else {
            id = undefined;
            name = "";
            shortName = "";
            hidden = false;
            color = undefined;
            disableColor = false;
        }

        dialog.showModal();
        view.lock();
    }

    export async function close() {
        dialog.close();
        view.unlock();
    }
</script>

<Dialog.Root
    bind:this={dialog}
    style={`
        width: 75%;
        max-width: 20em;
    `}
>
    <Dialog.Header
        title={`${
            id
                ? lang.get("dialog shift", "titleEdit")
                : lang.get("dialog shift", "titleNew")
        }`}
        on:close={() => close()}
    />

    <section>
        <Input.Text
            title={lang.get("dialog shift", "longName")}
            bind:value={name}
        />
    </section>

    <section>
        <Input.Text
            title={lang.get("dialog shift", "shortName")}
            bind:value={shortName}
        />
    </section>

    <br />

    <section>
        <Text.Label
            style="cursor: pointer;"
            secondary={lang.get("dialog shift", "hideShiftInputLabel")}
            useLabel
            row
        >
            <input type="checkbox" bind:checked={hidden} />
        </Text.Label>
    </section>

    <br />

    <section>
        <Text.Label
            secondary={lang.get("dialog shift", "pickBackgroundColorLabel")}
        >
            <input
                style="width: 100%;"
                type="color"
                bind:value={color}
                disabled={disableColor}
            />
        </Text.Label>

        <br />

        <Text.Label
            secondary={lang.get(
                "dialog shift",
                "disableBackgroundColorLabel"
            )}
            useLabel
            row
        >
            <input type="checkbox" bind:checked={disableColor} />
        </Text.Label>
    </section>

    <Dialog.Footer>
        <Button.Root
            color="primary"
            on:click={async () => {
                dispatch("submit", {
                    id,
                    name,
                    shortName: shortName || name[0] || "",
                    color: disableColor ? "transparent" : color,
                    visible: !hidden,
                });
            }}
        >
            {lang.get("buttons", "submit")}
        </Button.Root>
    </Dialog.Footer>
</Dialog.Root>
