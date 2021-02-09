export function compileShader(shader, source) {
    gl.shaderSource(shader, source); //connect
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader)
    if (log) throw new Error(log);
}

export async function loadImage(src) {
    const img = new Image();

    let resolve;
    const p = new Promise((resolve) => _resolve = resolve);
    Image.onload = () => {
        _resolve(img);
    }
    img.src = src;
    return p;
}