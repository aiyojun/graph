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