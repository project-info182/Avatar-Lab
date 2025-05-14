// ParticleBackgroundSimple.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackgroundSimple = () => {
    const mountRef = useRef(null);
    console.log('ParticleBackgroundSimple: Component rendering/rendered.');

    useEffect(() => {
        console.log('ParticleBackgroundSimple: useEffect triggered.');
        let scene, camera, renderer;
        let particles;
        const particleCount = 200; // Slightly reduced for simplicity
        const particleSpeed = 0.03;

        const currentMount = mountRef.current;

        if (!currentMount) {
            console.error('ParticleBackgroundSimple: mountRef.current is null. Aborting.');
            return;
        }
        console.log('ParticleBackgroundSimple: mountRef.current is available.');

        function init() {
            console.log('ParticleBackgroundSimple: init() called.');
            const clientWidth = currentMount.clientWidth || window.innerWidth;
            const clientHeight = currentMount.clientHeight || window.innerHeight;

            if (clientWidth === 0 || clientHeight === 0) {
                console.warn('ParticleBackgroundSimple: mountRef has zero dimensions. Using window dimensions.');
            }

            scene = new THREE.Scene();
            const aspect = clientWidth / clientHeight;
            const frustumSize = 100;
            camera = new THREE.OrthographicCamera(
                frustumSize * aspect / -2, frustumSize * aspect / 2,
                frustumSize / 2, frustumSize / -2,
                1, 1000
            );
            camera.position.z = 10;
            console.log('ParticleBackgroundSimple: Scene and Camera created.');

            try {
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(clientWidth, clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                currentMount.appendChild(renderer.domElement);
                console.log('ParticleBackgroundSimple: Renderer created and appended.');
            } catch (error) {
                console.error('ParticleBackgroundSimple: Error creating WebGLRenderer:', error);
                return false;
            }
            
            createParticles();
            return true;
        }

        function createParticles() {
            console.log('ParticleBackgroundSimple: createParticles() called.');
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            const color = new THREE.Color();
            const frustumHeight = camera.top - camera.bottom;
            const frustumWidth = camera.right - camera.left;

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 0] = (Math.random() - 0.5) * frustumWidth;
                positions[i * 3 + 1] = (Math.random() - 0.5) * frustumHeight;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // Less Z depth

                color.setHSL(Math.random() * 0.20 + 0.55, 0.8, 0.6 + Math.random() * 0.3); // Blues, purples
                colors[i * 3 + 0] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            // Using basic PointsMaterial
            const material = new THREE.PointsMaterial({
                size: 0.7, // Adjust size as needed
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending, // Still good for dark themes
                depthWrite: false,
                sizeAttenuation: true, // Points will be smaller further away (less effect in ortho)
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
            console.log('ParticleBackgroundSimple: Particles created with PointsMaterial.');
        }

        let animationFrameId;
        let frameCount = 0;
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            frameCount++;

            if (particles && particles.geometry && particles.geometry.attributes.position) {
                const positions = particles.geometry.attributes.position.array;
                
                if (!camera || camera.top === undefined) {
                    if (frameCount % 120 === 0) console.warn("ParticleBackgroundSimple: Camera not ready in animate.");
                    return;
                }
                const topEdge = camera.top;
                const bottomEdge = camera.bottom;
                const frustumWidth = camera.right - camera.left;

                for (let i = 0; i < particleCount; i++) {
                    positions[i * 3 + 1] -= particleSpeed * (Math.random() * 0.5 + 0.5); // Add some speed variation
                    if (positions[i * 3 + 1] < bottomEdge - 1) {
                        positions[i * 3 + 1] = topEdge + 1;
                        positions[i * 3 + 0] = (Math.random() - 0.5) * frustumWidth;
                    }
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }

            if (renderer && scene && camera) {
                renderer.render(scene, camera);
                if (frameCount === 1) console.log("ParticleBackgroundSimple: First frame rendered.");
            } else {
                 if (frameCount % 120 === 0) console.warn("ParticleBackgroundSimple: Renderer, scene or camera missing in animate.");
            }
        }

        function onWindowResize() {
            console.log('ParticleBackgroundSimple: onWindowResize() called.');
            if (!renderer || !camera || !currentMount) return;

            const clientWidth = currentMount.clientWidth || window.innerWidth;
            const clientHeight = currentMount.clientHeight || window.innerHeight;
            if (clientWidth === 0 || clientHeight === 0) return;

            const aspect = clientWidth / clientHeight;
            const frustumSize = camera.top - camera.bottom > 0 ? camera.top - camera.bottom : 100;

            camera.left = frustumSize * aspect / -2;
            camera.right = frustumSize * aspect / 2;
            camera.top = frustumSize / 2;
            camera.bottom = frustumSize / -2;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
            console.log('ParticleBackgroundSimple: Resized.');
        }

        let initialized = false;
        if (currentMount) {
            initialized = init();
            if (initialized) {
                animate();
                window.addEventListener('resize', onWindowResize);
                console.log('ParticleBackgroundSimple: Init successful, animation started.');
            } else {
                console.error('ParticleBackgroundSimple: Init failed.');
            }
        }

        return () => {
            console.log('ParticleBackgroundSimple: Cleanup function called.');
            window.removeEventListener('resize', onWindowResize);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            
            if (particles) {
                if (particles.geometry) particles.geometry.dispose();
                if (particles.material) particles.material.dispose();
                if (scene && particles.parent === scene) scene.remove(particles);
            }
            if (renderer) renderer.dispose();
            if (currentMount && renderer && renderer.domElement && currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            scene = null; camera = null; renderer = null; particles = null;
            console.log('ParticleBackgroundSimple: Cleanup complete.');
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                overflow: 'hidden',
                backgroundColor: 'transparent', // Canvas will be drawn on top
            }}
            aria-hidden="true"
        />
    );
};

export default ParticleBackgroundSimple;
