<script>
  import { createEventDispatcher } from "svelte";
  import { UI } from "ui";

  import { utils } from "../../lib/js";
  import * as Store from "../../lib/stores";

  import ContentDay from "./ContentDay.svelte";

  const dispatch = createEventDispatcher();
  const weekStart = Store.WeekStart.create();

  /** @type {number} */
  export let index;
  /** @type {Date} */
  export let currentDate;

  /** @type {_Day[]} */
  let days = Array(42)
    .fill(0)
    .map(() => ({ date: currentDate, data: { shift: null, note: "" } }));

  $: index === 1 && currentDate && dispatch("currentdatechange", currentDate);
  $: currentDate && getDaysForMonth();

  async function getDaysForMonth() {
    days = await utils.getDaysForMonth(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      {
        weekStart: $weekStart,
      },
    );
  }
</script>

<UI.FlexGrid.Row class="is-max-height" gap=".1em">
  {#each days.slice(0, 7) as day}
    <UI.FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
      <ContentDay currentMonth={currentDate.getMonth()} {day} />
    </UI.FlexGrid.Col>
  {/each}
</UI.FlexGrid.Row>

<UI.FlexGrid.Row class="is-max-height" gap=".1em">
  {#each days.slice(7, 14) as day}
    <UI.FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
      <ContentDay currentMonth={currentDate.getMonth()} {day} />
    </UI.FlexGrid.Col>
  {/each}
</UI.FlexGrid.Row>

<UI.FlexGrid.Row class="is-max-height" gap=".1em">
  {#each days.slice(14, 21) as day}
    <UI.FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
      <ContentDay currentMonth={currentDate.getMonth()} {day} />
    </UI.FlexGrid.Col>
  {/each}
</UI.FlexGrid.Row>

<UI.FlexGrid.Row class="is-max-height" gap=".1em">
  {#each days.slice(21, 28) as day}
    <UI.FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
      <ContentDay currentMonth={currentDate.getMonth()} {day} />
    </UI.FlexGrid.Col>
  {/each}
</UI.FlexGrid.Row>

<UI.FlexGrid.Row class="is-max-height" gap=".1em">
  {#each days.slice(28, 35) as day}
    <UI.FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
      <ContentDay currentMonth={currentDate.getMonth()} {day} />
    </UI.FlexGrid.Col>
  {/each}
</UI.FlexGrid.Row>

<UI.FlexGrid.Row class="is-max-height" gap=".1em">
  {#each days.slice(35, 42) as day}
    <UI.FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
      <ContentDay currentMonth={currentDate.getMonth()} {day} />
    </UI.FlexGrid.Col>
  {/each}
</UI.FlexGrid.Row>
