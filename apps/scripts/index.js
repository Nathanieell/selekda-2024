window.app = {};
window.app.controllers = [];

window.addEventListener("load", () => {
    const mainCanvas = document.getElementById("main-canvas");
    const layerContainer = document.getElementById("layer-container");
    const canvasController = new CanvasController(mainCanvas, layerContainer);
    
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

function getDragAfterElement(container, y) {
    const draggableElements = [
        ...container.querySelectorAll(
            "li:not(.dragging)"
        ),];
 
    return draggableElements.reduce(
        (closest, child) => {
            const box =
                child.getBoundingClientRect();
            const offset =
                y - box.top - box.height / 2;
            if (
                offset < 0 &&
                offset > closest.offset) {
                return {
                    offset: offset,
                    element: child,
                };} 
            else {
                return closest;
            }},
        {
            offset: Number.NEGATIVE_INFINITY,
        }
    ).element;
};