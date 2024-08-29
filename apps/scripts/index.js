window.app = {};
window.app.controllers = [];

window.addEventListener("load", () => {
    const mainCanvas = document.getElementById("main-canvas");
    const canvasController = new CanvasController(mainCanvas);
    
    window.app.controllers.push(new ToolsController(), canvasController);
});

function getController(type) {
    const controller = window.app.controllers.find((controller) => controller instanceof type);
    if (!controller) {
        throw new Error("Controller not found");
    }

    return controller;
}

function getCurrentActivatedTool() {
    return getController(ToolsController).currentActiveTool;
}