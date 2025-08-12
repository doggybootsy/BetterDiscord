import React from "react";

import {BasePage} from "./Page";
import {useInternalStore} from "@ui/hooks";
import {getModule, Stores} from "@webpack";
import HeaderBar from "./Header";
import {Bird, Rabbit, Squirrel} from "lucide-react";

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
            };
        });

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

            const color = getComputedStyle(canvas).getPropertyValue("--bd-brand") || "#3E82E5";

            if (reducedMotion.current) {
                ctx.clearRect(0, 0, width, height);

                for (const wave of waves) {
                    wave.counter = (wave.counter + wave.speed * wave.direction * delta) % wave.wavelength;

                    ctx.fillStyle = color;
                    ctx.globalAlpha = wave.alpha;

                    ctx.fillRect(0, 0, width, height);
                }

                return;
            }

            const baseWaveY = height - 50;

            const padding = 2;

            for (const wave of waves) {
                wave.counter = (wave.counter + wave.speed * wave.direction * delta) % wave.wavelength;
                const waveY = baseWaveY + wave.waveY;

                ctx.beginPath();
                ctx.globalAlpha = wave.alpha;
                ctx.fillStyle = color;

                ctx.moveTo(0, 0);
                ctx.lineTo(0, waveY);

                for (
                    let x = -wave.wavelength * padding - wave.counter;
                    x <= canvas.width + wave.wavelength * (padding + 1); // increased range here
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
            }
        }

        frame();

        return () => cancelAnimationFrame(id);
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
                            badgePosition="bottom"
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
                <div className="bd-home-sep" />

                {Array.from({length: 100}, () =>
                    <div style={{color: "red"}}>123</div>
                )}
            </div>
        </BasePage>
    );
}

export default HomePage;
