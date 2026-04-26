"use client";
import { useEffect, useRef, useState } from "react";
import type * as ThreeTypes from "three";

interface Props {
  onStart: () => void;
  onDemo: () => void;
}

export default function HeroSection({ onStart, onDemo }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: typeof import("three");

    async function init() {
      THREE = await import("three");
      if (!canvas) return;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas as HTMLCanvasElement, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
      camera.position.z = 5;

      // Floating wireframe spheres
      const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x93c5fd, // blue-300
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });

      const spheres: ThreeTypes.Mesh[] = [];
      const positions = [
        [-3.5, 1.2, -2], [3.2, -0.8, -3], [-1.5, -2, -1.5],
        [2.5, 2.2, -2.5], [0.5, -1.5, -3.5],
      ] as [number, number, number][];
      const scales = [1.1, 0.85, 0.6, 0.75, 0.5];

      positions.forEach(([x, y, z], i) => {
        const mesh = new THREE.Mesh(sphereGeo, sphereMat.clone());
        mesh.position.set(x, y, z);
        mesh.scale.setScalar(scales[i]);
        scene.add(mesh);
        spheres.push(mesh);
      });

      // Floating rings
      const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 8, 40);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe2e8f0, // slate-200
        transparent: true,
        opacity: 0.35,
      });

      const rings: ThreeTypes.Mesh[] = [];
      const ringData: [number, number, number, number, number, number][] = [
        [2, 0.5, -2, 0.4, 0.2, 0],
        [-2.5, -0.5, -2.5, 0.1, 0.3, 0.5],
      ];
      ringData.forEach(([x, y, z, rx, ry, rz]) => {
        const ring = new THREE.Mesh(ringGeo, ringMat.clone());
        ring.position.set(x, y, z);
        ring.rotation.set(rx, ry, rz);
        scene.add(ring);
        rings.push(ring);
      });

      let t = 0;
      function animate() {
        animId = requestAnimationFrame(animate);
        t += 0.003;

        spheres.forEach((s, i) => {
          s.rotation.x += 0.002 + i * 0.001;
          s.rotation.y += 0.003 + i * 0.0005;
          s.position.y = positions[i][1] + Math.sin(t + i) * 0.15;
        });

        rings.forEach((r, i) => {
          r.rotation.x += 0.004 + i * 0.002;
          r.rotation.z += 0.002;
          r.position.y = ringData[i][1] + Math.sin(t * 0.7 + i * 1.5) * 0.1;
        });

        renderer.render(scene, camera);
      }

      animate();

      const onResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    }

    const cleanup = init();
    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white pointer-events-none" />

      {/* Logo top-left */}
      <div className="relative z-10 px-8 pt-8 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">PS</span>
        </div>
        <span className="font-bold text-slate-800 text-sm tracking-tight">Persona Signal</span>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-20">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-blue-600 tracking-wide">AI-Powered Pre-Validation</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight tracking-tight max-w-2xl mx-auto">
            제품을 출시하기 전에
            <br />
            <span className="text-blue-600">고객 반응</span>을 먼저 예측하세요
          </h1>

          <p
            className="mt-6 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed transition-all duration-1000 delay-200"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
            }}
          >
            5,000명의 한국인 합성 페르소나가 여러분의 카피, 가격, 기능안을 평가합니다.
            <br />
            10초면 인터뷰 없이 세그먼트별 반응과 리스크를 확인할 수 있습니다.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-1000 delay-400"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
            }}
          >
            <button
              onClick={onStart}
              className="px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              시뮬레이션 시작하기 →
            </button>
            <button
              onClick={onDemo}
              className="px-5 py-3.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors"
            >
              ⚡ 데모 결과 바로 보기
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="mt-16 flex flex-wrap justify-center gap-8 transition-all duration-1000 delay-600"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {[
            { value: "5,000명", label: "한국인 합성 페르소나" },
            { value: "10초", label: "평균 응답 시간" },
            { value: "5개 축", label: "신뢰·이해·매력·저항·명확성" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs text-slate-300">스크롤</span>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
