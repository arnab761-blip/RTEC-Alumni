import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CAMPUS_LANDMARKS } from './CampusData.js';
import { createMaterialPalette, buildLandmarkModel } from './BuildingModels.js';
import { createCampusEnvironment, setupLighting } from './Environment.js';

export default function CampusScene({
  currentStep = 0,
  onStepChange,
  onOpenBuildingDetails,
  timeOfDay = 'day',
  soundEnabled = false,
  activeTargetLandmark = null,
  dragMode = 'move', // 'move' (Google Earth ground drag) | 'rotate' (360° free look)
  onToggleDragMode,
  lang = 'en',
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const reqIdRef = useRef(null);
  const groundMeshRef = useRef(null);

  // References for animated elements
  const leftGatePivotRef = useRef(null);
  const rightGatePivotRef = useRef(null);
  const beaconsRef = useRef([]);
  const riverRef = useRef(null);

  // Click destination ripple indicator on ground (Google Earth style)
  const clickRippleRef = useRef(null);

  // Smooth camera fly-to transition state
  const isTransitioning = useRef(false);
  const transitionStart = useRef(0);
  const transitionDuration = 1200; // ms
  const startCamPos = useRef(new THREE.Vector3());
  const startTargetPos = useRef(new THREE.Vector3());
  const destCamPos = useRef(new THREE.Vector3(10, 4.2, 82));
  const destTargetPos = useRef(new THREE.Vector3(10, 3, 45));

  // Gate open progress (0 = closed, 1 = fully open)
  const gateOpenProgress = useRef(0);
  const targetGateOpen = useRef(0);

  // 2D Screen-projected landmark pin buttons
  const [screenPins, setScreenPins] = useState([]);

  // Fly camera smoothly to a specific landmark
  const flyToLandmark = useCallback((landmark, immediate = false) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    const targetPos = new THREE.Vector3(landmark.coords.x, 2.5, landmark.coords.z);
    const camPos = new THREE.Vector3(landmark.cameraPos.x, landmark.cameraPos.y, landmark.cameraPos.z);

    if (landmark.id === 'main-gate') {
      targetGateOpen.current = 0;
    } else {
      targetGateOpen.current = 1;
    }

    if (immediate) {
      cam.position.copy(camPos);
      ctrl.target.copy(targetPos);
      ctrl.update();
      isTransitioning.current = false;
    } else {
      startCamPos.current.copy(cam.position);
      startTargetPos.current.copy(ctrl.target);
      destCamPos.current.copy(camPos);
      destTargetPos.current.copy(targetPos);
      transitionStart.current = performance.now();
      isTransitioning.current = true;
    }
  }, []);

  // When step changes, fly camera smoothly to it
  useEffect(() => {
    const landmark = CAMPUS_LANDMARKS[currentStep] || CAMPUS_LANDMARKS[0];
    flyToLandmark(landmark, false);
  }, [currentStep, flyToLandmark]);

  // Handle activeTargetLandmark explicitly if passed
  useEffect(() => {
    if (activeTargetLandmark) {
      flyToLandmark(activeTargetLandmark, false);
    }
  }, [activeTargetLandmark, flyToLandmark]);

  // Update OrbitControls mouse mapping when dragMode changes
  useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;

    if (dragMode === 'move') {
      // Google Earth mode: Left Click DRAGS ground & roads, Right Click ROTATES 360°
      ctrl.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
      };
      ctrl.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_ROTATE
      };
    } else {
      // 360° Free Look mode: Left Click ROTATES 360°, Right Click DRAGS ground
      ctrl.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      ctrl.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }
    ctrl.update();
  }, [dragMode]);

  // Main Three.js Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    scene.background = new THREE.Color(
      timeOfDay === 'night' ? 0x020617 : timeOfDay === 'sunset' ? 0x1e1b4b : 0x0f172a
    );
    scene.fog = new THREE.FogExp2(
      timeOfDay === 'night' ? 0x020617 : timeOfDay === 'sunset' ? 0x1e1b4b : 0x0f172a,
      0.002
    );

    // 2. Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.5, 950);
    camera.position.set(10, 4.2, 82);
    cameraRef.current = camera;

    // 3. Renderer with High Performance & Capped Pixel Ratio
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls for Google Earth Style Navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.screenSpacePanning = false; // Pan parallel to ground
    controls.minDistance = 2.5;
    controls.maxDistance = 280;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Can't go below ground
    controls.minPolarAngle = 0.04; // Can look directly down (satellite view)
    controls.rotateSpeed = 0.85;
    controls.panSpeed = 1.25; // Responsive ground drag
    controls.enableZoom = false; // We use our custom continuous road wheel mover!
    controls.target.set(10, 3, 45);

    // Initial mouse mapping
    if (dragMode === 'move') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
      };
      controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_ROTATE
      };
    } else {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }

    controlsRef.current = controls;

    // Stop auto-fly on user interaction
    controls.addEventListener('start', () => {
      isTransitioning.current = false;
    });

    // 5. Materials & 3D Building Models
    const materials = createMaterialPalette();
    const beacons = [];

    CAMPUS_LANDMARKS.forEach((landmark) => {
      const model = buildLandmarkModel(landmark, materials);
      scene.add(model);
      if (model.userData.beacon) {
        beacons.push(model.userData.beacon);
      }
      if (landmark.id === 'main-gate') {
        leftGatePivotRef.current = model.userData.leftPivot;
        rightGatePivotRef.current = model.userData.rightPivot;
      }
    });
    beaconsRef.current = beacons;

    // 6. Environment (Ground, Roads, River, Instanced Trees, Sun Lighting)
    const { envGroup, lights, river } = createCampusEnvironment(scene, timeOfDay);
    riverRef.current = river;

    // 7. CONTINUOUS SCROLL FORWARD / BACKWARD (NEVER STOPS!)
    const handleWheel = (e) => {
      e.preventDefault();
      isTransitioning.current = false;

      const moveDistance = e.deltaY < 0 ? 4.5 : -4.5;

      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = Math.max(-0.25, Math.min(0.25, dir.y));
      dir.normalize();

      camera.position.addScaledVector(dir, moveDistance);
      controls.target.addScaledVector(dir, moveDistance);

      if (camera.position.y < 2.2) camera.position.y = 2.2;
      if (controls.target.y < 0.5) controls.target.y = 0.5;

      if (camera.position.z < 78 || controls.target.z < 65) {
        targetGateOpen.current = 1;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    // Touch 2-finger pinch
    let touchDistStart = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        touchDistStart = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchDistStart > 0) {
        e.preventDefault();
        const touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchDist - touchDistStart;
        if (Math.abs(diff) > 5) {
          isTransitioning.current = false;
          const moveDistance = diff * 0.12;

          const dir = new THREE.Vector3();
          camera.getWorldDirection(dir);
          dir.y = 0;
          dir.normalize();

          camera.position.addScaledVector(dir, moveDistance);
          controls.target.addScaledVector(dir, moveDistance);

          if (camera.position.y < 2.2) camera.position.y = 2.2;
          touchDistStart = touchDist;
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    // 8. Animation & Render Loop (Smooth 60 FPS)
    const clock = new THREE.Clock();
    const tempProjVec = new THREE.Vector3();
    let frameCounter = 0;

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth camera fly transition with smoothstep easing
      if (isTransitioning.current) {
        const t = Math.min(1, (performance.now() - transitionStart.current) / transitionDuration);
        const ease = t * t * (3 - 2 * t);

        camera.position.lerpVectors(startCamPos.current, destCamPos.current, ease);
        controls.target.lerpVectors(startTargetPos.current, destTargetPos.current, ease);

        if (t >= 1) {
          isTransitioning.current = false;
        }
      }

      controls.update();

      // Gate opening animation
      if (camera.position.z < 78 || controls.target.z < 65) {
        targetGateOpen.current = 1;
      } else if (camera.position.z > 85 && controls.target.z > 70) {
        targetGateOpen.current = 0;
      }

      gateOpenProgress.current += (targetGateOpen.current - gateOpenProgress.current) * Math.min(delta * 4, 1);
      if (leftGatePivotRef.current && rightGatePivotRef.current) {
        const angle = gateOpenProgress.current * (Math.PI * 0.42);
        leftGatePivotRef.current.rotation.y = -angle;
        rightGatePivotRef.current.rotation.y = angle;
      }

      // Beacon rotation
      beacons.forEach((beacon, i) => {
        beacon.position.y += Math.sin(elapsed * 2.5 + i) * 0.006;
        beacon.rotation.y += delta * 1.5;
      });

      // River surface shimmer
      if (riverRef.current) {
        riverRef.current.position.y = 0.02 + Math.sin(elapsed * 1.5) * 0.02;
      }

      renderer.render(scene, camera);

      // Project at most ONE discreet detail button above the single closest building when near
      frameCounter++;
      if (frameCounter % 2 === 0 && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;

        let closestLm = null;
        let closestDist = Infinity;

        CAMPUS_LANDMARKS.forEach((lm) => {
          const dist = camera.position.distanceTo(new THREE.Vector3(lm.coords.x, 0, lm.coords.z));
          if (dist < closestDist) {
            closestDist = dist;
            closestLm = lm;
          }
        });

        // ONLY show one clean, unobtrusive button high above the roof beacon when close (10 < dist < 45)
        const pins = [];
        if (closestLm && closestDist > 10 && closestDist < 45) {
          tempProjVec.set(closestLm.coords.x, getBuildingPinHeight(closestLm.id) + 3.8, closestLm.coords.z);
          tempProjVec.project(camera);

          // Only if in front of camera
          if (tempProjVec.z < 1) {
            const x = (tempProjVec.x * 0.5 + 0.5) * w;
            const y = (-(tempProjVec.y * 0.5) + 0.5) * h;

            if (x > 50 && x < w - 50 && y > 30 && y < h - 40) {
              pins.push({
                landmark: closestLm,
                x,
                y,
                dist: closestDist
              });
            }
          }
        }

        setScreenPins(pins);

        // NOTE: We NEVER call onStepChange(idx) automatically!
        // Dragging and scrolling are 100% free and will NEVER auto-fly to any building!
      }
    };

    animate();

    // 10. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [timeOfDay, dragMode, onStepChange, onOpenBuildingDetails]);

  // Helper methods for walk/turn buttons
  const walk = (distance) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    isTransitioning.current = false;

    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    cam.position.addScaledVector(dir, distance);
    ctrl.target.addScaledVector(dir, distance);
    if (cam.position.y < 2.2) cam.position.y = 2.2;
    ctrl.update();
  };

  const turn = (angle) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    isTransitioning.current = false;

    const offset = new THREE.Vector3().subVectors(cam.position, ctrl.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    cam.position.addVectors(ctrl.target, offset);
    ctrl.update();
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Three.js Canvas Container: Free 360° Drag & Continuous Wheel Scroll */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title={lang === 'bn'
          ? 'মাউসের লেফট বাটন চেপে ধরে রাস্তা ও ক্যাম্পাস ড্র্যাগ করুন। রাস্তায় ক্লিক করলে সেখানে হেঁটে যাবে।'
          : 'Left-click & drag to explore campus roads. Click any road to walk directly there.'}
      />

      {/* Floating 2D Screen-Projected Building Detail Button (Single discreet button, high above roof, NEVER moves camera) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {screenPins.map(({ landmark, x, y }) => {
          return (
            <div
              key={landmark.id}
              className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150 pointer-events-auto"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -100%)`,
              }}
            >
              {/* Clean Single Detail Button: Clicking it ONLY opens the modal, NEVER moves the camera */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenBuildingDetails) onOpenBuildingDetails(landmark);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/90 hover:bg-emerald-600 text-white shadow-2xl border border-emerald-500/60 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                title={lang === 'bn'
                  ? `${landmark.name} এর বিস্তারিত তথ্য দেখতে চাপ দিন`
                  : `Click to inspect ${landmark.nameEn || landmark.name}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-white animate-pulse" />
                <span className="text-xs font-bold text-emerald-300 group-hover:text-white whitespace-nowrap">
                  {lang === 'bn' ? landmark.name : (landmark.nameEn || landmark.name)}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-[10px] text-white font-extrabold tracking-wide">
                  {lang === 'bn' ? 'ℹ️ বিস্তারিত' : 'ℹ️ Details'}
                </span>
              </button>

              {/* Down pointer arrow */}
              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-emerald-500/80 mx-auto" />
            </div>
          );
        })}
      </div>

      {/* On-Screen Road Navigation Controls (Touch and Click Friendly) */}
      <div className="absolute bottom-20 left-4 z-30 pointer-events-auto hidden sm:flex flex-col gap-1.5 glass-panel p-2 rounded-2xl border border-slate-700/70 shadow-2xl">
        <span className="text-[9px] text-emerald-400 font-bold px-1 text-center">
          {lang === 'bn' ? 'রোড মুভমেন্ট' : 'Road Navigation'}
        </span>
        <button
          onClick={() => walk(8)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition border border-slate-800"
          title={lang === 'bn' ? 'রাস্তা ধরে সামনে এগিয়ে যান' : 'Walk Forward'}
        >
          {lang === 'bn' ? '▲ সামনে যান' : '▲ Forward'}
        </button>
        <div className="flex gap-1.5">
          <button
            onClick={() => turn(Math.PI / 8)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition border border-slate-800 flex-1"
            title={lang === 'bn' ? 'বামে ৩৬০° ঘুরুন' : 'Look Left'}
          >
            {lang === 'bn' ? '◀ বামে' : '◀ Left'}
          </button>
          <button
            onClick={() => turn(-Math.PI / 8)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition border border-slate-800 flex-1"
            title={lang === 'bn' ? 'ডানে ৩৬০° ঘুরুন' : 'Look Right'}
          >
            {lang === 'bn' ? 'ডানে ▶' : 'Right ▶'}
          </button>
        </div>
        <button
          onClick={() => walk(-8)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition border border-slate-800"
          title={lang === 'bn' ? 'পেছনে যান' : 'Step Back'}
        >
          {lang === 'bn' ? '▼ পেছনে যান' : '▼ Back'}
        </button>
      </div>

    </div>
  );
}

function getBuildingPinHeight(id) {
  switch (id) {
    case 'academic': return 16;
    case 'abu-sayed-hall': return 15;
    case 'girls-hall': return 14;
    case 'auditorium': return 12;
    case 'library': return 11;
    case 'mosque': return 17;
    case 'weaving-shed': return 9;
    case 'basketball':
    case 'swimming-pool':
    case 'central-field': return 3.5;
    default: return 8;
  }
}
