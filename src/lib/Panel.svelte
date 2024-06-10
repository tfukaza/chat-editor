<!-- 
  @component
  A Panel represents a single page of the website. It contains multiple CanvasNodes.
 -->

<script lang="ts">
    import type { CanvasNodeInterface } from "./types/node";
    import CanvasNode from "./CanvasNode.svelte";

    let panelDom: Element; // The DOM element of the panel
    let panelNodes: Array<CanvasNodeInterface> = []; // The nodes in the panel

    export let props: any; // The properties of the panel

    // For now, just add 5 p elements to the panel
    for (let i = 0; i < 5; i++) {
        panelNodes.push({
            name: `panel-node-${i}`,
            tag: "p",
            content: `This is panel node ${i}`,
            dom: null,
            className: "panel-node",
            children: [],
            parent: null,
            css: {},
            properties: {
                innerHTML: `This is panel node ${i}`,
            },
        });
    }
</script>

<div bind:this={panelDom} class="panel">
    {#each panelNodes as node}
        <CanvasNode nodeData={node} {props} />
    {/each}
</div>

<style>
    .panel {
        width: 1000px;
        border: 1px solid black;
        position: relative;
    }
</style>
