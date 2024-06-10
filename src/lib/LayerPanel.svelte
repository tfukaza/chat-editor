<script lang="ts">
    import { cssStyles, nodeTree } from "$lib/stores";
    import Layer from "./Layer.svelte";
    import type { CanvasNodeInterface, cssInterfaceDict } from "./types/node";
    import { v4 as uuidv4 } from "uuid";

    let nodeTreeRoot: CanvasNodeInterface = {
        parent: null,
        name: "body",
        tag: "body",
        content: "",
        className: "WE-" + uuidv4(),
        dom: null,
        css: {
            // user_select: "none",
            width: "auto",
            height: "auto",
        },
        children: [],
    };

    function addParagraph() {
        let newNode: CanvasNodeInterface = {
            name: "Text",
            tag: "p",
            content: "Hello World - " + Math.random(),
            className: "WE-" + uuidv4(),
            dom: null,
            css: {
                cursor: "grab",
                // user_select: "none",

                width: "auto",
                height: "auto",
            },
            children: [],
            parent: nodeTreeRoot,
            properties: {},
        };
        nodeTreeRoot.children.push(newNode);

        cssStyles.update((v: cssInterfaceDict) => {
            let className: string = newNode.className;
            v[className] = newNode.css;
            return v;
        });

        nodeTree.update((v) => nodeTreeRoot);
        nodeTreeRoot = nodeTreeRoot;
    }

    function addDivider() {
        let newNode: CanvasNodeInterface = {
            name: "Container",
            tag: "div",
            content: "",
            className: "WE-" + uuidv4(),
            dom: null,
            css: {
                cursor: "grab",
                user_select: "none",

                padding_top: "50px",
                padding_left: "50px",
                padding_right: "50px",
                padding_bottom: "50px",
            },
            children: [],
            parent: nodeTreeRoot,
            properties: {},
        };
        nodeTreeRoot.children.push(newNode);
        cssStyles.update((v: cssInterfaceDict) => {
            v[newNode.className] = newNode.css;
            return v;
        });
        nodeTree.update((v) => nodeTreeRoot);
        nodeTreeRoot = nodeTreeRoot;
    }

    function addImage() {
        let newNode: CanvasNodeInterface = {
            name: "Image",
            tag: "img",
            content: "",
            className: "WE-" + uuidv4(),
            dom: null,
            css: {
                cursor: "grab",
                user_select: "none",
            },
            children: [],
            parent: nodeTreeRoot,
            properties: {
                src: "https://picsum.photos/200/200",
                draggable: "false",
            },
        };
        nodeTreeRoot.children.push(newNode);
        cssStyles.update((v: cssInterfaceDict) => {
            v[newNode.className] = newNode.css;
            return v;
        });
        nodeTree.update((v) => nodeTreeRoot);
        nodeTreeRoot = nodeTreeRoot;
    }

    nodeTree.update((v) => nodeTreeRoot);

    nodeTree.subscribe((value) => {
        nodeTreeRoot = <CanvasNodeInterface>value;
    });
</script>

<button on:click={addParagraph}>Add p</button>
<button on:click={addDivider}>Add div</button>
<button on:click={addImage}>Add img</button>
<ul>
    <Layer CanvasNodeObj={nodeTreeRoot} />
</ul>
