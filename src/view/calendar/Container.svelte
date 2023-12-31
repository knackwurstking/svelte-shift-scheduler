<script>
    import { createEventDispatcher, onDestroy } from "svelte";

    import { FlexGrid } from "svelte-css";

    import * as Store from "../../lib/stores";

    import * as lang from "../../lib/js/lang";

    /***********************
     * Variable Definitions
     ***********************/

    const cleanUp = [];
    const dispatch = createEventDispatcher();

    /** @type {string[]} */
    let headerItems = [
        lang.get("week-days", "sun"),
        lang.get("week-days", "mon"),
        lang.get("week-days", "tue"),
        lang.get("week-days", "wed"),
        lang.get("week-days", "thu"),
        lang.get("week-days", "fri"),
        lang.get("week-days", "sat"),
    ];

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
    $: !!weekStart && cleanUp.push(weekStart.subscribe(weekStart => {
        const items = [
            lang.get("week-days", "sun"),
            lang.get("week-days", "mon"),
            lang.get("week-days", "tue"),
            lang.get("week-days", "wed"),
            lang.get("week-days", "thu"),
            lang.get("week-days", "fri"),
            lang.get("week-days", "sat"),
        ];

        if (weekStart === "mon") {
            items.push(items.shift());
        }

        headerItems = items;
    }));

    /********************
     * Mount and Destroy
     ********************/

    onDestroy(() => cleanUp.forEach(fn => fn()));
</script>

<div
    {...$$restProps}
    class={"is-max no-user-select " + ($$restProps.class || "")}
    style:min-width="100%"
    on:transitionend={(ev) => {
        if (ev.propertyName === "transform") {
            dispatch("transformend");
        }
    }}
>
    <FlexGrid.Root class="is-max" gap=".1em">
        <FlexGrid.Row style="height: 2em" gap=".1em">
            {#each headerItems as item}
                <FlexGrid.Col
                    style={
                        "font-family: var(--font-family-heading);" +
                        "width: calc(100% / 7);" +
                        "height: 100%;"
                    }
                >
                    <div
                        class="ui-card is-max flex justify-center align-center"
                        class:sunday={item === "Sun"}
                        class:saturday={item === "Sat"}
                    >
                        {item}
                    </div>
                </FlexGrid.Col>
            {/each}
        </FlexGrid.Row>

        <slot />
    </FlexGrid.Root>
</div>

<style>
    .ui-card {
        font-size: 0.9em;
    }

    .ui-card.saturday,
    .ui-card.sunday {
        font-weight: 700;
    }

    .ui-card:not(.saturday, .sunday) {
        font-weight: 400;
    }
</style>
