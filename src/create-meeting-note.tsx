import { closeMainWindow, LaunchProps } from "@raycast/api";

import { createNoteIfNotExists, openNote } from "./utils";

let running = false;

export default function createMeetingNoteCommand(props: LaunchProps) {
    if (running) {
        return;
    }
    running = true;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const title = `${today} - ${props.arguments.title.trim() || "Untitled"}`;
    const noteFilePath = createNoteIfNotExists("meetings", title);

    openNote(noteFilePath)
    closeMainWindow();
}
