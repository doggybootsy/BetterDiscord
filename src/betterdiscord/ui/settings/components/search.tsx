import React from "@modules/react";
import Button from "@ui/base/button";
import {SearchIcon, XIcon} from "lucide-react";
import type {ChangeEvent, KeyboardEvent} from "react";

const {useState, useEffect, useCallback, useRef} = React;


export interface SearchProps {
    onChange?(event: ChangeEvent<HTMLInputElement>): void;
    className?: string;
    placeholder?: string;
    onKeyDown?(event: KeyboardEvent<HTMLInputElement>): void;
    query?: string;
    internalState?: boolean;
}

export default function Search({onChange, className, onKeyDown, placeholder, query, internalState}: SearchProps) {
    const input = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(query || "");

    // focus search bar on page select
    useEffect(() => {
        if (!input.current) return;
        input.current.focus();
    }, []);

    const change = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        setValue(e.target.value);
    }, [onChange]);

    const reset = useCallback(() => {
        onChange?.({target: {value: ""}} as ChangeEvent<HTMLInputElement>);
        setValue("");
        if (!input.current) return;
        input.current.focus();
    }, [onChange, input]);

    return <div className={"bd-search-wrapper" + (className ? ` ${className}` : "")}>
        <input onChange={change} onKeyDown={onKeyDown} type="text" className="bd-search" placeholder={placeholder} maxLength={50} value={internalState === false ? query : value} ref={input} />
        {!value && <SearchIcon size="18px" />}
        {value && <Button look={Button.Looks.BLANK} color={Button.Colors.TRANSPARENT} size={Button.Sizes.NONE} onClick={reset}><XIcon size="16px" /></Button>}
    </div>;

}