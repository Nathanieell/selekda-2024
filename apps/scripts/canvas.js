class CanvasController {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.drawing = [];


    }
}

window.addEventListener("load", () => {
    const mainCanvas = document.getElementById("main-canvas");
    const canvasController = new CanvasController(mainCanvas);
    console.log(canvasController);
});