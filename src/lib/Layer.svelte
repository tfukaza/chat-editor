<!-- 
  @component
  Represents the layer panel, where all nodes in the website are listed
 -->
<script lang="ts">
    import { selectedNode } from "./stores";
    import type { CanvasNodeInterface } from "./types/node";
    export let CanvasNodeObj: CanvasNodeInterface;
</script>

<li
    on:click|stopPropagation={() => {
        selectedNode.update(() => CanvasNodeObj);
    }}
>
    {CanvasNodeObj.name}
    {#if CanvasNodeObj.children && CanvasNodeObj.children.length > 0}
        <ul class="border-left-2 pl-4">
            {#each CanvasNodeObj.children as n}
                <svelte:self CanvasNodeObj={n} />
            {/each}
        </ul>
    {/if}
</li>
