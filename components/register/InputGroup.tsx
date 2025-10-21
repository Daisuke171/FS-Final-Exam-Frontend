import React, { useState } from 'react';

interface InputGroupProps {
    icon: React.ElementType; 
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export default function InputGroup({ icon: Icon, type, name, value, onChange, placeholder }: InputGroupProps) {
    
    const [isFocused, setIsFocused] = useState(false); 

    
    const baseClasses = "relative flex items-center bg-gray-700/50 rounded-xl p-2 shadow-inner transition-all duration-200";
    
    const focusClasses = isFocused 
        ? "border border-cyan-400 ring-1 ring-cyan-400/50" 
        : "border border-indigo-500/40"; 

    return (
        <div 
            className={`${baseClasses} ${focusClasses}`}
        >
            <Icon size={16} className="text-indigo-400 mr-2" /> 
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent text-white placeholder-gray-400 text-xs focus:outline-none"
                
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </div>
    );
}