window.CanvasController = class CanvasController {
    constructor(canvas, layerContainer) {
        this.canvas = canvas;
        this.layerContainer = layerContainer;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.selectedShape = "circle";
        this.layers = [];
        this.currentStroke = [];
        this.startX = 0;
        this.startY = 0;

        this.listenOnMouseDown();
        this.listenOnMouseMove();
        this.listenOnMouseUp();
        this.listenOnLayerDrag();
    }

    redraw() {
        // Clear canvas context
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const layer of this.layers) {
            switch (layer.type) {
                case "circle": {
                    this.ctx.beginPath();
                    this.ctx.arc(layer.x, layer.y, layer.radius, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    break;
                }

                case "rect": {
                    this.ctx.strokeRect(layer.startX, layer.startY, layer.width, layer.height);
                    break;
                }

                case "stroke": {
                    this.ctx.beginPath();
                    layer.points.forEach((point, index) => {
                        if (index === 0) {
                            this.ctx.moveTo(point.x, point.y);
                        } else {
                            this.ctx.lineTo(point.x, point.y);
                        }
                    });
                    this.ctx.stroke();
                    break;
                }

                case "image": {
                    this.ctx.drawImage(layer.image, 0, 0);
                    break;
                }
            }
        }

        // Layer list render
        const layerList = document.getElementById("layer-container");
        layerList.innerHTML = "";
        this.layers.forEach((layer, index) => {
            const layerElement = document.createElement("li");
            layerElement.draggable  = true;
            layerElement.id = `layer-${index}`;
            layerElement.textContent = `Layer ${index + 1} - ${layer.type}`;
            layerElement.addEventListener("click", () => {
                this.layers.splice(index, 1);
                this.redraw();
            });
            layerList.appendChild(layerElement);
        });
    }

    draw() {
        this.redraw();
        if (!this.isDrawing) return;

        switch (getCurrentActivatedTool()) {
            case "action-shape-btn": {
                const width = this.currentX - this.startX;
                const height = this.currentY - this.startY;
                if (this.selectedShape === "circle") {
                    this.ctx.beginPath();
                    this.ctx.arc(this.startX + width / 2, this.startY + height / 2, Math.abs(width / 2), 0, 2 * Math.PI);
                    this.ctx.stroke();
                } else {
                    this.ctx.strokeRect(this.startX, this.startY, width, height);
                }
                break;
            }

            case "action-brush-btn": {
                this.ctx.beginPath();
                this.currentStroke.forEach((point, index) => {
                    if (index === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                this.ctx.stroke();
                break;
            }
        }
    }

    listenOnMouseDown() {
        this.canvas.addEventListener("mousedown", (e) => {
            const tool = getCurrentActivatedTool();
            if (!["action-shape-btn", "action-brush-btn" ].includes(tool)) return;
            this.isDrawing = true;
            this.startX = e.offsetX;
            this.startY = e.offsetY;
            if (tool === 'action-brush-btn') {
                this.currentStroke = [{ x: e.offsetX, y: e.offsetY }];
            }
        });
    }

    listenOnMouseMove() {
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isDrawing) return;
            this.currentX = e.offsetX;
            this.currentY = e.offsetY;
            if (getCurrentActivatedTool() === "action-brush-btn") {
                this.currentStroke.push({ x: e.offsetX, y: e.offsetY });
            }
            this.draw();
        });
    }

    listenOnMouseUp() {
        this.canvas.addEventListener("mouseup", (e) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            const tool = getCurrentActivatedTool();
            switch (tool) {
                case "action-shape-btn": {
                    const width = e.offsetX - this.startX;
                    const height = e.offsetY - this.startY;
                    if (this.selectedShape === "circle") {
                        this.layers.push({ type: "circle", x: this.startX + width / 2, y: this.startY + height / 2, radius: Math.abs(width / 2) });
                    } else {
                        this.layers.push({ type: "rect", startX: this.startX, startY: this.startY, width, height });
                    }
                    break;
                }

                case "action-brush-btn": {
                    this.layers.push({ type: "stroke", points: this.currentStroke });
                    break;
                }
            }

            this.draw();
        });
    }

    listenOnLayerDrag() {
        this.layerContainer.addEventListener("dragstart", (e) => {
            const layerElement = e.target;
            layerElement.classList.add("dragging");
        });

        this.layerContainer.addEventListener("dragend", (e) => {
            const layerElement = e.target;
            layerElement.classList.remove("dragging");
            console.log("[CanvasController] result", [...this.layerContainer.children].map(x => x.id));
            const layers = [...this.layerContainer.children].map(el => parseInt(el.id.split("-")[1]));
            
            // reorder layers based on new layers order
            this.layers = layers.map(index => this.layers[index]);

            console.log("[CanvasController] Reordered layers", this.layers);

            this.redraw();
        });

        this.layerContainer.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(this.layerContainer, e.clientY);
            const draggingElement = this.layerContainer.querySelector(".dragging");

            if (afterElement == null) {
                this.layerContainer.appendChild(draggingElement);
            } else {
                this.layerContainer.insertBefore(draggingElement, afterElement);
            }
        });
    }

    pasteImage() {
        navigator.clipboard.read().then((data) => {
            console.log("[CanvasController] Pasting", { data });
            for (const item of data) {
                for (const type of item.types) {
                    if (type === "image/png") {
                        console.log("[CanvasController] Pasting image");
                        item.getType(type).then(blob => {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onload = () => {
                                console.log("[CanvasController] Pasting image", { result: reader.result });
                                const image = new Image();
                                image.src = reader.result;
                                image.onload = () => {
                                    this.layers.push({ type: "image", image });
                                    this.redraw();
                                };
                            };
                        });
                        
                    }
                }
            }
        });
    }
}