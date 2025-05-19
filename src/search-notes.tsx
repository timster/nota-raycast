import { useMemo, useState } from "react";
import { ActionPanel, List, LaunchProps, Action, Icon } from "@raycast/api";
import Fuse from "fuse.js";

import { openNote, useNotes } from "./utils";

export default function searchNotesCommand(props: LaunchProps) {
    const notes = useNotes();

    const [searchText, setSearchText] = useState<string>("");

    const searchResults = useMemo(() => {
        const fuse = new Fuse(notes, {
            includeScore: true,
            keys: ['title', 'content']
        });
        return fuse.search(searchText);
    }, [notes, searchText]);

    return (
        <List isShowingDetail={true} searchBarPlaceholder="Search for notes..." isLoading={false} onSearchTextChange={setSearchText}>
            {searchResults.map((result) => (
                <List.Item
                    key={result.item.key}
                    title={result.item.title}
                    icon="extension-icon.png"
                    accessories={[{ icon: Icon.Folder, tag: result.item.directory || "root" }]}
                    detail={<List.Item.Detail markdown={result.item.content} />}
                    actions={
                        <ActionPanel>
                            <Action title="Open Note" onAction={() => openNote(result.item.path)} />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    )
}
