<!-- 
  @component
  Represents the editor panel, where users configure settings for the selected node. 
 -->
<script lang="ts">
    import { selectedNode, cssStyles } from "$lib/stores";
    import { onDestroy } from "svelte";
    import InputVal from "./components/InputVal.svelte";
    import type { CanvasNodeInterface } from "./types/node";

    let selectedNodeRef: CanvasNodeInterface;
    selectedNode.subscribe((value) => {
        selectedNodeRef = <CanvasNodeInterface>value;
        //console.debug(selectedNodeRef);
    });
</script>

<!-- Width, height, and paddings -->
<InputVal inputName="width" prefix="" suffix="px" />
<InputVal inputName="height" prefix="" suffix="px" />

<InputVal inputName="padding_top" prefix="" suffix="px" />
<InputVal inputName="padding_left" prefix="" suffix="px" />
<InputVal inputName="padding_right" prefix="" suffix="px" />
<InputVal inputName="padding_bottom" prefix="" suffix="px" />

<InputVal inputName="margin_top" prefix="" suffix="px" />
<InputVal inputName="margin_left" prefix="" suffix="px" />
<InputVal inputName="margin_right" prefix="" suffix="px" />
<InputVal inputName="margin_bottom" prefix="" suffix="px" />

<InputVal inputName="background_color" prefix="#" suffix="" />

<InputVal inputName="border_radius" prefix="#" suffix="" />

<InputVal inputName="color" prefix="#" suffix="" />
<InputVal inputName="text_align" prefix="#" suffix="" />
<InputVal inputName="font-size" prefix="#" suffix="" />
<InputVal inputName="font_family" prefix="#" suffix="" />
<InputVal inputName="font_weight" prefix="#" suffix="" />
