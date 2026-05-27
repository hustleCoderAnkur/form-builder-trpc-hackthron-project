type DecorativeProps = {
    className?: string;
    delay?: number;
};

export function MandanaPattern({
    className,
}: DecorativeProps) {
    return (
        <div
            className={`absolute inset-0 opacity-10 pointer-events-none ${className ?? ""}`}
        >
            <div className="w-full h-full bg-[radial-linear(circle,rgba(251,191,36,0.15)_1px,transparent_1px)]bg-size-[24px_24px]" />
        </div>
    );
}

export function OrnamentDivider({
    className,
}: DecorativeProps) {
    return (
        <div
            className={`flex items-center justify-center gap-3 py-6 ${className ?? ""}`}
        >
            <div className="h-px w-20 bg-linear-to-r from-transparent to-amber-500" />

            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rotate-45 border border-amber-500" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>

            <div className="h-px w-20 bg-linear-to-l from-transparent to-amber-500" />
        </div>
    );
}

export function FloatingMotif({
    className,
    delay = 0,
}: DecorativeProps) {
    return (
        <div
            className={`absolute w-52 h-52 rounded-full blur-3xl opacity-20 bg-linear-to-br from-amber-400 to-orange-700 animate-pulse ${className ?? ""}`}
            style={{
                animationDelay: `${delay}s`,
                animationDuration: "6s",
            }}
        />
    );
}

export function PalaceGeometry({
    className,
}: DecorativeProps) {
    return (
        <div
            className={`absolute border border-amber-500/20 rounded-4xl backdrop-blur-sm ${className ?? ""}`}
        />
    );
}