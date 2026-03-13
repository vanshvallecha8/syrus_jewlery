import { useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import UploadScreen from "./screens/UploadScreen";
import BlueprintScreen from "./screens/BlueprintScreen";
import ConfiguratorScreen from "./screens/ConfiguratorScreen";

const SCREENS = {
  upload: "upload",
  blueprint: "blueprint",
  configurator: "configurator",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.upload);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    metal: "18k_gold",
    stone: "diamond_round",
    cut: "round",
  });

  // Revoke the uploaded image object URL when it changes or on unmount
  useEffect(() => {
    return () => {
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    };
  }, [uploadedImage]);

  // Derived budget estimate; replace with backend price estimator when ready
  const estimatedBudget = useMemo(() => {
    const metalBase = selectedOptions.metal.includes("platinum") ? 3200 : 2400;
    const stoneMult = selectedOptions.stone.includes("lab") ? 0.7 : 1.0;
    return Math.round(metalBase * stoneMult);
  }, [selectedOptions]);

  /** Step 1 → 2: upload file, stub out backend call, advance to blueprint */
  const handleAnalyze = (file) => {
    setUploadedImage(URL.createObjectURL(file));
    // TODO: replace with real Claude Vision API call
    setBlueprint({
      metal: "18k Yellow Gold",
      centerStone: "1.5ct Round Brilliant Diamond",
      setting: "Cathedral Pavé",
    });
    setScreen(SCREENS.blueprint);
  };

  /** Step 2 → 3: stub backend 3D generation, advance to configurator */
  const handleGenerate3D = async () => {
    // TODO: call backend to generate GLB and store the URL
    setModelUrl("/placeholder-ring.glb");
    setScreen(SCREENS.configurator);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b14] to-[#05050a] text-sand relative overflow-hidden">
      {/* Ambient gold / light vignette overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,151,58,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(201,151,58,0.06),transparent_30%)] blur-sm"
      />

      {/* Full-screen 3D canvas — lives behind all UI */}
      <div className="absolute inset-0 -z-10">
        <Canvas shadows camera={{ position: [0, 1.2, 3.2], fov: 40 }}>
          {/* Placeholder torus knot until a real GLB is loaded */}
          <mesh castShadow receiveShadow rotation={[0.4, 0.6, 0]}>
            <torusKnotGeometry args={[0.55, 0.18, 256, 64]} />
            <meshStandardMaterial
              color="#C9973A"
              metalness={0.9}
              roughness={0.18}
              envMapIntensity={1}
            />
          </mesh>
          <Environment preset="studio" />
          <ContactShadows
            opacity={0.35}
            scale={8}
            blur={2.4}
            far={4}
            position={[0, -0.6, 0]}
          />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(2 * Math.PI) / 3}
          />
        </Canvas>
      </div>

      {/* Screen router */}
      {screen === SCREENS.upload && (
        <UploadScreen onAnalyze={handleAnalyze} />
      )}

      {screen === SCREENS.blueprint && (
        <BlueprintScreen
          blueprint={blueprint}
          uploadedImage={uploadedImage}
          onBack={() => setScreen(SCREENS.upload)}
          onGenerate3D={handleGenerate3D}
        />
      )}

      {screen === SCREENS.configurator && (
        <ConfiguratorScreen
          modelUrl={modelUrl}
          selectedOptions={selectedOptions}
          onChangeOptions={setSelectedOptions}
          estimatedBudget={estimatedBudget}
          onRestart={() => setScreen(SCREENS.upload)}
        />
      )}
    </div>
  );
}
