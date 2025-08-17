import type Web from "@data/web";
import {createContext} from "react";

export type Tags = typeof Web.store.tags[keyof typeof Web.store.tags][number];

type TagContextValue = [
    hasTag: (tag: Tags) => boolean,
    toggleTag: (tag: Tags, value?: boolean) => void
];

export const TagContext = createContext<TagContextValue>([
    () => false,
    () => {}
]);
