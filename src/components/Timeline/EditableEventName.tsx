import React, { useState, useRef, useEffect } from 'react';

interface EditableEventNameProps {
    name: string;
    onUpdate?: (newName: string) => void;
}

export const EditableEventName: React.FC<EditableEventNameProps> = ({ name, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== name && onUpdate) {
            onUpdate(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setValue(name);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none text-xs focus:outline-none focus:ring-1 focus:ring-primary-focus px-1"
            />
        );
    }

    return (
        <span onDoubleClick={handleDoubleClick} className="block truncate cursor-text">
      {name}
    </span>
    );
};