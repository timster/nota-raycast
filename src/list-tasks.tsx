import { List, LaunchProps, Action, Icon, ActionPanel } from "@raycast/api";

import { createNoteIfNotExists, openNote, useTasks } from "./utils";

export default function searchTasksCommand(props: LaunchProps) {
    const tasks = useTasks();

    const currenTasksNote = createNoteIfNotExists("general", "Current Tasks")

    return (
        <List isShowingDetail={false} isLoading={false}>
            {tasks.map((task) => (
                <List.Item
                    key={task.lineNumber}
                    title={task.title}
                    icon={task.done ? Icon.CheckCircle : Icon.Circle}

                    accessories={[{ tag: task.date }]}

                    actions={
                        <ActionPanel>
                            <Action title="Open Current Tasks" onAction={() => openNote(currenTasksNote)} />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    )
}
