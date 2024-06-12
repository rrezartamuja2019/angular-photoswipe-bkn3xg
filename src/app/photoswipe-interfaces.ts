import { Item, Options } from 'photoswipe';

export interface PSUIOptions extends Options {
    addCaptionHTMLFn?: (item: PSItem, captionEl: HTMLElement, isFake?: boolean) => boolean;
    shareEl?: boolean;
}

export interface PSItem extends Item {
    bounds?: PSItemBounds;
    container?: HTMLElement;
    imageAppended?: boolean;
    img?: HTMLImageElement;
    initialPosition?: WebKitPoint;
    loaded?: boolean;
    loading?: boolean;
    // pid?: number;
    title?: string;
    msrc?: string;
}

export interface DynamicPSItem {
    smallImage?: PSItem;
    mediumImage?: PSItem;
    largeImage?: PSItem;
    originalImage: PSItem;
}

export interface PSItemBounds {
    center: WebKitPoint;
    max: WebKitPoint;
    min: WebKitPoint;
}
