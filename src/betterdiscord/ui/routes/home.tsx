import React from "react";

import {BasePage} from "./Page";
import {useInternalStore} from "@ui/hooks";
import {getModule, Stores} from "@webpack";
import HeaderBar from "./Header";
import {Bird, Rabbit, Squirrel, type LucideProps} from "lucide-react";
import Button from "@ui/base/button";
import routemanager from "@modules/routemanager";

function Logo(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" enableBackground="new 0 0 2000 2000" xmlSpace="preserve">
            <g>
                <path fill={props.color} d="M1402.2,631.7c-9.7-353.4-286.2-496-642.6-496H68.4v714.1l442,398V490.7h257c274.5,0,274.5,344.9,0,344.9H597.6v329.5h169.8c274.5,0,274.5,344.8,0,344.8h-699v354.9h691.2c356.3,0,632.8-142.6,642.6-496c0-162.6-44.5-284.1-122.9-368.6C1357.7,915.8,1402.2,794.3,1402.2,631.7z" />
                <path fill={props.color} d="M1262.5,135.2L1262.5,135.2l-76.8,0c26.6,13.3,51.7,28.1,75,44.3c70.7,49.1,126.1,111.5,164.6,185.3c39.9,76.6,61.5,165.6,64.3,264.6l0,1.2v1.2c0,141.1,0,596.1,0,737.1v1.2l0,1.2c-2.7,99-24.3,188-64.3,264.6c-38.5,73.8-93.8,136.2-164.6,185.3c-22.6,15.7-46.9,30.1-72.6,43.1h72.5c346.2,1.9,671-171.2,671-567.9V716.7C1933.5,312.2,1608.7,135.2,1262.5,135.2z" />
            </g>
        </svg>
    );
}

const AccessibilityContext = getModule<React.Context<{reducedMotion: {enabled: false;};}>>(m => m?._currentValue?.reducedMotion, {searchExports: true}) || React.createContext({
    reducedMotion: {enabled: false}
});

