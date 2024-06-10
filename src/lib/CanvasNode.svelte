<!-- 
  @component
  Represents a single HTML element.
 -->
<script lang="ts">
    import { draggingNode, mouseoverNode, selectedNode } from "./stores";
    import { afterUpdate, onMount } from "svelte";
    import type { CanvasNodeInterface, propInterface } from "./types/node";

    export let nodeData: CanvasNodeInterface;
    export let props: propInterface;
    let dom: Element;

    let editable = false;

    onMount(async () => {
        nodeData.dom = dom;
    });
    afterUpdate(() => {
        nodeData.dom = dom;
    });

    function mouseEnter() {
        mouseoverNode.update(() => nodeData);
    }

    function mouseLeave() {
        mouseoverNode.update(() => null);
    }

    function mouseDown(event: MouseEvent) {
        selectedNode.update(() => nodeData);
        draggingNode.update(() => nodeData);
        props.mouseDownX = event.clientX;
        props.mouseDownY = event.clientY;
    }

    function mouseUp(event: MouseEvent) {
        //draggingNode.update(() => null);
    }

    function doubleClick(event: MouseEvent) {
        editable = !editable;
    }
</script>

{#if nodeData.tag == "img"}
    <svelte:element
        this={nodeData.tag}
        class={nodeData.className}
        {...nodeData.properties}
        bind:this={dom}
        on:mouseenter|stopPropagation={mouseEnter}
        on:mouseleave|stopPropagation={mouseLeave}
        on:mousedown|stopPropagation={mouseDown}
        on:mouseup={mouseUp}
    />
{:else}
    <svelte:element
        this={nodeData.tag}
        class={nodeData.className}
        contenteditable={editable}
        bind:this={dom}
        on:mouseenter|stopPropagation={mouseEnter}
        on:mouseleave|stopPropagation={mouseLeave}
        on:mousedown|stopPropagation={mouseDown}
        on:mouseup={mouseUp}
        on:dblclick={doubleClick}
    >
        {#if nodeData.children && nodeData.children.length > 0}
            {#each nodeData.children as node}
                <svelte:self nodeData={node} {props} />
            {/each}
        {:else}
            {nodeData.content}
        {/if}
    </svelte:element>
{/if}
<!-- <style>
    div {
        padding: 10px;
    }
</style> -->
