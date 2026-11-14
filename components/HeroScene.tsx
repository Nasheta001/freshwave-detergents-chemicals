"use client";

import { useEffect, useRef, useState } from "react";

/* Lightweight 3D product composition for the hero.
   three.js is loaded only in the browser, after the page has rendered.
   A static illustration is shown first and stays if WebGL is unavailable. */

export default function HeroScene() {
  const mount = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.75;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(4, 7, 6);
      const rim = new THREE.DirectionalLight(0xa7ebf2, 1.6);
      rim.position.set(-6, 3, -4);
      scene.add(key, rim);

      const C = { white: 0xf2f9fb, ocean: 0x26658c, teal: 0x54acbf, ice: 0xa7ebf2, navy: 0x023859, deep: 0x0a3c62 };
      const plastic = (color: number, rough = 0.34) =>
        new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 0.7, clearcoatRoughness: 0.28 });
      const lathe = (pts: [number, number][], mat: import("three").Material) =>
        new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 56), mat);
      const cyl = (r: number, h: number, mat: import("three").Material, y = 0, r2 = r) => {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, h, 48), mat);
        m.position.y = y;
        return m;
      };

      const stage = new THREE.Group();
      scene.add(stage);

      // Plinth
      const plinth = cyl(3.7, 0.16, new THREE.MeshStandardMaterial({ color: 0x0a4a75, roughness: 0.62, metalness: 0.1, envMapIntensity: 0.35 }), -0.08);
      stage.add(plinth);
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000a1a, transparent: true, opacity: 0.28, depthWrite: false });
      const place = (obj: import("three").Object3D, x: number, z: number, shadowR: number, rotY = 0) => {
        obj.position.set(x, 0, z);
        obj.rotation.y = rotY;
        const s = new THREE.Mesh(new THREE.CircleGeometry(shadowR, 40), shadowMat);
        s.rotation.x = -Math.PI / 2;
        s.position.set(x + 0.12, 0.004, z + 0.1);
        stage.add(s, obj);
      };

      // Detergent bottle
      const bottle = new THREE.Group();
      bottle.add(
        lathe([[0, 0], [0.6, 0], [0.66, 0.08], [0.66, 1.55], [0.6, 1.88], [0.32, 2.16], [0.25, 2.22], [0.25, 2.46]], plastic(C.white)),
        cyl(0.672, 0.82, plastic(C.ocean, 0.5), 0.92),
        cyl(0.3, 0.34, plastic(C.teal), 2.6),
      );
      place(bottle, -0.25, 0.1, 0.85);

      // Spray bottle
      const spray = new THREE.Group();
      const head = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.3, 0.34, 4, 0.08), plastic(C.navy));
      head.position.set(0.1, 2.02, 0);
      const trigger = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.5, 0.16, 3, 0.04), plastic(C.navy));
      trigger.position.set(0.3, 1.68, 0);
      trigger.rotation.z = 0.35;
      spray.add(
        lathe([[0, 0], [0.44, 0], [0.48, 0.06], [0.48, 1.0], [0.38, 1.38], [0.2, 1.6], [0.17, 1.88]], plastic(C.ice, 0.22)),
        cyl(0.2, 0.14, plastic(C.navy), 1.9),
        head,
        trigger,
      );
      place(spray, 0.95, 1.15, 0.62, -0.5);

      // Jerrycan
      const can = new THREE.Group();
      const canBody = new THREE.Mesh(new RoundedBoxGeometry(1.35, 1.7, 0.85, 5, 0.14), plastic(C.teal, 0.42));
      canBody.position.y = 0.85;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.07, 14, 28, Math.PI), plastic(C.teal, 0.42));
      handle.position.set(0.22, 1.68, 0);
      const canCap = cyl(0.17, 0.18, plastic(C.white), 1.79);
      canCap.position.x = -0.4;
      can.add(canBody, handle, canCap);
      place(can, 2.1, -0.75, 0.95, -0.3);

      // Drum
      const drum = new THREE.Group();
      const drumMat = plastic(C.ocean, 0.38);
      const rib = (y: number) => {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.83, 0.04, 10, 56), drumMat);
        t.rotation.x = Math.PI / 2;
        t.position.y = y;
        return t;
      };
      const bung = cyl(0.11, 0.07, plastic(C.white), 2.02);
      bung.position.x = 0.45;
      drum.add(cyl(0.82, 1.95, drumMat, 0.975), rib(0.66), rib(1.3), cyl(0.84, 0.06, plastic(C.deep), 1.97), bung);
      place(drum, -1.95, -1.15, 1.05);

      // Pump bottle
      const pump = new THREE.Group();
      const pumpHead = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.09, 0.14, 3, 0.04), plastic(C.navy));
      pumpHead.position.set(0.12, 1.64, 0);
      pump.add(
        lathe([[0, 0], [0.38, 0], [0.42, 0.05], [0.42, 0.92], [0.3, 1.12], [0.15, 1.17], [0.15, 1.3]], plastic(C.white)),
        cyl(0.17, 0.12, plastic(C.navy), 1.34),
        cyl(0.04, 0.26, plastic(C.navy), 1.5),
        pumpHead,
      );
      place(pump, -1.35, 1.1, 0.55, 0.4);

      // Droplets
      const dropMat = new THREE.MeshPhysicalMaterial({ color: C.ice, roughness: 0.05, metalness: 0, clearcoat: 1, transmission: 0.6, thickness: 0.6, ior: 1.33 });
      const drops = [
        [-2.9, 2.6, 0.2, 0.13], [-0.9, 3.35, -0.6, 0.09], [0.9, 3.0, 0.4, 0.15], [2.7, 2.5, 0.3, 0.1],
        [2.2, 3.4, -0.8, 0.07], [-2.1, 3.3, -0.4, 0.06], [0.3, 3.7, -0.2, 0.06],
      ].map(([x, y, z, r], i) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), dropMat);
        m.position.set(x, y, z);
        m.userData = { y, phase: i * 1.3 };
        stage.add(m);
        return m;
      });

      const size = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const dist = camera.aspect < 1 ? 14.5 : camera.aspect < 1.25 ? 12.6 : 11.4;
        camera.position.set(0, 2.5, dist);
        camera.lookAt(0, 1.45, 0);
        camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(() => {
        size();
        render(performance.now());
      });
      ro.observe(el);

      const pointer = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let raf = 0;
      let visible = true;
      function render(now: number) {
        const t = now / 1000;
        if (!still) {
          stage.rotation.y += (pointer.x * 0.22 + Math.sin(t * 0.35) * 0.07 - stage.rotation.y) * 0.05;
          stage.rotation.x += (pointer.y * 0.04 - stage.rotation.x) * 0.05;
          for (const d of drops) d.position.y = d.userData.y + Math.sin(t * 0.9 + d.userData.phase) * 0.12;
        }
        renderer.render(scene, camera);
      }
      const loop = (now: number) => {
        render(now);
        if (visible && !still && !document.hidden) raf = requestAnimationFrame(loop);
        else raf = 0;
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf && !still) raf = requestAnimationFrame(loop);
      });
      io.observe(el);
      const onVis = () => {
        if (!document.hidden && visible && !raf && !still) raf = requestAnimationFrame(loop);
      };
      document.addEventListener("visibilitychange", onVis);
      render(performance.now());
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        scene.traverse((o) => {
          const mesh = o as import("three").Mesh;
          mesh.geometry?.dispose?.();
          const mat = mesh.material as import("three").Material | import("three").Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose?.();
        });
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="relative h-full w-full" aria-hidden="true">
      {/* Static stand-in shown until the 3D scene is ready */}
      <svg
        viewBox="0 0 520 360"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      >
        <ellipse cx="260" cy="318" rx="230" ry="26" fill="#023859" />
        <rect x="92" y="150" width="104" height="166" rx="12" fill="#26658C" />
        <rect x="318" y="176" width="112" height="140" rx="16" fill="#54ACBF" />
        <path d="M226 316V150c0-22 22-26 22-48h24c0 22 22 26 22 48v166z" fill="#F2F9FB" />
        <rect x="246" y="78" width="28" height="26" rx="5" fill="#54ACBF" />
        <rect x="226" y="196" width="68" height="62" fill="#26658C" />
      </svg>
      <div ref={mount} className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
