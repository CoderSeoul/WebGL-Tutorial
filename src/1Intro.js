const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


function calculatePixelIndices(top, left, width, height) {
    const pixelIndices = [];

    for (let x = left; x < left + width; x++) {
        for (let y = top; y < top + height; y++) {
            const i =
                y * canvas.width * 4 + //pixel to skip from top
                x * 4; // pixel to skip from left

            pixelIndices.push(i);
        }
    }
    return pixelIndices
}

// ctx.fillRect(0,0,100,50) =>
function fillRect(top, left, width, height) {
    //https://mdn.mozillademos.org/files/8629/typed_arrays.png
    const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4); //each pixel has 4 channels(RGBA)

    //coloring
    const pixelIndices = calculatePixelIndices(top, left, width, height);
    pixelIndices.forEach((i) => {
        pixelStore[i] = 0; //R
        pixelStore[i + 1] = 0 //G
        pixelStore[i + 2] = 0;//B
        pixelStore[i + 3] = 255 //alpha
    })

    //render
    const imageData = new ImageData(pixelStore, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
}


fillRect(10, 10, 100, 50);