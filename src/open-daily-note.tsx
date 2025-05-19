import { closeMainWindow } from "@raycast/api";

import { createNoteIfNotExists, openNote } from "./utils";

let running = false;    

export default function openDailyNoteCommand() {
    if (running) {
        return;
    }
    running = true;

    const title = new Date().toISOString().split("T")[0];
    const noteFilePath = createNoteIfNotExists("daily", title);

    openNote(noteFilePath);
    closeMainWindow();
};
