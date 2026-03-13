/**
 * BlueprintScreen — Step 2
 * Displays the AI-extracted design blueprint and lets the user
 * advance to the 3D configurator.
 *
 * Props:
 *  - blueprint: { metal, centerStone, setting }
 *  - uploadedImage: object-URL string of the original photo
 *  - onBack(): go back to UploadScreen
 *  - onGenerate3D(): advance to ConfiguratorScreen
 */
export default function BlueprintScreen({
  blueprint,
  uploadedImage,
  onBack,
  onGenerate3D,
}) {
  const fields = blueprint
    ? [
        { label: "Primary Metal", value: blueprint.metal },
        { label: "Center Stone", value: blueprint.centerStone },
        { label: "Setting Type", value: blueprint.setting },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 fade-in">
      <h2 className="font-heading text-3xl md:text-4xl text-sand mb-2 tracking-widest">
        Design <span className="text-gold">Blueprint</span>
      </h2>
      <p className="text-sand/50 text-sm mb-10 tracking-wider uppercase">
        AI-extracted design details
      </p>

      <div className="glass p-8 w-full max-w-xl flex flex-col gap-6">
        {/* Optional: thumbnail of uploaded photo */}
        {uploadedImage && (
          <div className="flex justify-center">
            <img
              src={uploadedImage}
              alt="Uploaded jewelry"
              className="h-32 w-auto rounded-xl object-contain border border-white/10"
            />
          </div>
        )}

        {/* Extracted stats */}
        <div className="grid grid-cols-1 gap-3">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-5 py-3"
            >
              <span className="text-sand/60 text-sm font-body">{label}</span>
              <span className="text-sand font-semibold text-sm">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button className="button-ghost flex-1" onClick={onBack}>
            ← Back
          </button>
          <button className="button-gold flex-[2]" onClick={onGenerate3D}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5 12 2.25 3 7.5m18 0-9 5.25M3 7.5l9 5.25m0 0V21" />
            </svg>
            Generate 3D Model
          </button>
        </div>
      </div>
    </div>
  );
}
