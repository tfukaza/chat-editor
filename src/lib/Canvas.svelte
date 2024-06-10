<!-- 
  @component
  Main canvas where the website is rendered.
 -->
<script lang="ts">
    import {
        cssStyles,
        nodeTree,
        mouseoverNode,
        selectedNode,
        draggingNode,
    } from "$lib/stores";
    import { afterUpdate } from "svelte/internal";
    import Panel from "./Panel.svelte";
    import type { CanvasNodeInterface } from "./types/node";

    let hoveredFrame: HTMLElement; // Highlights elements that the mouse is hovering over
    let hoveredNode: CanvasNodeInterface | null = null; // Node that the mouse is hovering over
    let selectedFrame: HTMLElement; // Highlights the selected element
    let ghostFrame: HTMLElement; // While dragging, indicates where the node will be dropped

    let canvasElement: HTMLElement; // The canvas element

    function moveFrameToCoordinate(frame: HTMLElement, x: number, y: number) {
        if (!frame) return;
        frame.style.transform = `translate(${x}px, ${y}px)`;
    }

    function moveFrame(dom: Element | null, frame: HTMLElement) {
        if (!frame || !dom) return;
        const rect = dom.getBoundingClientRect();
        const x = rect.left;
        const y = rect.top;
        const w = rect.width;
        const h = rect.height;
        frame.style.transform = `translate(${x}px, ${y}px)`;
        frame.style.height = `${h}px`;
        frame.style.width = `${w}px`;
    }

    function toggleFrameVisibility(frame: HTMLElement, visibility: boolean) {
        if (!frame) return;
        if (visibility == true) {
            frame.style.display = "block";
        } else {
            frame.style.display = "none";
        }
    }

    mouseoverNode.subscribe((value) => {
        hoveredNode = <CanvasNodeInterface>value;
        if (!hoveredNode) {
            if (!hoveredFrame) return;
            hoveredFrame.style.display = "none";
            return;
        }
        if (!hoveredFrame) return;
        moveFrame(hoveredNode.dom, hoveredFrame);
        hoveredFrame.style.display = "block";
    });

    let nodeTreeRoot: CanvasNodeInterface;
    nodeTree.subscribe((value) => {
        nodeTreeRoot = <CanvasNodeInterface>value;
    });

    let draggingNodeRef: CanvasNodeInterface | null = null;
    draggingNode.subscribe((value) => {
        draggingNodeRef = <CanvasNodeInterface>value;
    });

    let selectedNodeRef: CanvasNodeInterface | null = null;
    selectedNode.subscribe((value) => {
        selectedNodeRef = <CanvasNodeInterface>value;
        if (!selectedNodeRef) return;
        moveFrame(selectedNodeRef.dom, selectedFrame);
        moveFrame(selectedNodeRef.dom, ghostFrame);
    });
    /* Called by index when CSS update is complete */
    export function moveFrameAfterCssUpdate(dom: Element | null) {
        if (!selectedNodeRef) return;
        moveFrame(dom || selectedNodeRef.dom, selectedFrame);
    }
    cssStyles.subscribe((value) => {
        if (!selectedNodeRef) return;
        moveFrame(selectedNodeRef.dom, selectedFrame);
    });

    import { mouseButton } from "$lib/types/constants";

    let gProps = {
        mouseDownX: -1,
        mouseDownY: -1,
        isCameraPan: false,
        mouseDownButton: -1,
        cameraX: 0,
        cameraY: 0,
        cameraDownX: 0,
        cameraDownY: 0,
        dx: 0,
        dy: 0,
        zoom: 1,

        cameraWidth: 0,
        cameraHeight: 0,
    };

    let mouseX = 0;
    let mouseY = 0;
    // let mouseDownX = -1;
    // let mouseDownY = -1;

    //let movingNode: CanvasNodeInterface | null = null;
    let isMoving: boolean = false;

    //let hoverNodeFrame: Element;
    let ghostNode: CanvasNodeInterface | null = null;
    let ghostNodeParent: CanvasNodeInterface | null = null;
    let containerElement: HTMLElement;
    function mouseDown(event: MouseEvent) {
        // TODO: Also set camera width and height when the canvas is resized
        gProps.cameraWidth = containerElement.clientWidth;
        gProps.cameraHeight = containerElement.clientHeight;

        if (event.button == mouseButton.MIDDLE) {
            console.debug("Middle mouse wheel pressed");
            // gProps.mouseDownX = event.clientX;
            // gProps.mouseDownY = event.clientY;
            // gProps.cameraDownX = gProps.cameraX;
            // gProps.cameraDownY = gProps.cameraY;
            // gProps.isCameraPan = true;

            gProps = {
                ...gProps,
                mouseDownButton: mouseButton.MIDDLE,
                mouseDownX: event.clientX,
                mouseDownY: event.clientY,
                cameraDownX: gProps.cameraX,
                cameraDownY: gProps.cameraY,
            };
        }
    }

    function mouseMove(event: MouseEvent) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        // If middle mouse button is pressed and dragged, pan the camera
        if (gProps.mouseDownButton == mouseButton.MIDDLE) {
            console.debug("Pan");
            let dx = mouseX - gProps.mouseDownX;
            let dy = mouseY - gProps.mouseDownY;

            // gProps.cameraX = gProps.cameraDownX + dx;
            // gProps.cameraY = gProps.cameraDownY + dy;

            gProps = {
                ...gProps,
                cameraX: gProps.cameraDownX + dx,
                cameraY: gProps.cameraDownY + dy,
                dx: dx,
                dy: dy,
            };

            return;
        }

        if (gProps.mouseDownX < 0) return;
        if (
            Math.pow(
                Math.pow(gProps.mouseDownX - mouseX, 2) +
                    Math.pow(gProps.mouseDownY - mouseY, 2),
                0.5,
            ) < 20
        ) {
            isMoving = false;
            return;
        }

        if (draggingNodeRef === null) return;

        let movingNode = draggingNodeRef;

        if (!isMoving) {
            isMoving = true;
            toggleFrameVisibility(ghostFrame, true);
            //Remove the node from canvas
            console.debug(nodeTreeRoot);
            /* Skip is parent node is null. This should not happen unless you're moving the root node
            (for some reason). */
            if (!movingNode.parent) return;
            movingNode.parent.children = movingNode.parent.children.filter(
                (element: CanvasNodeInterface) => {
                    console.log(
                        element.className != draggingNodeRef?.className,
                        "1",
                    );
                    return element.className != draggingNodeRef?.className;
                },
            );
            console.log(nodeTreeRoot);
        }

        moveFrameToCoordinate(ghostFrame, mouseX, mouseY);

        // If node is dropped on empty space, delete it.
        if (hoveredNode && hoveredNode != ghostNodeParent) {
            //console.log("New node");
            if (ghostNodeParent) {
                //console.log(nodeTreeRoot);
                ghostNodeParent.children = ghostNodeParent.children.filter(
                    (element: CanvasNodeInterface) => {
                        return element.className != ghostNode?.className;
                    },
                );
                //console.log(nodeTreeRoot);
                //console.log("Remove node");

                ghostNode = null;
                ghostNodeParent = null;
                nodeTree.update((v) => nodeTreeRoot);
            }
            // Get the center of the node currently hovering over
            // If there is no dom, abort
            if (!hoveredNode.dom) {
                console.warn(
                    `Mouse is hovered over node ${hoveredNode} but is has no dom`,
                );
                return;
            }
            const rect = hoveredNode.dom.getBoundingClientRect();
            const y = rect.top;
            const h = rect.height;
            let lerpY = (mouseY - y) / h;

            // If the mouse is hovering over a node, and the node is a div, add a ghost node
            if (lerpY > 0.3 && lerpY < 0.7 && hoveredNode.tag == "div") {
                console.log("Insert");
                ghostNodeParent = hoveredNode;
                ghostNode = movingNode;
                //ghostNode.dom = movingNode.dom.cloneNode();
                // TODO: Insert where the mouse is hovering
                hoveredNode.children.splice(0, 0, ghostNode);
                movingNode.parent = hoveredNode;
                console.log(nodeTreeRoot);
                nodeTree.update((v) => nodeTreeRoot);
                // endMouseUp();
            } else {
                //console.log("Not yet...");
                ghostNodeParent = hoveredNode.parent;
                ghostNode = movingNode;

                // If mouse is hovering near the top or bottom of a node
                let insertIndex = 0;
                let parentNode = hoveredNode.parent;
                if (!parentNode) {
                    console.log(hoveredNode);
                    return;
                }
                for (
                    ;
                    insertIndex < parentNode.children.length;
                    insertIndex++
                ) {
                    if (
                        parentNode.children[insertIndex].className ==
                        hoveredNode.className
                    )
                        break;
                }
                if (lerpY >= 0.7) insertIndex++;
                parentNode.children.splice(insertIndex, 0, movingNode);
                movingNode.parent = parentNode;
            }
        }

        // if (!hoveredNode) {
        //     return;
        // }
        // // Get the center of the node currently hovering over
        // const rect = hoveredNode.dom.getBoundingClientRect();
        // const x = rect.left;
        // const y = rect.top;
        // const w = rect.width;
        // const h = rect.height;
        // let centerX = x + w / 2;
        // let centerY = y + h / 2;
        // let lerpY = (mouseY - y) / h;

        // console.debug(hoveredNode, lerpY);
        // //nodeTreeRoot = nodeTreeRoot;
    }

    function endMouseUp() {
        nodeTree.update((v) => nodeTreeRoot);
        console.log("End mouse up");
        gProps = {
            ...gProps,
            mouseDownX: -1,
            mouseDownY: -1,
            mouseDownButton: -1,
        };
        draggingNode.update(() => "");
        isMoving = false;
        toggleFrameVisibility(ghostFrame, false);
        ghostNode = null;
        ghostNodeParent = null;
    }

    function mouseUp(event: MouseEvent) {
        if (gProps.isCameraPan) {
            console.debug("End pan");
            gProps.isCameraPan = false;
            // gProps.cameraX = gProps.cameraX + gProps.dx;
            // gProps.cameraY = gProps.cameraY + gProps.dy;

            gProps = {
                ...gProps,
                dx: 0,
                dy: 0,
            };
        }

        let movingNode = draggingNodeRef;
        if (!movingNode || !isMoving) {
            draggingNode.update(() => "");
            endMouseUp();
            return;
        }

        // If node is dropped on empty space, delete it.
        if (!hoveredNode) {
            endMouseUp();
            return;
        }

        // if (ghostNode) {
        //     ghostNode.dom.remove();
        // }
        // Get the center of the node currently hovering over
        // const rect = hoveredNode.dom.getBoundingClientRect();
        // const x = rect.left;
        // const y = rect.top;
        // const w = rect.width;
        // const h = rect.height;
        // let centerX = x + w / 2;
        // let centerY = y + h / 2;
        // let lerpY = (mouseY - y) / h;

        // // If the mouse is hovering over a node, and the node is a div, make it a child element
        // if (lerpY > 0.3 && lerpY < 0.7 && hoveredNode.tag == "div") {
        //     // TODO: Insert where the mouse is hovering
        //     hoveredNode.children.splice(0, 0, movingNode);
        //     endMouseUp();
        //     return;
        // }

        // // If mouse is hovering near the top or bottom of a node
        // let insertIndex = 0;
        // for (; insertIndex < nodeTreeRoot.children.length; insertIndex++) {
        //     if (
        //         nodeTreeRoot.children[insertIndex].className ==
        //         hoveredNode.className
        //     )
        //         break;
        // }
        // if (lerpY >= 0.7) insertIndex++;
        // nodeTreeRoot.children.splice(insertIndex, 0, movingNode);

        endMouseUp();
    }

    function mouseWheel(event: MouseEvent) {
        // Zoom in/out

        console.debug("Scroll");
        const deltaY = event.deltaY;

        let d_zoom = 1 * gProps.zoom * (-deltaY / 1000);

        if (gProps.zoom + d_zoom < 0.2) {
            d_zoom = 0.2 - gProps.zoom;
        } else if (gProps.zoom + d_zoom > 1) {
            d_zoom = 1 - gProps.zoom;
        }

        let dz = gProps.zoom / (gProps.zoom + d_zoom);

        let camera_dx =
            (gProps.cameraWidth / gProps.zoom) *
            (dz - 1) *
            (1 - (gProps.cameraWidth * 1.5 - mouseX) / gProps.cameraWidth);
        let camera_dy =
            (gProps.cameraHeight / gProps.zoom) *
            (dz - 1) *
            (1 - (gProps.cameraHeight * 1.5 - mouseY) / gProps.cameraHeight);

        console.debug(
            camera_dx,
            camera_dy,
            gProps.cameraWidth,
            gProps.cameraHeight,
        );
        gProps = {
            ...gProps,
            zoom: gProps.zoom + d_zoom,
            cameraX: gProps.cameraX + camera_dx,
            cameraY: gProps.cameraY + camera_dy,
        };

        console.debug(gProps);
        // if (dz > 0) {
        //     console.debug("Scroll up");
        // } else {
        //     console.debug("Scroll down");
        // }
        // gProps.zoom += dz;

        // canvasElement.style.transform = `translate(${
        //     gProps.cameraX + gProps.dx
        // }px, ${gProps.cameraY + gProps.dy}px) scale(${gProps.zoom})`;

        event.preventDefault();
    }

    afterUpdate(async () => {
        // Current code deletes and creates a new DOM object after drag & drop,
        // so we need to query for the new object.
        let dom = document.querySelectorAll("." + selectedNodeRef?.className);
        moveFrameAfterCssUpdate(dom.length > 0 ? dom[0] : null);
    });

    let panelList = [
        {
            name: "Panel 1",
        },
    ];
