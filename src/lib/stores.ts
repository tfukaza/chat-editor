import { writable } from 'svelte/store';

export const nodeTree = writable({});       // Reference to the root node for global node tree of the website's content
export const mouseoverNode = writable({});   // Current canvas node being hovered.
export const selectedNode = writable({});   // Current canvas node that is selected.
export const draggingNode = writable({});        // Current canvas node being dragged. 

export const cssStyles = writable({});      // A global map for canvas nodes and their CSS data object. 