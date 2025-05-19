import { closeMainWindow, LaunchProps } from "@raycast/api";

import { createNoteIfNotExists, openNote } from "./utils";

let running = false;    

export default function createNoteCommand(props: LaunchProps) {
    if (running) {
        return;
    }
    running = true;
    
    const title = props.arguments.title.trim() || "Untitled";
    const noteFilePath = createNoteIfNotExists(null, title);

    openNote(noteFilePath);
    closeMainWindow();
}
