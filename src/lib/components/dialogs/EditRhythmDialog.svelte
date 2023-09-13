<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import Shift from "../shift";

  export let shifts;
  export let rhythm;
</script>

<dialog open>
  <article>
    <h6>Pick a shift from the bottom to add.</h6>

    <ul>
      {#each rhythm as name, index}
        <Shift
          {...shifts.find((s) => s.name === name) || {
            name: name,
            visible: true,
          }}
          on:click={() => {
            rhythm = [...rhythm.slice(0, index), ...rhythm.slice(index + 1)];
          }}
        />
      {/each}
    </ul>

    <div class="shifts-container">
      {#each shifts as shift}
        <div class="container">
          <Shift
            {...shift}
            on:click={() => {
              rhythm = [...rhythm, shift.name];
            }}
          />
        </div>
      {/each}
    </div>

    <button type="submit" on:click={() => dispatch("submit", rhythm)}>OK</button
    >
  </article>
</dialog>

<style>
  dialog {
    width: 100%;
    height: 100%;
  }

  article {
    height: 90%;
    width: 100%;

    overflow: hidden;
  }

  article > h6 {
    height: 2em;
  }

  article > ul {
    height: calc(100% - 12rem);

    overflow: hidden;
    overflow-y: auto;

    border-bottom: 1px solid var(--muted-border-color);

    margin-bottom: 4px;
    padding: 0;
  }

  article .shifts-container {
    overflow: hidden;
    overflow-x: auto;

    display: flex;

    margin: 4px 0 8px 0;
    padding: 0 0 8px 0;

    border-bottom: 1px solid var(--muted-border-color);
  }

  article .shifts-container .container {
    width: calc(4.5em + 16px);
    margin: 4px;
  }
</style>