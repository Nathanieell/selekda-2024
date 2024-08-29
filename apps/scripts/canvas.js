window.CanvasController = class CanvasController {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.drawing = [];


        this.setupListeners();
    }

    setupListeners() {
        this.listenOnMouseDown();
        this.listenOnMouseMove();
        this.listenOnMouseUp();
    }

    drawBrush(e) {
        if (this.drawing.length > 0) {
            const lastPoint = this.drawing[this.drawing.length - 1];
            this.drawing.push({ x: e.offsetX, y: e.offsetY });

            this.ctx.beginPath();
            this.ctx.moveTo(lastPoint.x, lastPoint.y);
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
        }
    }
    
    drawShape(e) {
        // TODO: Implement other shapes
        if (this.drawing.length > 0) {
            const lastPoint = this.drawing[this.drawing.length - 1];
            const startX = lastPoint.x;
            const startY = lastPoint.y;
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.strokeRect(startX, startY, width, height);
        }
    }

    listenOnMouseDown() {
        this.canvas.addEventListener("mousedown", (e) => {
            if (getCurrentActivatedTool() === "action-shape-btn") {
                const startX = e.offsetX;
                const startY = e.offsetY;

                this.drawing.push({ x: startX, y: startY });
            }

            if (getCurrentActivatedTool() !== "action-brush-btn") return;
            this.drawing = [];
            this.drawing.push({ x: e.offsetX, y: e.offsetY });
        });
    }

    listenOnMouseMove() {
        this.canvas.addEventListener("mousemove", (e) => {
            switch (getCurrentActivatedTool()) {
                case "action-brush-btn":
                    this.drawBrush(e);
                    break;
                case "action-shape-btn":
                    this.drawShape(e);
                    break;
            }
        });
    }

    listenOnMouseUp() {
        this.canvas.addEventListener("mouseup", () => {
            this.drawing = [];
        });
    }
}