class FloatingStore {
    private static svg = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 2000 2000" enable-background="new 0 0 2000 2000" xml:space="preserve">
<g opacity="0.3">
    <path fill="#000000" d="M638.3,580c-5.9-5.9-15.4-5.9-21.2,0v0l-26,26l-26-26c-5.9-5.9-15.4-5.9-21.2,0s-5.9,15.4,0,21.2l26,26
        l-26,26c-5.9,5.9-5.9,15.4,0,21.2s15.4,5.9,21.2,0l26-26l26,26c5.9,5.9,15.4,5.9,21.2,0s5.9-15.4,0-21.2l-26-26l26-26
        C644.2,595.3,644.2,585.8,638.3,580z"/>
    <path fill="#000000" d="M1479.6,1437.2c-5.9-5.9-15.4-5.9-21.2,0l0,0l-26,26l-26-26c-5.9-5.9-15.4-5.9-21.2,0
        c-5.9,5.9-5.9,15.4,0,21.2h0l26,26l-26,26c-5.9,5.9-5.9,15.4,0,21.2c5.9,5.9,15.4,5.9,21.2,0l26-26l26,26c5.9,5.9,15.4,5.9,21.2,0
        c5.9-5.9,5.9-15.4,0-21.2l-26-26l26-26C1485.5,1452.5,1485.5,1443,1479.6,1437.2z"/>
    <path fill="#000000" d="M601.7,1738.7c-5.9-5.9-15.4-5.9-21.2,0v0l-26,26l-26-26c-5.9-5.9-15.4-5.9-21.2,0
        c-5.9,5.9-5.9,15.4,0,21.2h0l26,26l-26,26c-5.9,5.9-5.9,15.4,0,21.2c5.9,5.9,15.4,5.9,21.2,0l26-26l26,26c5.9,5.9,15.4,5.9,21.2,0
        c5.9-5.9,5.9-15.4,0-21.2l-26-26l26-26C607.6,1754.1,607.6,1744.6,601.7,1738.7z"/>
    <path fill="#000000" d="M1736.2,305.8c5.9,5.9,15.4,5.9,21.2,0c5.9-5.9,5.9-15.4,0-21.2l-26-26l26-26c5.9-5.9,5.9-15.4,0-21.2
        c-5.9-5.9-15.4-5.9-21.2,0h0l-26,26l-26-26c-5.9-5.9-15.4-5.9-21.2,0c-5.9,5.9-5.9,15.4,0,21.2h0l26,26l-26,26
        c-5.9,5.9-5.9,15.4,0,21.2c5.9,5.9,15.4,5.9,21.2,0l26-26L1736.2,305.8z"/>
    <path fill="#000000" d="M1174.9,539c-5-3.4-10.5-6-16.3-7.8c-5.9-1.8-12.1-2.8-18.5-2.8c-8.6,0-16.8,1.7-24.2,4.9
        c-11.2,4.7-20.7,12.6-27.4,22.5c-3.4,5-6,10.5-7.8,16.3c-1.8,5.9-2.8,12.1-2.8,18.5c0,8.6,1.7,16.8,4.9,24.2
        c4.7,11.2,12.6,20.7,22.5,27.4c5,3.4,10.5,6,16.3,7.8c5.9,1.8,12.1,2.8,18.5,2.8c8.6,0,16.8-1.7,24.2-4.9
        c11.2-4.7,20.7-12.6,27.4-22.5c3.4-5,6-10.5,7.8-16.3c1.8-5.9,2.8-12.1,2.8-18.5c0-8.6-1.7-16.8-4.9-24.2
        C1192.7,555.2,1184.8,545.7,1174.9,539z M1169.8,603.1c-2.4,5.8-6.5,10.7-11.7,14.2c-2.6,1.7-5.4,3.1-8.4,4.1
        c-3,0.9-6.2,1.4-9.6,1.4c-4.5,0-8.7-0.9-12.6-2.5c-5.8-2.4-10.7-6.5-14.2-11.7c-1.7-2.6-3.1-5.4-4.1-8.4c-0.9-3-1.4-6.2-1.4-9.6
        c0-4.5,0.9-8.7,2.5-12.6c2.4-5.8,6.5-10.7,11.7-14.2c2.6-1.7,5.4-3.1,8.4-4.1c3-0.9,6.2-1.4,9.6-1.4c4.5,0,8.7,0.9,12.6,2.5
        c5.8,2.4,10.7,6.5,14.2,11.7c1.7,2.6,3.1,5.4,4.1,8.4c0.9,3,1.4,6.2,1.4,9.6C1172.3,595.1,1171.4,599.3,1169.8,603.1z"/>
    <path fill="#000000" d="M1804.9,1802.5c-5-3.4-10.5-6-16.3-7.8c-5.9-1.8-12.1-2.8-18.5-2.8c-8.6,0-16.8,1.7-24.2,4.9
        c-11.2,4.7-20.7,12.6-27.4,22.5c-3.4,5-6,10.5-7.8,16.3c-1.8,5.9-2.8,12.1-2.8,18.5c0,8.6,1.7,16.8,4.9,24.2
        c4.7,11.2,12.6,20.7,22.5,27.4c5,3.4,10.5,6,16.3,7.8c5.9,1.8,12.1,2.8,18.5,2.8c8.6,0,16.8-1.7,24.2-4.9
        c11.2-4.7,20.7-12.6,27.4-22.5c3.4-5,6-10.5,7.8-16.3c1.8-5.9,2.8-12.1,2.8-18.5c0-8.6-1.7-16.8-4.9-24.2
        C1822.7,1818.7,1814.8,1809.3,1804.9,1802.5z M1799.8,1866.7c-2.4,5.8-6.5,10.7-11.7,14.2c-2.6,1.7-5.4,3.1-8.4,4.1
        c-3,0.9-6.2,1.4-9.6,1.4c-4.5,0-8.7-0.9-12.6-2.5c-5.8-2.4-10.7-6.5-14.2-11.7c-1.7-2.6-3.1-5.4-4.1-8.4c-0.9-3-1.4-6.2-1.4-9.6
        c0-4.5,0.9-8.7,2.5-12.6c2.4-5.8,6.5-10.7,11.7-14.2c2.6-1.7,5.4-3.1,8.4-4.1c3-0.9,6.2-1.4,9.6-1.4c4.5,0,8.7,0.9,12.6,2.5
        c5.8,2.4,10.7,6.5,14.2,11.7c1.7,2.6,3.1,5.4,4.1,8.4c0.9,3,1.4,6.2,1.4,9.6C1802.3,1858.7,1801.4,1862.9,1799.8,1866.7z"/>
    <path fill="#000000" d="M914.7,1411.4c-5-3.4-10.5-6-16.3-7.8c-5.9-1.8-12.1-2.8-18.5-2.8c-8.6,0-16.8,1.7-24.2,4.9
        c-11.2,4.7-20.7,12.6-27.4,22.5c-3.4,5-6,10.5-7.8,16.3c-1.8,5.9-2.8,12.1-2.8,18.5c0,8.6,1.7,16.8,4.9,24.2
        c4.7,11.2,12.6,20.7,22.5,27.4c5,3.4,10.5,6,16.3,7.8c5.9,1.8,12.1,2.8,18.5,2.8c8.6,0,16.8-1.7,24.2-4.9
        c11.2-4.7,20.7-12.6,27.4-22.5c3.4-5,6-10.5,7.8-16.3c1.8-5.9,2.8-12.1,2.8-18.5c0-8.6-1.7-16.8-4.9-24.2
        C932.5,1427.6,924.6,1418.1,914.7,1411.4z M909.6,1475.6c-2.4,5.8-6.5,10.7-11.7,14.2c-2.6,1.7-5.4,3.1-8.4,4.1
        c-3,0.9-6.2,1.4-9.6,1.4c-4.5,0-8.7-0.9-12.6-2.5c-5.8-2.4-10.7-6.5-14.2-11.7c-1.7-2.6-3.1-5.4-4.1-8.4c-0.9-3-1.4-6.2-1.4-9.6
        c0-4.5,0.9-8.7,2.5-12.6c2.4-5.8,6.5-10.7,11.7-14.2c2.6-1.7,5.4-3.1,8.4-4.1c3-0.9,6.2-1.4,9.6-1.4c4.5,0,8.7,0.9,12.6,2.5
        c5.8,2.4,10.7,6.5,14.2,11.7c1.7,2.6,3.1,5.4,4.1,8.4c0.9,3,1.4,6.2,1.4,9.6C912.1,1467.6,911.2,1471.8,909.6,1475.6z"/>
    <path fill="#000000" d="M1946.9,566.3c-4.7-11.2-12.6-20.7-22.5-27.4c-5-3.4-10.5-6-16.3-7.8c-5.9-1.8-12.1-2.8-18.5-2.8
        c-8.6,0-16.8,1.7-24.2,4.9c-11.2,4.7-20.7,12.6-27.4,22.5c-3.4,5-6,10.5-7.8,16.3c-1.8,5.9-2.8,12.1-2.8,18.5
        c0,8.6,1.7,16.8,4.9,24.2c4.7,11.2,12.6,20.7,22.5,27.4c5,3.4,10.5,6,16.3,7.8c5.9,1.8,12.1,2.8,18.5,2.8c8.6,0,16.8-1.7,24.2-4.9
        c11.2-4.7,20.7-12.6,27.4-22.5c3.4-5,6-10.5,7.8-16.3c1.8-5.9,2.8-12.1,2.8-18.5C1951.8,582,1950,573.8,1946.9,566.3z
         M1919.3,603.1c-2.4,5.8-6.5,10.7-11.7,14.2c-2.6,1.7-5.4,3.1-8.4,4.1c-3,0.9-6.2,1.4-9.6,1.4c-4.5,0-8.7-0.9-12.6-2.5
        c-5.8-2.4-10.7-6.5-14.2-11.7c-1.7-2.6-3.1-5.4-4.1-8.4c-0.9-3-1.4-6.2-1.4-9.6c0-4.5,0.9-8.7,2.5-12.6c2.4-5.8,6.5-10.7,11.7-14.2
        c2.6-1.7,5.4-3.1,8.4-4.1c3-0.9,6.2-1.4,9.6-1.4c4.5,0,8.7,0.9,12.6,2.5c5.8,2.4,10.7,6.5,14.2,11.7c1.7,2.6,3.1,5.4,4.1,8.4
        c0.9,3,1.4,6.2,1.4,9.6C1921.8,595.1,1920.9,599.3,1919.3,603.1z"/>
    <path fill="#000000" d="M292.8,206.9c-5-3.4-10.5-6-16.3-7.8c-5.9-1.8-12.1-2.8-18.5-2.8c-8.6,0-16.8,1.7-24.2,4.9
        c-11.2,4.7-20.7,12.6-27.4,22.5c-3.4,5-6,10.5-7.8,16.3c-1.8,5.9-2.8,12.1-2.8,18.5c0,8.6,1.7,16.8,4.9,24.2
        c4.7,11.2,12.6,20.7,22.5,27.4c5,3.4,10.5,6,16.3,7.8c5.9,1.8,12.1,2.8,18.5,2.8c8.6,0,16.8-1.7,24.2-4.9
        c11.2-4.7,20.7-12.6,27.4-22.5c3.4-5,6-10.5,7.8-16.3c1.8-5.9,2.8-12.1,2.8-18.5c0-8.6-1.7-16.8-4.9-24.2
        C310.6,223.1,302.7,213.6,292.8,206.9z M287.7,271.1c-2.4,5.8-6.5,10.7-11.7,14.2c-2.6,1.7-5.4,3.1-8.4,4.1c-3,0.9-6.2,1.4-9.6,1.4
        c-4.5,0-8.7-0.9-12.6-2.5c-5.8-2.4-10.7-6.5-14.2-11.7c-1.7-2.6-3.1-5.4-4.1-8.4c-0.9-3-1.4-6.2-1.4-9.6c0-4.5,0.9-8.7,2.5-12.6
        c2.4-5.8,6.5-10.7,11.7-14.2c2.6-1.7,5.4-3.1,8.4-4.1c3-0.9,6.2-1.4,9.6-1.4c4.5,0,8.7,0.9,12.6,2.5c5.8,2.4,10.7,6.5,14.2,11.7
        c1.7,2.6,3.1,5.4,4.1,8.4c0.9,3,1.4,6.2,1.4,9.6C290.2,263.1,289.3,267.3,287.7,271.1z"/>
    <path fill="#000000" d="M464.8,1091.9c-2-1.4-4.3-2.5-6.7-3.2c-2.4-0.7-5-1.1-7.6-1.1c-3.5,0-6.9,0.7-9.9,2
        c-4.6,1.9-8.5,5.2-11.2,9.2c-1.4,2-2.5,4.3-3.2,6.7c-0.7,2.4-1.1,5-1.1,7.6c0,3.5,0.7,6.9,2,9.9c1.9,4.6,5.2,8.5,9.2,11.2
        c2,1.4,4.3,2.5,6.7,3.2c2.4,0.7,5,1.1,7.6,1.1c3.5,0,6.9-0.7,9.9-2c4.6-1.9,8.5-5.2,11.2-9.2c1.4-2,2.5-4.3,3.2-6.7
        c0.7-2.4,1.1-5,1.1-7.6c0-3.5-0.7-6.9-2-9.9C472,1098.5,468.8,1094.6,464.8,1091.9z M450.5,1113L450.5,1113l4.3-1.3L450.5,1113z
         M450.5,1113L450.5,1113l-1.3-4.3L450.5,1113z M450.5,1113L450.5,1113l-3.7,2.5L450.5,1113z M450.5,1113l2.5,3.7L450.5,1113
        l4.1,1.8L450.5,1113z"/>
    <path fill="#000000" d="M1191.1,1775.3c-2-1.4-4.3-2.5-6.7-3.2c-2.4-0.7-5-1.1-7.6-1.1c-3.5,0-6.9,0.7-9.9,2
        c-4.6,1.9-8.5,5.2-11.2,9.2c-1.4,2-2.5,4.3-3.2,6.7c-0.7,2.4-1.1,5-1.1,7.6c0,3.5,0.7,6.9,2,9.9c1.9,4.6,5.2,8.5,9.2,11.2
        c2,1.4,4.3,2.5,6.7,3.2c2.4,0.7,5,1.1,7.6,1.1c3.5,0,6.9-0.7,9.9-2c4.6-1.9,8.5-5.2,11.2-9.2c1.4-2,2.5-4.3,3.2-6.7
        c0.7-2.4,1.1-5,1.1-7.6c0-3.5-0.7-6.9-2-9.9C1198.4,1781.9,1195.2,1778.1,1191.1,1775.3z M1176.9,1796.4L1176.9,1796.4l1.8-4.1
        L1176.9,1796.4z M1176.9,1796.4L1176.9,1796.4l-2.5-3.7L1176.9,1796.4z M1176.9,1796.4L1176.9,1796.4l1.3,4.3L1176.9,1796.4z"/>
    <path fill="#000000" d="M1287.3,200.8c-2-1.4-4.3-2.5-6.7-3.2c-2.4-0.7-5-1.1-7.6-1.1c-3.5,0-6.9,0.7-9.9,2
        c-4.6,1.9-8.5,5.2-11.2,9.2c-1.4,2-2.5,4.3-3.2,6.7c-0.7,2.4-1.1,5-1.1,7.6c0,3.5,0.7,6.9,2,9.9c1.9,4.6,5.2,8.5,9.2,11.2
        c2,1.4,4.3,2.5,6.7,3.2c2.4,0.7,5,1.1,7.6,1.1c3.5,0,6.9-0.7,9.9-2c4.6-1.9,8.5-5.2,11.2-9.2c1.4-2,2.5-4.3,3.2-6.7
        c0.7-2.4,1.1-5,1.1-7.6c0-3.5-0.7-6.9-2-9.9C1294.5,207.4,1291.3,203.6,1287.3,200.8z M1273,221.9L1273,221.9l1.8-4.1L1273,221.9z
         M1273,222L1273,222l-4.3,1.3L1273,222z M1273,222L1273,222l-1.8,4.1L1273,222z M1273,222L1273,222l1.3,4.3L1273,222z M1273,222
        L1273,222l4.1,1.8L1273,222z"/>
    <path fill="#000000" d="M1590.1,770.2c-2-1.4-4.3-2.5-6.7-3.2c-2.4-0.7-5-1.1-7.6-1.1c-3.5,0-6.9,0.7-9.9,2
        c-4.6,1.9-8.5,5.2-11.2,9.2c-1.4,2-2.5,4.3-3.2,6.7c-0.7,2.4-1.1,5-1.1,7.6c0,3.5,0.7,6.9,2,9.9c1.9,4.6,5.2,8.5,9.2,11.2
        c2,1.4,4.3,2.5,6.7,3.2c2.4,0.7,5,1.1,7.6,1.1c3.5,0,6.9-0.7,9.9-2c4.6-1.9,8.5-5.2,11.2-9.2c1.4-2,2.5-4.3,3.2-6.7
        c0.7-2.4,1.1-5,1.1-7.6c0-3.5-0.7-6.9-2-9.9C1597.4,776.8,1594.2,772.9,1590.1,770.2z M1575.9,791.3L1575.9,791.3l4.3-1.3
        L1575.9,791.3z M1575.9,791.3L1575.9,791.3l-2.5-3.7L1575.9,791.3z M1575.9,791.3L1575.9,791.3l-1.8,4.1L1575.9,791.3z
         M1575.9,791.3l2.5,3.7L1575.9,791.3l4.1,1.8L1575.9,791.3z"/>
    <path fill="#000000" d="M1111.2,994.5l-86.4-5.9c-5.3-0.4-10.5,2.2-13.5,6.6c-3,4.4-3.4,10.2-1,15l38.1,77.8
        c2.4,4.8,7.1,8,12.4,8.4s10.5-2.2,13.5-6.6l48.3-71.9c3-4.4,3.4-10.2,1-15S1116.6,994.9,1111.2,994.5z M1064,1051.4l-15.2-31.1
        l34.6,2.4L1064,1051.4z"/>
    <path fill="#000000" d="M244.5,827.9c5.1,1.7,10.7,0.6,14.7-3c4-3.5,5.8-9,4.8-14.2l-17.1-84.9c-1.1-5.3-4.8-9.5-9.9-11.3
        s-10.7-0.6-14.7,3l-65,57.2c-4,3.5-5.8,9-4.8,14.2s4.8,9.5,9.9,11.3L244.5,827.9z M222.6,757.2l6.8,34l-32.8-11.1L222.6,757.2z"/>
    <path fill="#000000" d="M256.2,1491.8l-77.8-38.1c-4.8-2.4-10.5-2-15,1s-7,8.1-6.6,13.5l5.9,86.4c0.4,5.3,3.5,10.1,8.4,12.5
        c4.8,2.4,10.5,2,15-1l71.9-48.3c4.4-3,7-8.1,6.6-13.5C264.2,1498.9,261,1494.1,256.2,1491.8z M190.9,1526.6l-2.3-34.6l31.1,15.3
        L190.9,1526.6z"/>
    <path fill="#000000" d="M939.8,189.8l-66.4-55.6c-4.1-3.4-9.7-4.4-14.8-2.6c-5,1.8-8.7,6.2-9.6,11.5l-15,85.3
        c-0.9,5.3,1,10.6,5.1,14.1c4.1,3.4,9.7,4.4,14.8,2.6l81.3-29.7c5-1.8,8.7-6.2,9.6-11.5S943.9,193.2,939.8,189.8z M868.1,208l6-34.1
        l26.6,22.2L868.1,208z"/>
    <path fill="#000000" d="M1752,1163.4l-38.5,77.6c-2.4,4.8-2,10.5,0.9,15c3,4.5,8.1,7,13.4,6.7l86.4-5.4c5.3-0.3,10.1-3.5,12.5-8.3
        c2.4-4.8,2-10.5-0.9-15l-47.9-72.2c-3-4.5-8.1-7-13.4-6.7C1759.1,1155.5,1754.3,1158.6,1752,1163.4z M1751.8,1231.1l15.4-31
        l19.2,28.9L1751.8,1231.1z"/>
</g>
</svg>`;

    public static getURL(color = "#000000") {
        const blob = new Blob([
            this.svg.replaceAll("#000000", color)
        ], {
            type: "image/svg+xml"
        });

        const url = URL.createObjectURL(blob);

        return {
            url,
            revoke: () => URL.revokeObjectURL(url)
        };
    }
}

function Wave({canvasRef, isVisible}: {canvasRef: React.RefObject<HTMLCanvasElement | null>; isVisible: boolean;}) {
    const accessibility = React.use(AccessibilityContext);

    const ref = React.useRef<HTMLCanvasElement>(null);

    const isVisibleRef = React.useRef(isVisible);
    const reducedMotion = React.useRef(accessibility.reducedMotion.enabled);

    isVisibleRef.current = isVisible;
    reducedMotion.current = accessibility.reducedMotion.enabled;

    React.useLayoutEffect(() => {
        if (!ref.current) return;

        const canvas = ref.current;
        const ctx = canvas.getContext("2d")!;
        const home = canvas.parentElement!;

        let then = performance.now();
        let id: number;

        const waves = Array.from({length: 3}, (_, index) => {
            const height = 20 + Math.random() * 30;

            return {
                waveHeight: height,
                waveY: height / 2,
                wavelength: 300 + Math.random() * 450,
                speed: 20 + Math.random() * 50,
                phaseOffset: index * 80 + Math.random() * 450,
                alpha: 0.5 / (index + 1),
                counter: 0,
                direction: Math.random() < 0.5 ? 1 : -1,

                imgSpeed: 20 + Math.random() * 25,
                imgDirection: Math.random() < 0.5 ? 1 : -1,
                imgCounter: 0,
                imgScale: 1 / (index / 1.5),
                imgYOffset: (Math.random() * 100) - 50
            };
        });

        const style = getComputedStyle(canvas);

        const {url, revoke} = FloatingStore.getURL(style.getPropertyValue("--bd-wave-pattern") || "#FFFFFF");

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        let imgLoaded = false;
        let bitMap: ImageBitmap;
        img.onload = async () => {
            bitMap = await window.createImageBitmap(img, {
                resizeHeight: 2000,
                resizeWidth: 2000
            });
            imgLoaded = true;
        };

        function frame() {
            id = requestAnimationFrame(frame);
            const now = performance.now();
            const delta = (now - then) / 1000;
            then = now;

            if (!isVisibleRef.current) {
                for (const wave of waves) {
                    wave.counter = (wave.counter + wave.speed * wave.direction * delta) % wave.wavelength;
                }

                return;
            }

            const dpr = window.devicePixelRatio || 1;

            const width = home.clientWidth;
            const height = home.clientHeight;

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.resetTransform?.();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const fillStyle: CanvasFillStrokeStyles["fillStyle"] = style.getPropertyValue("--bd-brand") || "#3E82E5";
            // const background = style.getPropertyValue("--bd-wave-background");
            // if (background) {
            //     const grad = ctx.createLinearGradient(
            //         0,
            //         0,
            //         canvas.width,
            //         0
            //     );

            //     const c = background.split(",").join(" ").split(" ").filter(m => m);

            //     for (let index = 0; index < c.length; index++) {
            //         grad.addColorStop(index / c.length, c[index]);
            //     }

            //     fillStyle = grad;
            // }
            // else {
            //     fillStyle = style.getPropertyValue("--bd-brand") || "#3E82E5";
            // }

            ctx.clearRect(0, 0, width, height);

            if (reducedMotion.current) {

                for (const wave of waves) {
                    wave.counter = (wave.counter + wave.speed * wave.direction * delta) % wave.wavelength;

                    ctx.fillStyle = fillStyle;
                    ctx.globalAlpha = wave.alpha;

                    ctx.fillRect(0, 0, width, height);
                }

                return;
            }

            const baseWaveY = height - 50;

            const padding = 2;

            for (const wave of waves) {
                wave.counter = (wave.counter + wave.speed * wave.direction * delta) % wave.wavelength;
                if (imgLoaded) {
                    wave.imgCounter = (wave.imgCounter + wave.imgSpeed * wave.imgDirection * delta) % (bitMap.width * wave.imgScale);
                }

                const waveY = baseWaveY + wave.waveY;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = wave.alpha;
                ctx.fillStyle = fillStyle;

                ctx.moveTo(0, 0);
                ctx.lineTo(0, waveY);

                for (
                    let x = -wave.wavelength * padding - wave.counter;
                    x <= canvas.width + wave.wavelength * padding;
                    x += wave.wavelength
                ) {
                    const px = x - wave.phaseOffset;

                    ctx.quadraticCurveTo(
                        px + wave.wavelength / 4,
                        waveY - wave.waveHeight,
                        px + wave.wavelength / 2,
                        waveY,
                    );
                    ctx.quadraticCurveTo(
                        px + wave.wavelength * 0.75,
                        waveY + wave.waveHeight,
                        px + wave.wavelength,
                        waveY,
                    );
                }

                ctx.lineTo(width, waveY);
                ctx.lineTo(width, 0);
                ctx.closePath();
                ctx.fill();

                ctx.clip();

                if (imgLoaded) {
                    const accHeight = Math.min(height, bitMap.height) * wave.imgScale;

                    const scale = accHeight / Math.max(height, bitMap.height);
                    const accWidth = bitMap.width * scale;


                    const m = Math.ceil(width / accWidth) + 1;

                    for (let index = 0; index < m; index++) {
                        ctx.drawImage(
                            bitMap,
                            wave.imgCounter + ((accWidth * -wave.direction) * index),
                            wave.imgYOffset,
                            accWidth, accHeight
                        );
                    }
                    for (let index = 0; index < m; index++) {
                        ctx.drawImage(
                            bitMap,
                            wave.imgCounter + ((accWidth * wave.direction) * index),
                            wave.imgYOffset,
                            accWidth, accHeight
                        );
                    }
                }

                ctx.restore();
            }

            // Large texture across (slow?)
            // ctx.save();
            // ctx.beginPath();

            // for (const wave of waves) {
            //     const waveY = baseWaveY + wave.waveY;

            //     ctx.moveTo(0, 0);
            //     ctx.lineTo(0, waveY);

            //     for (
            //         let x = -wave.wavelength * padding - wave.counter;
            //         x <= canvas.width + wave.wavelength * padding;
            //         x += wave.wavelength
            //     ) {
            //         const px = x - wave.phaseOffset;

            //         ctx.quadraticCurveTo(
            //             px + wave.wavelength / 4,
            //             waveY - wave.waveHeight,
            //             px + wave.wavelength / 2,
            //             waveY,
            //         );
            //         ctx.quadraticCurveTo(
            //             px + wave.wavelength * 0.75,
            //             waveY + wave.waveHeight,
            //             px + wave.wavelength,
            //             waveY,
            //         );
            //     }

            //     ctx.lineTo(width, waveY);
            //     ctx.lineTo(width, 0);
            // }

            // ctx.clip();

            // if (imgLoaded) {
            //     ctx.globalAlpha = 0.125;
            //     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // }

            // ctx.restore();
        }

        frame();

        return () => {
            cancelAnimationFrame(id);
            revoke();

            bitMap?.close();
        };
    }, []);

    return (
        <canvas
            className="bd-wave"
            ref={(v) => {
                canvasRef.current = v;
                ref.current = v;
            }}
        />
    );
}

function RedirectCard({icon, title, description, to, button}: {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    title: string,
    description: string,
    to: string,
    button?: string;
}) {
    return (
        <div className="bd-home-redirect">
            <div className="bd-home-redirect-icon">
                {React.createElement(icon, {width: 32, height: 32})}
            </div>

            <div className="bd-home-redirect-content">
                <div className="bd-home-redirect-title">
                    {title}
                </div>
                <div className="bd-home-redirect-description">
                    {description}
                </div>

                <Button onClick={() => routemanager.transitionTo(to)}>
                    {button || "Visit"}
                </Button>
            </div>
        </div>
    );
}

function HomePage() {
    const user = useInternalStore(Stores.UserStore, () => Stores.UserStore.getCurrentUser());
    const greeting = React.useMemo(() => ["Hello", "Salutations", "Welcome"][Math.floor(Math.random() * 3)], []);

    const pageRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const homeRef = React.useRef<HTMLDivElement>(null);
    const [headerVisible, setHeaderVisible] = React.useState(true);

    const onScroll = React.useCallback<React.UIEventHandler<HTMLDivElement>>((event) => {
        homeRef.current!.style.translate = `0 -${event.currentTarget.scrollTop}px`;
    }, []);

    React.useLayoutEffect(() => {
        if (!canvasRef.current) return;

        new IntersectionObserver((entries) => setHeaderVisible(entries[0].isIntersecting), {
            // Sucks for theme devs this has to be hard coded
            // As this is the size of the waves
            rootMargin: "-50px",
            root: pageRef.current!
        }).observe(canvasRef.current);
    }, []);

    return (
        <BasePage ref={pageRef}>
            <HeaderBar
                transparent={headerVisible}
                toolbar={
                    <>
                        <HeaderBar.Icon
                            icon={Bird}
                            tooltip="Bird"
                            onClick={() => {}}
                            badgePosition="bottom"
                            showBadge
                        />
                        <HeaderBar.Icon
                            icon={Rabbit}
                            tooltip="Rabbit"
                            onClick={() => {}}
                            badgePosition="top"
                            showBadge
                        />
                        <HeaderBar.Icon
                            icon={Squirrel}
                            tooltip="Squirrel"
                            onClick={() => {}}
                            badgePosition="bottom"
                            showBadge
                        />
                    </>
                }
            >
                {!headerVisible && (
                    <>
                        <HeaderBar.Icon icon={Logo} />
                        <HeaderBar.Title>BetterDiscord</HeaderBar.Title>
                    </>
                )}
            </HeaderBar>
            <div className="bd-home" ref={homeRef}>
                <Wave canvasRef={canvasRef} isVisible={headerVisible} />
                <div className="bd-home-content">
                    <div className="bd-home-logo">
                        <div className="bd-home-logo-background" />
                        <Logo color="currentColor" width={64} height={64} />
                    </div>
                    {user && (
                        <div className="bd-home-greeting">
                            {greeting}
                            {", "}
                            {user.globalName || user.username}
                        </div>
                    )}
                </div>
            </div>
            <div className="bd-content" onScroll={onScroll}>
                <div className="bd-home-redirects">
                    <RedirectCard
                        title="Bird"
                        icon={Bird}
                        description="A tab about Bird's and Bird's alone"
                        to="/plugins"
                    />
                    <RedirectCard
                        title="Rabbit"
                        icon={Rabbit}
                        description="A tab about Rabbit's and Rabbit's alone"
                        to="/plugins"
                    />
                    <RedirectCard
                        title="Squirrel"
                        icon={Squirrel}
                        description="A tab about Squirrel's and Squirrel's alone"
                        to="/plugins"
                    />
                </div>

                {Array.from({length: 100}, () =>
                    <div style={{color: "red"}}>123</div>
                )}
            </div>
        </BasePage>
    );
}

export default HomePage;
