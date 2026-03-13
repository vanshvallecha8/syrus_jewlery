import { useState, useCallback } from "react";

/**
 * Dropzone — drag-and-drop + click-to-browse image picker.
 *
 * Props:
 *  - onFile(file: File): called when a valid image is selected
 *  - preview: object-URL string (optional, controlled from outside)
 */
export default function Dropzone({ onFile, preview }) {
  const [dragging, setDragging] = useState(false);

  const accept = useCallback(
    (f) => {
      if (f && f.type.startsWith("image/")) onFile(f);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      accept(e.dataTransfer.files?.[0]);
    },
    [accept]
  );

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const inputId = "dropzone-input";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Image drop zone"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => document.getElementById(inputId).click()}
      onKeyDown={(e) => e.key === "Enter" && document.getElementById(inputId).click()}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors duration-200 cursor-pointer min-h-[160px] overflow-hidden
        ${dragging ? "border-gold bg-gold/10" : "border-white/20 hover:border-gold/60 hover:bg-white/5"}`}
    >
      {preview ? (
        <img
          src={preview}
          alt="Selected"
          className="object-contain max-h-[180px] w-full rounded-xl"
        />
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 20h16" />
          </svg>
          <span className="text-sand/60 text-sm text-center px-4">
            Drag &amp; drop or <span className="text-gold underline">browse</span>
          </span>
          <span className="text-sand/30 text-xs">PNG · JPG · WEBP — max 10 MB</span>
        </>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0])}
      />
    </div>
  );
}
