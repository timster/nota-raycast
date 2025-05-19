import { closeMainWindow } from "@raycast/api";

import { createNoteIfNotExists, openNote } from "./utils";

let running = false;

export default function openTasksCommand() {
    if (running) {
        return;
    }
    running = true;
    
    const title = "Current Tasks"
    const noteFilePath = createNoteIfNotExists("general", title);

    openNote(noteFilePath);
    closeMainWindow();
};
