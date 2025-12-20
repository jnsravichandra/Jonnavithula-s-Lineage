import { useState, useEffect, useRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';

interface ImageUploaderProps {
  onChange: (file: File) => void;
  initialImage?: string | null;
}

export const ImageUploader = ({ onChange, initialImage }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with prop changes (e.g. when opening edit modal for a different user)
  useEffect(() => {
    setPreviewUrl(initialImage || null);
  }, [initialImage]);

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Pass the actual File object back to the parent
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-text-secondary/50 hover:border-accent-primary cursor-pointer bg-background-secondary flex items-center justify-center group transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <PhotoIcon className="h-12 w-12 text-text-secondary/50 group-hover:text-accent-primary transition-colors" />
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center transition-opacity">
            <span className="text-white text-xs font-bold tracking-wide">CHANGE</span>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-sm text-accent-primary font-semibold hover:text-accent-secondary transition-colors"
      >
        {previewUrl ? 'Change Photo' : 'Upload Photo'}
      </button>
    </div>
  );
};

export default ImageUploader;