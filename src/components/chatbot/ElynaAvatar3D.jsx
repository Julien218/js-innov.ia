import { useEffect, useRef, useState } from 'react';

const DEFAULT_FALLBACK = '/brand/companion/companion-avatar-256.webp';
const MANIFEST_URL = '/brand/companion/manifest.json';

let manifestPromise;

function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL, { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`manifest-${response.status}`);
        return response.json();
      })
      .catch((error) => {
        manifestPromise = undefined;
        throw error;
      });
  }
  return manifestPromise;
}

function setExpression(vrm, name, value) {
  const manager = vrm.expressionManager;
  if (!manager?.getExpression(name)) return;
  manager.setValue(name, Math.max(0, Math.min(1, value)));
}

function framePortrait(THREE, camera, vrm) {
  const head = vrm.humanoid?.getNormalizedBoneNode?.('head');
  if (head) {
    const headPosition = new THREE.Vector3();
    head.getWorldPosition(headPosition);
    const target = headPosition.clone();
    target.y -= 0.12;
    camera.position.set(target.x, target.y, target.z + 1.05);
    camera.lookAt(target);
    return;
  }

  const bounds = new THREE.Box3().setFromObject(vrm.scene);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z, 0.1);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = (maxDimension / (2 * Math.tan(fov / 2))) * 1.35;
  camera.position.set(center.x, center.y + size.y * 0.08, center.z + distance);
  camera.lookAt(center.x, center.y + size.y * 0.08, center.z);
}

function disposeScene(scene) {
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose?.();
      });
      material.dispose?.();
    });
  });
}

export default function ElynaAvatar3D({
  state = 'idle',
  fallbackSrc = DEFAULT_FALLBACK,
  className = '',
  alt = 'Elyna — Compagnon JS-Innov.IA',
}) {
  const mountRef = useRef(null);
  const stateRef = useRef(state);
  const [renderMode, setRenderMode] = useState('fallback');

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let disposed = false;
    let frameId = 0;
    let resizeObserver;
    let renderer;
    let scene;
    let vrm;

    async function boot() {
      try {
        const manifest = await getManifest();
        const threeD = manifest?.threeD;
        if (!threeD?.enabled || !threeD?.model || disposed) return;

        const [THREE, loaderModule, vrmModule] = await Promise.all([
          import('three'),
          import('three/addons/loaders/GLTFLoader.js'),
          import('@pixiv/three-vrm'),
        ]);
        if (disposed || !mountRef.current) return;

        const { GLTFLoader } = loaderModule;
        const { VRMLoaderPlugin } = vrmModule;
        const mount = mountRef.current;
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        mount.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(26, 1, 0.01, 20);

        const ambient = new THREE.HemisphereLight(0xf5f7fa, 0x080b1f, 2.1);
        scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0xf5cf41, 2.25);
        keyLight.position.set(1.5, 2.2, 2.5);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0x00b4ff, 1.8);
        rimLight.position.set(-2, 1.4, -0.8);
        scene.add(rimLight);

        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));

        const gltf = await loader.loadAsync(threeD.model);
        if (disposed) return;

        vrm = gltf.userData.vrm;
        if (!vrm?.scene) throw new Error('elyna-vrm-missing');
        scene.add(vrm.scene);
        framePortrait(THREE, camera, vrm);

        const baseRotation = vrm.scene.rotation.clone();
        const basePosition = vrm.scene.position.clone();
        const clock = new THREE.Clock();

        function resize() {
          if (!mountRef.current || !renderer) return;
          const { width, height } = mountRef.current.getBoundingClientRect();
          if (width < 1 || height < 1) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        resize();
        setRenderMode('3d');

        function animate() {
          if (disposed || !renderer || !vrm) return;
          frameId = window.requestAnimationFrame(animate);

          const delta = Math.min(clock.getDelta(), 0.05);
          const elapsed = clock.elapsedTime;
          const currentState = stateRef.current;
          const manager = vrm.expressionManager;
          manager?.resetValues?.();

          const blinkPhase = elapsed % 4.8;
          if (blinkPhase < 0.14) {
            setExpression(vrm, 'blink', Math.sin((blinkPhase / 0.14) * Math.PI));
          }

          let targetRotationY = baseRotation.y;
          let targetRotationX = baseRotation.x;
          let targetPositionY = basePosition.y;

          if (!prefersReducedMotion) {
            targetPositionY += Math.sin(elapsed * 1.25) * 0.006;
            if (currentState === 'listening') {
              targetRotationX += 0.025;
              targetRotationY += Math.sin(elapsed * 0.9) * 0.015;
              setExpression(vrm, 'relaxed', 0.12);
            } else if (currentState === 'thinking') {
              targetRotationY += 0.07 + Math.sin(elapsed * 0.65) * 0.018;
              setExpression(vrm, 'lookUp', 0.15);
            } else if (currentState === 'speaking') {
              targetRotationY += Math.sin(elapsed * 1.7) * 0.018;
              setExpression(vrm, 'aa', 0.12 + (Math.sin(elapsed * 7.5) + 1) * 0.08);
            } else if (currentState === 'success') {
              setExpression(vrm, 'happy', 0.42);
            } else if (currentState === 'error') {
              setExpression(vrm, 'sad', 0.24);
            } else {
              targetRotationY += Math.sin(elapsed * 0.45) * 0.012;
              setExpression(vrm, 'relaxed', 0.08);
            }
          } else if (currentState === 'success') {
            setExpression(vrm, 'happy', 0.35);
          } else if (currentState === 'error') {
            setExpression(vrm, 'sad', 0.2);
          }

          vrm.scene.rotation.x += (targetRotationX - vrm.scene.rotation.x) * 0.08;
          vrm.scene.rotation.y += (targetRotationY - vrm.scene.rotation.y) * 0.08;
          vrm.scene.position.y += (targetPositionY - vrm.scene.position.y) * 0.08;

          vrm.update(delta);
          renderer.render(scene, camera);
        }

        animate();
      } catch (error) {
        console.warn('Elyna 3D indisponible, fallback 2D conservé.', error);
        if (!disposed) setRenderMode('fallback');
      }
    }

    boot();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      if (scene) disposeScene(scene);
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss?.();
        renderer.domElement.remove();
      }
    };
  }, []);

  return (
    <span ref={mountRef} className={`relative block overflow-hidden ${className}`} role="img" aria-label={alt}>
      <img
        src={fallbackSrc}
        alt=""
        width="256"
        height="256"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${renderMode === '3d' ? 'opacity-0' : 'opacity-100'}`}
      />
    </span>
  );
}
