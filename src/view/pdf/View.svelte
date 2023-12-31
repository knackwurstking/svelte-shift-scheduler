<script>
    import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
    import { Share } from "@capacitor/share";
    import { jsPDF } from "jspdf";

    import { Button, Input } from "svelte-css";

    import PDF from "./PDF.svelte";

    import * as Store from "../../lib/stores";

    import * as lang from "../../lib/js/lang";
    import * as utils from "../../lib/js/utils";

    /** @type {number} */
    export let year;

    const pdf = new jsPDF("portrait", "mm", "a4");
    let processing = false;
    $: processing ? view.lock() : view.unlock();

    const view = Store.view.create();
</script>

<div
    class="ui-container is-max no-scrollbar flex column"
    style:padding-top="3em"
    style:overflow="auto"
>
    <section class="flex row justify-between">
        <div>
            <Input.Number
                title={lang.get("view pdf", "yearPicker")}
                min={0}
                bind:value={year}
            />
        </div>

        <Button.Root
            on:click={async () => {
                processing = true;

                setTimeout(() => {
                    /** @type {HTMLElement} */
                    // @ts-ignore
                    const el = document.getElementById("pdf").cloneNode(true);
                    el.setAttribute("data-theme", "light");
                    [...el.querySelectorAll(".page")].forEach((el) => {
                        // @ts-ignore
                        el.style.aspectRatio = "1 / 1.414";
                    });
                    const file = `${year}.pdf`;

                    pdf.html(el, {
                        callback: async (doc) => {
                            if (utils.isAndroid()) {
                                const result = await Filesystem.writeFile({
                                    path: file,
                                    data: doc.output(),
                                    encoding: Encoding.UTF8,
                                    directory: Directory.Cache,
                                });

                                Share.share({
                                    title: file,
                                    url: result.uri,
                                    dialogTitle: `Share "${file}"`,
                                });
                            } else {
                                doc.save(`${year}.pdf`);
                            }

                            processing = false;
                        },
                        width: 210,
                        windowWidth: 500, //window width in CSS pixels
                    });
                }, 0);
            }}
        >
            Download
        </Button.Root>
    </section>

    <div
        class="is-max-width no-scrollbar flex"
        style={
            "height: 100%;" +
            "overflow-y: auto;"
        }
    >
        <PDF
            id="pdf"
            {year}
        />
    </div>

    <div
        class="ui-spinner"
        style:display={processing ? "block" : "none"}
    ></div>
</div>

<style>
    .ui-spinner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-top: 3em;
        background-color: hsl(0, 0%, 0%, 0.4);
        backdrop-filter: blur(5px);
    }
</style>
