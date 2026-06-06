'use client';

import React, { useState, useRef, useCallback } from 'react';
import { User, Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onChange: (file: File | null) => void;
  currentImage?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  currentImage = null,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular preview / drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative w-[120px] h-[120px] rounded-full cursor-pointer
          border-2 overflow-hidden
          transition-all duration-200
          flex items-center justify-center
          ${isDragOver
            ? 'border-accent border-dashed scale-105 bg-accent/10'
            : preview
            ? 'border-border hover:border-accent'
            : 'border-dashed border-border hover:border-accent bg-muted/50 hover:bg-accent/5'
          }
        `}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <User className="w-10 h-10" />
          </div>
        )}

        {/* Hover overlay */}
        {preview && (
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg
            text-xs font-semibold
            bg-primary text-primary-foreground
            hover:bg-primary/90
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/40
          "
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Photo
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-semibold
              border border-border bg-transparent text-foreground
              hover:bg-red-50 hover:border-red-300 hover:text-red-600
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-red-300/40
            "
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Click or drag & drop to upload
      </p>
    </div>
  );
};

export default ImageUploader;
