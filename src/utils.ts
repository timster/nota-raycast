import { dirname, join, relative } from "path";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";

import { getPreferenceValues, open } from "@raycast/api";

function getNotePath(directory: string | null, title: string): string {
    const { notaDirectory } = getPreferenceValues<ExtensionPreferences>();
    const filenameTitle = title.trim().replace(/[\\/]/g, "-");
    const filename = `${filenameTitle}.md`;
    const pathParts = directory ? [notaDirectory, directory, filename] : [notaDirectory, filename];
    return join(...pathParts);
}

export function openNote(filePath: string) {
    open(filePath, "Nota");
}

export function createNoteIfNotExists(directory: string | null, title: string) {
    const filePath = getNotePath(directory, title);

    console.log("Creating note at path:", filePath);

    if (existsSync(filePath)) {
        // already exists, do nothing.
        return filePath;
    }
    const content = `# ${title}\n\n`;
    writeFileSync(filePath, content, { encoding: "utf8" });
    return filePath
}

export type Note = {
    key: number;
    path: string;
    directory: string;
    content: string;
    title: string;
};

export type Snippet = Note & {
    language: string;
    markdown: string;
};

function getAllNotes(rootPath: string): Note[] {
    const result: Note[] = [];
    let keyCounter = 0;

    function walk(currentPath: string) {
        const entries = readdirSync(currentPath);

        for (const entry of entries) {
            const entryPath = join(currentPath, entry);
            const stats = statSync(entryPath);

            if (stats.isDirectory()) {
                walk(entryPath);
            } else if (entry.endsWith(".md")) {
                const content = readFileSync(entryPath, "utf-8");
                const title = entry.replace(/\.md$/, "").trim();
                result.push({
                    key: keyCounter++,
                    path: entryPath,
                    directory: relative(rootPath, dirname(entryPath)),
                    title,
                    content,
                });
            }
        }
    }

    walk(rootPath);
    return result;
}

export function useNotes(): Note[] {
    const { notaDirectory } = getPreferenceValues<Preferences>();
    return getAllNotes(notaDirectory);
}

export function useSnippets(): Snippet[] {
    const { notaDirectory } = getPreferenceValues<Preferences>();
    const notes = getAllNotes(join(notaDirectory, "snippets"));

    const snippets: Snippet[] = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

    let keyCounter = 1;
    for (const note of notes) {
        let match: RegExpExecArray | null;
        while ((match = codeBlockRegex.exec(note.content)) !== null) {
            const [, langRaw, code] = match;
            const language = langRaw.trim() || "text";
            snippets.push({
                key: keyCounter++,
                path: note.path,
                directory: note.directory,
                title: note.title,
                content: code.trim(),
                markdown: `# ${note.title}\n\n\`\`\`${language}\n${code.trim()}\n\`\`\``,
                language,
            });
        }
    }

    return snippets;
}

export function addTask(title: string) {
    const filePath = createNoteIfNotExists("general", "Current Tasks");
    const now = new Date().toISOString().split("T")[0];
    const newTask = `- [ ] [${now}] ${title}`;

    let lines = readFileSync(filePath, "utf8").split("\n");

    lines.splice(2, 0, newTask);

    writeFileSync(filePath, lines.join("\n"));

    return filePath;
}

export type Task = {
    title: string;
    line: string;
    lineNumber: number;
    done: boolean;
}

export function useTasks(): Task[] {
    const tasksFile = createNoteIfNotExists("general", "Current Tasks");

    const lines = readFileSync(tasksFile, "utf8").split("\n");

    return lines.map((line, index): Task | null => {
        const match = line.match(/^- \[( |x)\] (.+)/);
        if (!match) return null;
        const tasky = {
            title: match[2],
            line,
            lineNumber: index,
            done: match[1] === "x",
        };

        console.log(tasky)
        return tasky
    }).filter(task => task && !task.done) as Task[];
}
