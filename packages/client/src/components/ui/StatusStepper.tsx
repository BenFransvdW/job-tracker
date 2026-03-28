import type { ApplicationStatus } from '@job-tracker/shared';
import { STATUS_LABELS } from '@job-tracker/shared';

interface StatusStepperProps {
    current: ApplicationStatus;
    onChange?: (status: ApplicationStatus) => void;
}

const STEPS: ApplicationStatus[] = ['wishlist', 'applied', 'interviewing', 'offer'];

export function StatusStepper({ current, onChange }: StatusStepperProps) {
    const currentIdx = STEPS.indexOf(current);
    return (
        <div className="flex items-center gap-0">
            {STEPS.map((step, i) => (
                <div key={step} className="flex items-center">
                    <button
                        type="button"
                        onClick={() => onChange?.(step)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors ${
                            step === current ? 'text-blue-600 font-semibold' :
                            i <= currentIdx ? 'text-gray-700 hover:text-blue-600' :
                            'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs ${
                            i < currentIdx ? 'bg-blue-600 border-blue-600 text-white' :
                            step === current ? 'border-blue-600 text-blue-600' :
                            'border-gray-300 text-gray-400'
                        }`}>{i + 1}</span>
                        <span className="text-xs whitespace-nowrap">{STATUS_LABELS[step]}</span>
                    </button>
                    {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < currentIdx ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
            ))}
        </div>
    );
}
