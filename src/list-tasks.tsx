import { List, LaunchProps, Action, Icon } from "@raycast/api";

import { useTasks } from "./utils";

export default function searchTasksCommand(props: LaunchProps) {
    const tasks = useTasks();

    return (
        <List isShowingDetail={false} isLoading={false}>
            {tasks.map((task) => (
                <List.Item
                    key={task.lineNumber}
                    title={task.title}
                    icon={task.done ? Icon.CheckCircle : Icon.Circle}
                />
            ))}
        </List>
    )
}
