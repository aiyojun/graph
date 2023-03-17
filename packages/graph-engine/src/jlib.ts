export type Point = { x: number, y: number }
export const inject = (el: Element, frag: string): Element =>
{ el.insertAdjacentHTML('beforeend', frag); return el.lastElementChild }
export const injectFront = (el: Element, frag: string): Element =>
{ el.insertAdjacentHTML('afterbegin', frag); return el.lastElementChild }
export const clone = obj => JSON.parse(JSON.stringify(obj))
class Mat {
    constructor(els) { this.elements = clone(els) }
    elements = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    x(m2) {
        if (m2 instanceof Mat && m2.elements.length === 3
            && m2.elements[0] instanceof Array && m2.elements[0].length === 1
            && m2.elements[1] instanceof Array && m2.elements[1].length === 1
            && m2.elements[2] instanceof Array && m2.elements[2].length === 1
        ) {
            const r = m2.elements[0][0], g = m2.elements[1][0], b = m2.elements[2][0]
            return new Mat([
                [this.elements[0][0] * r + this.elements[0][1] * g + this.elements[0][2] * b],
                [this.elements[1][0] * r + this.elements[1][1] * g + this.elements[1][2] * b],
                [this.elements[2][0] * r + this.elements[2][1] * g + this.elements[2][2] * b],
            ])
        }
        return null
    }
}
function $M(els) { return new Mat(els) }
function ScaleMatrix() {
    this.args = [0, 0, 1];
    this.scale = (x, y, s) => { this.args[0] = x; this.args[1] = y; this.args[2] = s; return this; }
    this.transform = (x, y) => {
        let MM = $M([[1, 0, -this.args[0]], [0, -1, this.args[1]], [0, 0, 1],])
            .x($M([[x], [y], [1]]));
        MM = $M([[this.args[2], 0, 0], [0, this.args[2], 0], [0, 0, 1],]).x(MM);
        MM = $M([[1, 0, this.args[0]], [0, -1, this.args[1]], [0, 0, 1]]).x(MM);
        return [
            Math.round(MM.elements[0][0] * 10000000) / 10000000,
            Math.round(MM.elements[1][0] * 10000000) / 10000000
        ];
    }
}
export const scaleMatrix = new ScaleMatrix();
export const scale2d = (pivot: {x: number, y: number}, iScale: number, delta: number, callback: Function = () => {}) => {
    let scale = iScale
    const limit = delta < 0 ? 1 : 1000;
    const f = delta < 0 ? 1 : -1
    if (f * Math.round(scale * 100) <= f * limit) return
    let factor = 1.0 + (-0.1) * f;
    if (f * scale * factor * 100 < f * limit) {
        factor = limit * 0.01 / scale;
        scale = limit * 0.01;
    } else {
        scale *= factor;
        scale = Math.round(scale * 10000000) / 10000000;
    }
    scaleMatrix.scale(pivot.x, pivot.y, factor)
    if (typeof callback === 'function') {
        try {
            callback(scale, (_x, _y) => {
                const m =scaleMatrix.transform(_x, _y)
                return {x: m[0], y: m[1]}
            })
        } catch (e) {
            console.error(e)
        }
    }
    return scale
}
function remap(px, py, dir, delta) {
    if (dir === 'up') {
        return [px, py - delta];
    } else if (dir === 'down') {
        return [px, py + delta];
    } else if (dir === 'left') {
        return [px - delta, py];
    } else if (dir === 'right') {
        return [px + delta, py];
    } else {
        throw new Error('Unknown wire direction: ' + dir + '!');
    }
}
export function wirePath(obj = {
    p1dir: 'up', p2dir: 'down', p2x: 200, p1y: 200, p1x: 600, p2y: 300,
    scale: 1, delta: 30, wire: 'wire', edge: 6
}) {
    let path;
    let p2x = obj.p2x === null ? obj.p1x : obj.p2x;
    let p2y = obj.p2y === null ? obj.p1y : obj.p2y;
    const edge = obj.edge * obj.scale;
    let p1r = remap(obj.p1x, obj.p1y, obj.p1dir, obj.delta * obj.scale);
    let p2r = remap(p2x, p2y, obj.p2dir, obj.delta * obj.scale);
    let pmr = [(p1r[0] + p2r[0]) * 0.5, (p1r[1] + p2r[1]) * 0.5];
    if (obj.wire === 'curve' && obj.p1dir === 'right' && obj.p2dir === 'left') {
        let point1 = [obj.p1x, obj.p1y];
        let point2 = [obj.p2x, obj.p2y];
        path = `M${point1[0].toFixed()} ${point1[1].toFixed()} ` +
            `C${(point1[0] + point2[0]) / 2} ${point1[1].toFixed()}` +
            ` ${(point1[0] + point2[0]) / 2} ${point2[1].toFixed()}` +
            ` ${point2[0].toFixed()} ${point2[1].toFixed()}`
        ;
    } else if (obj.wire === 'curve') {
        let point1 = [obj.p1x, obj.p1y];
        let point2 = [obj.p2x, obj.p2y];
        path = `M${point1[0]} ${point1[1]} ` +
            `C${point1[0]} ${(point1[1] + point2[1]) / 2}` +
            ` ${point2[0]} ${(point1[1] + point2[1]) / 2}` +
            ` ${point2[0]} ${point2[1]}`
        ;
    } else if (obj.wire === 'wire') {
        if (obj.p1dir === obj.p2dir && obj.p1dir === 'up' && obj.p1y <= p2y) {
            path = `M${obj.p1x} ${obj.p1y} L${p1r[0]} ${p1r[1] + edge} L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0]} ${p1r[1] + edge} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === obj.p2dir && obj.p1dir === 'up' && obj.p1y > p2y) {
            path = `M${p2x} ${p2y} L${p2r[0]} ${p2r[1] + edge} L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0]} ${p2r[1] + edge} L${p1r[0]} ${p1r[1]} L${obj.p1x} ${obj.p1y}`;
        } else if (obj.p1dir === obj.p2dir && obj.p1dir === 'down' && obj.p1y > p2y) {
            path = `M${obj.p1x} ${obj.p1y} L${p1r[0]} ${p1r[1] - edge} L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0]} ${p1r[1] - edge} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === obj.p2dir && obj.p1dir === 'down' && obj.p1y <= p2y) {
            path = `M${p2x} ${p2y} L${p2r[0]} ${p2r[1] - edge} L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0]} ${p2r[1] - edge} L${p1r[0]} ${p1r[1]} L${obj.p1x} ${obj.p1y}`;
        } else if (obj.p1dir === obj.p2dir && obj.p1dir === 'left' && obj.p1x <= p2x) {
            path = `M${obj.p1x} ${obj.p1y} L${p1r[0] + edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0] + edge} ${p2r[1]} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === obj.p2dir && obj.p1dir === 'left' && obj.p1x > p2x) {
            path = `M${p2x} ${p2y} L${p2r[0] + edge} ${p2r[1]} L${p2r[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0] + edge} ${p1r[1]} L${p1r[0]} ${p1r[1]} L${obj.p1x} ${obj.p1y}`;
        } else if (obj.p1dir === obj.p2dir && obj.p1dir === 'right' && obj.p1x <= p2x) {
            path = `M${p2x} ${p2y} L${p2r[0] - edge} ${p2r[1]} L${p2r[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0] - edge} ${p1r[1]} L${p1r[0]} ${p1r[1]} L${obj.p1x} ${obj.p1y}`;
        } else if (obj.p1dir === obj.p2dir && obj.p1dir === 'right' && obj.p1x > p2x) {
            path = `M${obj.p1x} ${obj.p1y} L${p1r[0] - edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0] - edge} ${p2r[1]} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'left' && obj.p2dir === 'right' && obj.p1x <= p2x) {
            path = `M${obj.p1x} ${obj.p1y} L${p1r[0] + edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${pmr[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0] + edge} ${pmr[1]} L${p2r[0] - edge} ${pmr[1]} L${p2r[0]} ${pmr[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0] - edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'left' && obj.p2dir === 'right' && obj.p1x > p2x) {
            path = `M${obj.p1x} ${obj.p1y} L${pmr[0] + edge} ${p1r[1]} L${pmr[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${pmr[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${pmr[0] - edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'right' && obj.p2dir === 'left' && obj.p1x <= p2x) {
            path = `M${obj.p1x} ${obj.p1y} L${pmr[0] - edge} ${p1r[1]} L${pmr[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${pmr[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${pmr[0] + edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'right' && obj.p2dir === 'left' && obj.p1x > p2x) {
            path = `M${obj.p1x} ${obj.p1y} L${p1r[0] - edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${pmr[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p1r[0] - edge} ${pmr[1]} L${p2r[0] + edge} ${pmr[1]} L${p2r[0]} ${pmr[1] + edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p2r[1] - edge * (obj.p1y <= p2y ? 1 : -1)} L${p2r[0] + edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'up' && obj.p2dir === 'down' && obj.p1y < p2y) {
            path = `M${obj.p1x} ${obj.p1y} `
                +`L${p1r[0]} ${p1r[1] + edge} `
                +`L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
                +`L${pmr[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
                +`L${pmr[0]} ${p1r[1] + edge} `
                +`L${pmr[0]} ${p2r[1] - edge} `
                +`L${pmr[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
                +`L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
                +`L${p2r[0]} ${p2r[1] - edge} `
                +`L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'up' && obj.p2dir === 'down' && obj.p1y >= p2y) {
            path = `M${obj.p1x} ${obj.p1y} `
                +`L${p1r[0]} ${pmr[1] + edge} `
                +`L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
                +`L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
                +`L${p2r[0]} ${pmr[1] - edge} `
                +`L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'down' && obj.p2dir === 'up' && obj.p1y >= p2y) {
            path = `M${obj.p1x} ${obj.p1y} `
                +`L${p1r[0]} ${p1r[1] - edge} `
                +`L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
                +`L${pmr[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
                +`L${pmr[0]} ${p1r[1] - edge} `
                +`L${pmr[0]} ${p2r[1] + edge} `
                +`L${pmr[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
                +`L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
                +`L${p2r[0]} ${p2r[1] + edge} `
                +`L${p2x} ${p2y}`;
        } else if (obj.p1dir === 'down' && obj.p2dir === 'up' && obj.p1y < p2y) {
            const dist = Math.abs(obj.p1x - pmr[0]);
            if (dist <= obj.edge * obj.scale) {
                const zp = dist * Math.sqrt(2);
                path = `M${obj.p1x} ${obj.p1y} `
                    + `L${obj.p1x} ${pmr[1] - zp}`
                    + `L${obj.p2x} ${pmr[1] + zp}`
                    + `L${p2x} ${p2y}`;
            } else {
                path = `M${obj.p1x} ${obj.p1y} `
                    +`L${p1r[0]} ${pmr[1] - edge} `
                    +`L${p1r[0] + edge * (obj.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
                    +`L${p2r[0] - edge * (obj.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
                    +`L${p2r[0]} ${pmr[1] + edge} `
                    +`L${p2x} ${p2y}`;
            }
        }
    } else if (obj.wire === 'line') {
        path = `M${obj.p1x} ${obj.p1y} `
            + `L${p1r[0]} ${p1r[1]} `
            + `L${p2r[0]} ${p2r[1]} `
            + `L${p2x} ${p2y}`;
    } else {

    }
    return path;
}