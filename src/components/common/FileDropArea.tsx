import { useState } from "react";
import { CheckCircle, FileText, Plus, Trash2 } from "lucide-react";
import React from "react";

type FileDropAreaProps = {
    onFileSelect: (file: File | null) => void;
    className?: string;
}

export default function FileDropArea({ onFileSelect,className }: FileDropAreaProps) {
    const [drag, setDrag] = useState<boolean>(false); 
    const [upload, setUpload] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string | null>(null);
    
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
        if (file && file.type === "application/pdf" && onFileSelect != null) {
            onFileSelect(file);
            setUpload(true);
            setFileName(file.name);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type === "application/pdf" && onFileSelect != null) {
            onFileSelect(file);
            setUpload(true);
            setFileName(file.name);
        }

        e.target.value = '';
    };

    const handleDelete = () => {
        setUpload(false);
        setFileName(null);
        onFileSelect(null);
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
            {upload ? (
                <div className="border-2 border-green-500/30 bg-green-900/20 rounded-md p-6 text-center transition-all duration-300">
                    <div className="flex flex-row gap-4 items-center justify-center mb-3">
                        <CheckCircle className="w-7 h-7 text-green-400" />
                        <h3 className="text-green-300 font-semibold text-sm">Upload Successful!</h3>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <p className="text-green-200/80 text-sm flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            {fileName}
                        </p>
                        <button
                            onClick={handleDelete}
                            className="text-white hover:text-gray-300 text-sm"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ) : (
            <div
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group ${
                        drag 
                            ? 'bg-indigo-900/30 border-indigo-400' 
                            : 'bg-gray-800/30 border-indigo-500/30 hover:bg-indigo-900/20 hover:border-indigo-400'
                    } ${className}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("hiddenFileInput") ? document.getElementById("hiddenFileInput")?.click() : null}
            >
                <Plus className="text-gray-400" size={20} />
                <p className="text-gray-400 text-center px-4">
                    Drag file here, or click to upload
                </p>
            </div>
            )}
        </div>
    );
}