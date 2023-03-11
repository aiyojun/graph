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

export const scale2d = (pivot, iScale, delta, callback = () => {}) => {
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
