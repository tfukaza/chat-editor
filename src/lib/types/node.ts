/**
 * Metadata for each DOM object in the canvas.
 * We call it 'Canvas Node' to distinguish it from the actual DOM object. 
 */
export interface CanvasNodeInterface {
    name: string,                           // The name the user gives to the node
    tag: string,                            // A unique id for the node
    content: string,                        // The content of this DOM object set by the user.   
    dom: Element | null,                    // Reference to the actual DOM object in the canvas
    className: string;                      // className of the DOM object
    children: Array<CanvasNodeInterface>,   // Child nodes of this node
    parent: CanvasNodeInterface | null,     // Parent node
    css: cssInterface,                      // Styling info for this node.
    properties: { [prop: string]: string }  // Properties of this tag
}


/**
 * Dictionary for the configurable CSS attributes of each DOM object. 
 */
interface cssInterfaceDefine {

    /* Meta attributes that cannot be configured by user */

    /* Configurable by user */
    width: number | string,
    height: number | string,

    border_radius: number | string,

    margin_top: number | string,
    margin_bottom: number | string,
    margin_right: number | string,
    margin_left: number | string,

    padding_top: number | string,
    padding_bottom: number | string,
    padding_right: number | string,
    padding_left: number | string,

    background_color: string,

    text_alighn: string;
    font_size: string,
    font_family: string,
    font_weight: string,


}

export type cssInterface = Partial<cssInterfaceDefine>;

export interface cssInterfaceDict {
    [key: string]: cssInterface
}
/**
 * Dictionary that stores real time data 
 */
export interface propInterface {
    mouseDownX: number;
    mouseDownY: number;
}

