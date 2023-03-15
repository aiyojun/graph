import { Point } from "../jlib/ds";
import { BasicNode, Wrapper } from "./graph";

export type BasicContext = {
    scale: number;
    keepSilence: boolean;
    style: 'default' | 'handle';
    lock: 'ctrl' | 'alt' | 'none';
    title: boolean;
    readonly: boolean;
    theme: string;
    selection: boolean;
}

export type BasicPort = {
    uuid?: string;
    type: number;
    i: number;
    x?: number;
    y?: number;
}

export type Group = {
    uuid: string;
    x: number;
    y: number;
    w: number;
    h: number;
    follower: Array<string>;
}

export type BasicWire = {
    from: BasicPort;
    to: BasicPort;
}

export type Task = {
    type: number;
    cursor: Point;
}

export type GraphJson = {
    nodes: Array<BasicNode>,
    wires: Array<BasicWire>;
}

export type Interceptor = {
    filter: Function;
    then: Function
}

export type Node = Wrapper<BasicNode>

export type Wire = Wrapper<BasicWire>

export type Port = Wrapper<BasicPort>
