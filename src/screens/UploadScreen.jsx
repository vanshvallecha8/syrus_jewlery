import { useState, useCallback, useEffect } from "react";

/**
 * UploadScreen — Step 1
 * A centred glass panel over the cinematic 3D background.
 * Provides drag-and-drop + file-picker for the jewelry photo.
 * Calls `onAnalyze(file)` when the user submits.
 */
export default function UploadScreen({ onAnalyze }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Revoke the previous object URL whenever it changes or on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const accept = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) accept(f);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) accept(f);
  };

  const handleAnalyze = () => {
    if (file) onAnalyze(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 fade-in">
      {/* Wordmark */}
      <h1 className="font-heading text-4xl md:text-5xl text-sand mb-2 tracking-widest">
        JewelForge <span className="text-gold">AI</span>
      </h1>
      <p className="text-sand/50 font-body text-sm mb-10 tracking-wider uppercase">
        2D → 3D Jewelry Configurator
      </p>

      {/* Glass card */}
      <div className="glass p-8 w-full max-w-md flex flex-col gap-6">
        <p className="panel-title text-center">Upload Your Jewelry Photo</p>

        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Drop zone for jewelry image"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => document.getElementById("file-input").click()}
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("file-input").click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors duration-200 cursor-pointer min-h-[180px] overflow-hidden
            ${dragging ? "border-gold bg-gold/10" : "border-white/20 hover:border-gold/60 hover:bg-white/5"}`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="object-contain max-h-[200px] w-full rounded-xl"
            />
          ) : (
            <>
              {/* Upload icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 20h16" />
              </svg>
              <span className="text-sand/60 text-sm text-center px-4">
                Drag &amp; drop a photo here, or{" "}
                <span className="text-gold underline">browse</span>
              </span>
              <span className="text-sand/30 text-xs">PNG, JPG, WEBP — up to 10 MB</span>
            </>
          )}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
        </div>

        {/* Analyze button */}
        <button
          className="button-gold w-full disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!file}
          onClick={handleAnalyze}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75H5.25A1.5 1.5 0 0 0 3.75 5.25v13.5A1.5 1.5 0 0 0 5.25 20.25h13.5a1.5 1.5 0 0 0 1.5-1.5v-4.5M20.25 3.75l-9 9M14.25 3.75h6v6" />
          </svg>
          Analyze Design
        </button>
      </div>
    </div>
  );
}
