<!-- Compoent for float (val) input fields in the Editor Panel-->
<script lang="ts">
    import { selectedNode, cssStyles } from "$lib/stores";

    import type { CanvasNodeInterface, cssInterface } from "$lib/types/node";

    export let inputName: string;
    export let prefix: string;
    export let suffix: string;

    let cssStyleMap: { [className: string]: cssInterface };
    let selected: CanvasNodeInterface;
    let cssStyleData: cssInterface;

    cssStyles.subscribe((value) => {
        cssStyleMap = value;
    });
    let inputValue: string;
    selectedNode.subscribe((value) => {
        selected = <CanvasNodeInterface>value;
        if (!selected) {
            // TODO clear input
            return;
        }
        cssStyleData = cssStyleMap[selected.className];
        if (cssStyleData === undefined) {
            cssStyleData = {};
        }
        //console.debug(cssStyleData);
        inputValue = inputName in cssStyleData ? cssStyleData[inputName] : "";
    });

    function valInput() {
        if (selected) {
            cssStyleData[inputName] = inputValue;
            cssStyles.update((value) => {
                value[selected.className] = cssStyleData;
                return value;
            });
        }
    }
    $: {
        inputValue = inputValue;
        valInput();
    }
    // onMount(async () => {
    //     nodeData.dom = dom;
    // });
</script>

<div class=" hover:border-slate-200 border-transparent rounded-md border-2 p-1">
    <h4 class="uppercase text-xs tracking-wider text-slate-400">
        {inputName}
    </h4>
    <input class="outline-none w-auto" bind:value={inputValue} />
</div>
