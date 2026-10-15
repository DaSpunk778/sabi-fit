"use client"

type StepperProps = {
    value: number;
    onChange: (value: number) => void;
    label: string;
    min?: number;
    max?: number;
};

export function Stepper({
    value,
    onChange,
    label,
    min = 1,
    max = 50,
}: StepperProps) {
    const button =
        "size-9 flex-none rounded-[10px] border border-line-strong bg-raised text-lg font-extrabold text-ink transition-colors hover:bg-line enabled:active:bg-line disabled:opacity-35";

        return (
            <div className="flex flex-none items-center gap-0.5">
                <button
                    type="button"
                    onClick={() => onChange(value - 1)}
                    disabled={value <= min }
                    aria-label={`Fewer sets for ${label}`}
                    className={button}
                >
                   − 
                </button>

                <b className="min-w-7.5 text-center text-[17px]">{value}</b>

                <button 
                    type="button"
                    onClick={() => onChange(value + 1)}
                    disabled={value >= max}
                    aria-label={`More sets for ${label}`}
                    className={button}
                >
                    +
                </button>
            </div>
        );
}