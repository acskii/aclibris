import { useState } from "react";
import { Plus } from "lucide-react";
import React from "react";

type FileDropAreaProps = {
    onFileSelect: (file: File) => void;
}

export default function FileDropArea({ onFileSelect }: FileDropAreaProps) {
    const [drag, setDrag] = useState<boolean>(false); 
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);

        const file = e.dataTransfer.files[0];
        if (file && onFileSelect != null) {
            onFileSelect(file);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && onFileSelect != null) {
            onFileSelect(file);
        }
    };

    return (
        <div>
            <input
                id="hiddenFileInput"
                type="file"
                onChange={handleFileInput}    
                accept=".pdf"           
                className="hidden"
            />
            <div
                className={`w-96 h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors duration-300 ${
                drag ? 'bg-gray-50 border-blue-500' : 'bg-gray-50 border-gray-400'
                } hover:bg-gray-100 hover:border-solid cursor-pointer`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("hiddenFileInput") ? document.getElementById("hiddenFileInput")?.click() : null}
            >
                <Plus className="text-4xl text-gray-600 mb-2" />
                <p className="text-gray-400 text-center px-4">
                    Drag file here, or click to upload
                </p>
                <p className="text-gray-400 text-center px-4">
                    Accepts PDFs only
                </p>
            </div>
        </div>
    );
}