import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
}

export function TagInput({ value, onChange, suggestions = [], placeholder = 'Add tag...' }: TagInputProps) {
    const [input, setInput] = useState('');

    function addTag(tag: string) {
        const trimmed = tag.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInput('');
    }

    function removeTag(tag: string) {
        onChange(value.filter(t => t !== tag));
    }

    function handleKey(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    }

    const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s));

    return (
        <div className="border rounded-md p-2 flex flex-wrap gap-1 min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
            {value.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`} className="hover:text-blue-600">&times;</button>
                </span>
            ))}
            <div className="relative flex-1">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    onBlur={() => addTag(input)}
                    placeholder={value.length === 0 ? placeholder : ''}
                    className="w-full min-w-[120px] outline-none text-sm"
                />
                {input && filtered.length > 0 && (
                    <ul className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 w-full max-h-32 overflow-y-auto">
                        {filtered.slice(0, 6).map(s => (
                            <li key={s} className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => addTag(s)}>{s}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
