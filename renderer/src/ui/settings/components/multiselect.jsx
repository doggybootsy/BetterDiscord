import React from "@modules/react";

import Arrow from "@ui/icons/downarrow";

const {useState, useCallback} = React;

/**
 * Difference from '@ui/settings/dropdown' is that this allows multiple addons, and the state is handled in the parent
 * @param {{ options: { selected: boolean, value: any, label: string }[], style?: "transparent", onChange: (value: any, selected: boolean) => void, label: JSX.Element | string }} param0 
 */
export default function MultiSelect({options, style, onChange, label}) {
    const hideMenu = useCallback(() => {
        setOpen(false);
        document.removeEventListener("click", hideMenu);
    }, []);

    const [open, setOpen] = useState(false);
    const showMenu = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!open) {
            setOpen(true);
            document.addEventListener("click", hideMenu);
            return;
        }
        
        setOpen(event.shiftKey);
    }, [hideMenu, open]);

    return (
        <div className={`bd-select${style == "transparent" ? " bd-select-transparent" : ""}${open ? " menu-open" : ""}`} onClick={showMenu}>
            <div className="bd-select-value">{label ?? `${options.reduce((prev, cur) => prev + Number(cur.selected), 0)}/${options.length}`}</div>
            <Arrow className="bd-select-arrow" />
            {open && (
                <div className="bd-select-options">
                    {options.map((opt, index) =>
                        <div 
                            className={`bd-select-option${opt.selected ? " selected" : ""}`} 
                            onClick={() => onChange(opt.value, !opt.selected)}
                            key={index}
                        >
                            <input type="checkbox" checked={opt.selected} />
                            {opt.label}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}