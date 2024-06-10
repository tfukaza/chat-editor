<script lang="ts">
    import Canvas from "$lib/Canvas.svelte";
    import ElementTree from "$lib/LayerPanel.svelte";
    import { nodeTree, cssStyles as globalCssStyle } from "$lib/stores";
    import EditorPanel from "$lib/EditorPanel.svelte";
    import { afterUpdate } from "svelte";

    $: css = "";

    globalCssStyle.subscribe((cssStyles) => {
        css = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@600&family=Inter:wght@400;700&family=Space+Mono&display=swap');
        </style>`;
        css += "<style>";
        for (const [className, style] of Object.entries(cssStyles)) {
            css += "." + className + "{";
            for (let [attribute, val] of Object.entries(style)) {
                attribute = attribute.replace("_", "-");
                css += `${attribute}: ${val};`;
            }
            css += "} ";
        }
        // css += "*{border: 1px solid black}";
        css += "<" + "/" + "style>"; // The + is needed to escape /
    });
    let canvas: Canvas;
    afterUpdate(() => {
        canvas.moveFrameAfterCssUpdate(null);
    });
</script>

<svelte:head>
    {@html css}
</svelte:head>

<body>
    <div class="w-screen h-12 bg-slate-800 fixed top-0" />
    <div class="flex box-border h-screen">
        <div
            class="w-64 pt-12 p-4 box-border h-screen bg-white border-r-2 border-gray-100 overflow-y-scroll"
        >
            <ElementTree />
        </div>

        <div class="bg-white flex-auto">
            <Canvas bind:this={canvas} />
        </div>

        <div
            class="w-64 pt-12 p-4 h-screen bg-white border-l-2 border-gray-100 overflow-y-scroll"
        >
            <EditorPanel />
        </div>
    </div>
</body>
