import { closeMainWindow, LaunchProps } from "@raycast/api";

import { addTask } from "./utils";

let running = false;

export default function createNoteCommand(props: LaunchProps) {
    if (running) {
        return;
    }
    running = true;

    const title = props.arguments.title.trim() || "Unknown Task";
    addTask(title);
    closeMainWindow();
}
