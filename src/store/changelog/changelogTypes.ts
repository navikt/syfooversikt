
export interface ChangelogItem {
    title: string;
    text: string;
    image: string;
}

export interface Changelog {
    version: number;
    title: string;
    date: string;
    items: ChangelogItem[];
}
