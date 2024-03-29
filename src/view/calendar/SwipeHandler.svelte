<script>
  import { createEventDispatcher, onDestroy } from "svelte";

  const cleanUp = [];
  const dispatch = createEventDispatcher();

  /** @type {Date} */
  export let currentDate = new Date();

  /** @type {HTMLDivElement} */
  let container;

  /** @type {boolean} */
  let pointerlock = false;

  /** @type {[number, number, number]} */
  let items = [-1, 0, 1];

  /** @type {number} */
  let minSwipeRange;

  /** @type {string} */
  let transition;
  /** @type {string} */
  let currentTranslateX = "-100%";
  /** @type {null | "right" | "left"} */
  let direction = null;

  /** @type {number} */
  let _startX = 0;
  /** @type {number | null} */
  let _lastX = null;

  /**
   * Trigger a calendar reload after a database update
   */
  export function reload() {
    currentDate = currentDate;
  }

  /**
   * @param {string} selector
   */
  export function querySelector(selector) {
    return container.querySelector(selector);
  }

  /**
   * @param {PointerEvent} ev
   */
  async function swipeStart(ev) {
    if (pointerlock) return;

    /**
     * @param {PointerEvent} ev
     */
    const move = async (ev) => {
      if (!pointerlock && Math.abs(_startX - ev.clientX) >= minSwipeRange / 2)
        pointerlock = true;

      currentTranslateX = `calc(-100% + ${0 - (_startX - ev.clientX)}px)`;
      _lastX = ev.clientX;
    };

    const end = async () => {
      cleanUp.forEach((fn) => fn());

      transition = "transform .25s ease-out";

      if (pointerlock) {
        if (Math.abs(_lastX - _startX) < minSwipeRange) {
          direction = null;
        } else if (_lastX < _startX) {
          direction = "left";
        } else if (_lastX > _startX) {
          direction = "right";
        }

        switch (direction) {
          case null:
            currentTranslateX = "-100%";
            break;
          case "left":
            currentTranslateX = "-200%";
            break;
          case "right":
            currentTranslateX = "0";
            break;
        }
      }

      _lastX = null;
      setTimeout(() => (pointerlock = false), 250);
    };

    _startX = ev.clientX;
    transition = "none";
    minSwipeRange = container.getBoundingClientRect().width / 7;

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);

    cleanUp.push(() => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    });
  }

  onDestroy(() => cleanUp.forEach((fn) => fn()));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={container}
  class="is-max no-user-select no-touch flex fow nowrap no-overflow"
  style:padding-top="3em"
  on:pointerdown={(ev) => swipeStart(ev)}
  on:click={async (ev) => {
    if (pointerlock) return;
    // @ts-ignore
    for (const el of ev?.path || ev.composedPath() || []) {
      if (el.classList?.contains("day")) {
        const date = el.getAttribute("data-value");
        if (isNaN(date)) dispatch("click", null);
        else {
          dispatch(
            "click",
            new Date(currentDate.getFullYear(), currentDate.getMonth(), date),
          );
        }
        return;
      }
    }
  }}
>
  {#each items as _item, index}
    <slot
      name="item"
      {index}
      currentDate={new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (index - 1),
      )}
      {currentTranslateX}
      {transition}
      onTransformEnd={async () => {
        if (pointerlock || transition === "none") return;

        if (direction === "left") {
          items = [items[1], items[2], items[0]];
          currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
          );
        } else if (direction === "right") {
          items = [items[2], items[0], items[1]];
          currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
          );
        }

        direction = null;
        transition = "none";
        currentTranslateX = "-100%";
      }}
    />
  {/each}
</div>
