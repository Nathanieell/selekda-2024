window.ToolsController = class ToolsController {
    constructor() {
        this.currentActiveTool = undefined;
        this.tools = [
            "action-brush-btn",
            "action-bucket-btn",
            "action-eraser-btn",
            "action-text-btn",
            "action-move-btn",
            "action-stamp-btn",
            "action-picker-btn",
            "action-shape-btn"
        ];

        this.listenOnClick();
    }

    activateTool(tool) {
        console.log("[ToolsController] Activating tool:", tool);
        if (this.currentActiveTool) {
            const currentToolElement = document.getElementById(this.currentActiveTool);
            currentToolElement.classList.remove("tool-active");
        }

        const toolElement = document.getElementById(tool);
        toolElement.classList.add("tool-active");

        this.currentActiveTool = tool;
    }

    listenOnClick() {
        for (const tool of this.tools) {
            const toolElement = document.getElementById(tool);
            toolElement.addEventListener("click", () => {
                this.activateTool(tool);
            });
        }
    }
}
