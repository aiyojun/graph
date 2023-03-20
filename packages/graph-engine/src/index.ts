import type {Node, Wire, Port, Group} from "@/engine";
import {Graph} from "@/engine";
import {CyberPanel, Descriptor} from "@/panel";
import {inject, injectFront} from '@/jlib'
import {Menu, type MenuItem} from "@/menu";
import {load, lang, $t, $T} from "@/locale";
const locale = {load, lang, $t, $T}
export {
    Graph, Node, Wire, Port, Group,
    CyberPanel, Descriptor,
    inject, injectFront,
    Menu, MenuItem, locale,
}