</script>

<div
    class="website-container"
    on:mousedown|stopPropagation={mouseDown}
    on:mouseup={mouseUp}
    on:mousemove={mouseMove}
    on:wheel={mouseWheel}
    bind:this={containerElement}
>
    <div bind:this={hoveredFrame} class="frame" id="hoveredFrame" />
    <div bind:this={selectedFrame} class="frame" id="selectedFrame" />
    <div bind:this={ghostFrame} class="frame" id="ghostFrame" />

    <div
        bind:this={canvasElement}
        class="website-canvas"
        style="transform: translate3d({gProps.cameraX}px, {gProps.cameraY}px, 0) scale({gProps.zoom})"
    >
        {#each panelList as panel}
            <Panel props={panel} />
        {/each}
    </div>
</div>

<!-- <svelte:window on:mouseup={endMouseUp} /> -->

<style>
    .website-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }
    .website-canvas {
        transform-origin: top left;
        background-color: #d5d5d5;
        width: 0px;
        height: 0px;
        position: relative;
    }
    .frame {
        position: absolute;
        border: 2px solid #ff0000;
        display: none;
    }
    #hoveredFrame {
        border: 2px solid #00ff00;
    }
    #selectedFrame {
        border: 2px solid #0000ff;
    }
    #ghostFrame {
        border: 2px solid #ff00ff;
    }
</style>
