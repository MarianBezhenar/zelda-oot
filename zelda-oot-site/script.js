/**
 * The Legend of Zelda: Ocarina of Time - Tribute Site
 * Interactive JavaScript Features
 */




// ============================================
// PRELOADER - Intro Screen with 10s duration
// ============================================
class Preloader {
    constructor(audioPlayer = null) {
        this.preloader = document.getElementById('preloader');
        this.progressBar = document.getElementById('preloader-progress');
        this.content = document.getElementById('preloader-content');
        this.hasStarted = false;
        this.hasFinished = false;
        this.startTime = null;
        this.duration = 14000; // 14 seconds in ms (to accommodate all fade-in animations)
        this.audioPlayer = audioPlayer; // Reference to AudioPlayer instance
        
        this.init();
    }
    
    init() {
        if (!this.preloader) return;
        
        // Add active class to body
        document.body.classList.add('preloader-active');
        
        // Small delay then start animation
        setTimeout(() => {
            this.startSequence();
        }, 300);
        
        // Click to skip/finish
        this.preloader.addEventListener('click', () => {
            if (!this.hasStarted) {
                this.startSequence();
            } else if (!this.hasFinished) {
                this.finish();
            }
        });
        
        // Also allow any key press
        document.addEventListener('keydown', (e) => {
            if (!this.hasFinished && this.hasStarted) {
                this.finish();
            }
        });
    }
    
    startSequence() {
        if (this.hasStarted) return;
        this.hasStarted = true;
        this.startTime = Date.now();
        
        // Activate content animations
        this.preloader.classList.add('active');
        
        // Start music playback immediately
        if (this.audioPlayer) {
            this.audioPlayer.playFromPreloader();
        }
        
        // Start progress bar (14 seconds for all fade-in animations)
        requestAnimationFrame(() => {
            this.progressBar.style.width = '100%';
        });
        
        // Auto-finish after 14 seconds
        /*this.autoFinishTimer = setTimeout(() => {
            if (!this.hasFinished) {
                this.finish();
            }
        }, this.duration);*/
        
        // Update hint text after 5 seconds
        setTimeout(() => {
            const hint = document.getElementById('preloader-hint');
            if (hint && !this.hasFinished) {
                hint.querySelector('p').textContent = 'CLICK ANYWHERE TO ENTER HYRULE';
            }
        }, 5000);
    }
    
    finish() {
        if (this.hasFinished) return;
        this.hasFinished = true;
        
        // Clear auto-finish timer
        if (this.autoFinishTimer) {
            clearTimeout(this.autoFinishTimer);
        }
        
        // Fade out preloader
        this.preloader.classList.add('fade-out');
        
        // Reveal main content
        document.body.classList.remove('preloader-active');
        document.body.classList.add('preloader-finished');
        
        // Remove from DOM after fade
        setTimeout(() => {
            this.preloader.style.display = 'none';
            this.preloader.remove();
            
            // Trigger any post-load animations
            this.onComplete();
        }, 1000);
    }
    
    onComplete() {
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        
        // Start ambient audio if available (optional)
        console.log('Welcome to Hyrule!');
    }
    
    // Public method to check if preloader is active
    isActive() {
        return !this.hasFinished;
    }
}
// ============================================
// PARTICLE SYSTEM - Magical Forest Atmosphere
// ============================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3 - 0.1,
                opacity: Math.random() * 0.5 + 0.2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.pulse += particle.pulseSpeed;
            
            // Mouse interaction - particles gently move away from cursor
            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                const force = (100 - distance) / 100 * 0.5;
                particle.x += (dx / distance) * force;
                particle.y += (dy / distance) * force;
            }
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle with pulsing glow
            const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulse));
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, `rgba(77, 208, 225, ${pulseOpacity})`);
            gradient.addColorStop(0.5, `rgba(45, 158, 92, ${pulseOpacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(45, 158, 92, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Core
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(200, 255, 230, ${pulseOpacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// THREE.JS - 3D Link Model Scene
// ============================================
class ThreeJSScene {
    constructor() {
        this.container = document.getElementById('three-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.lights = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Setup lighting
        this.setupLighting();
        
        // Create placeholder model (since we don't have actual GLTF)
        this.createPlaceholderModel();
        
        // Bind events
        this.bindEvents();
        
        // Start animation loop
        this.animate();
    }
    
    setupLighting() {
        // Ambient light - soft green forest atmosphere
        this.lights.ambient = new THREE.AmbientLight(0x2d9e5c, 0.4);
        this.scene.add(this.lights.ambient);
        
        // Main directional light - simulating forest light
        this.lights.main = new THREE.DirectionalLight(0x4dd0e1, 0.8);
        this.lights.main.position.set(2, 3, 4);
        this.lights.main.castShadow = true;
        this.lights.main.shadow.mapSize.width = 1024;
        this.lights.main.shadow.mapSize.height = 1024;
        this.scene.add(this.lights.main);
        
        // Rim light - golden accent
        this.lights.rim = new THREE.DirectionalLight(0xc9a227, 0.5);
        this.lights.rim.position.set(-3, 2, -2);
        this.scene.add(this.lights.rim);
        
        // Fill light - soft emerald
        this.lights.fill = new THREE.PointLight(0x2d9e5c, 0.3, 10);
        this.lights.fill.position.set(0, -1, 2);
        this.scene.add(this.lights.fill);
    }
    
    createPlaceholderModel() {
        // Create a stylized Link-inspired figure using basic geometries
        // This serves as a placeholder since we don't have the actual GLTF model
        
        const group = new THREE.Group();
        
        // Materials
        const tunicMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d9e5c,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            roughness: 0.5,
            metalness: 0
        });
        
        const hatMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a4a2e,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const bootMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.6,
            metalness: 0.2
        });
        
        const swordMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            roughness: 0.2,
            metalness: 0.9,
            emissive: 0x4dd0e1,
            emissiveIntensity: 0.2
        });
        
        const hiltMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a0080,
            roughness: 0.4,
            metalness: 0.5
        });
        
        // Body (tunic)
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.45, 1.2, 8),
            tunicMaterial
        );
        body.position.y = 0;
        body.castShadow = true;
        group.add(body);
        
        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            skinMaterial
        );
        head.position.y = 0.85;
        head.castShadow = true;
        group.add(head);
        
        // Hat
        /*const hat = new THREE.Mesh(
            new THREE.ConeGeometry(0.25, 0.8, 8),
            hatMaterial
        );
        hat.position.set(0, 1.3, -0.1);
        hat.rotation.x = -0.3;
        hat.castShadow = true;
        group.add(hat);*/
        
        // Left arm
        const leftArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.12, 0.7, 8),
            skinMaterial
        );
        leftArm.position.set(-0.5, 0.2, 0);
        leftArm.rotation.z = 0.3;
        leftArm.castShadow = true;
        group.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.12, 0.7, 8),
            skinMaterial
        );
        rightArm.position.set(0.5, 0.2, 0.2);
        rightArm.rotation.z = -0.5;
        rightArm.rotation.x = -0.3;
        rightArm.castShadow = true;
        group.add(rightArm);
        
        // Sword blade
        const sword = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 1.2, 0.02),
            swordMaterial
        );
        sword.position.set(0.6, 0.6, 0.4);
        sword.rotation.x = 0.2;
        sword.castShadow = true;
        group.add(sword);
        
        // Sword hilt
        const hilt = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8),
            hiltMaterial
        );
        hilt.position.set(0.6, 0, 0.35);
        hilt.rotation.x = 0.2;
        group.add(hilt);
        
        // Sword guard
        const guard = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.05, 0.08),
            hiltMaterial
        );
        guard.position.set(0.6, 0.12, 0.37);
        guard.rotation.x = 0.2;
        group.add(guard);
        
        // Left boot
        const leftBoot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.15, 0.5, 8),
            bootMaterial
        );
        leftBoot.position.set(-0.2, -0.85, 0);
        leftBoot.castShadow = true;
        group.add(leftBoot);
        
        // Right boot
        const rightBoot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.15, 0.5, 8),
            bootMaterial
        );
        rightBoot.position.set(0.2, -0.85, 0);
        rightBoot.castShadow = true;
        group.add(rightBoot);
        
        // Shield (simplified)
        const shield = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 0.05, 8),
            new THREE.MeshStandardMaterial({
                color: 0x1a4a2e,
                roughness: 0.5,
                metalness: 0.3
            })
        );
        shield.position.set(-0.35, 0.1, 0.25);
        shield.rotation.x = 0.3;
        shield.rotation.z = -0.2;
        shield.castShadow = true;
        group.add(shield);
        
        // Triforce symbol on shield
        const triforce = new THREE.Mesh(
            new THREE.ConeGeometry(0.08, 0.15, 3),
            new THREE.MeshStandardMaterial({
                color: 0xc9a227,
                emissive: 0xc9a227,
                emissiveIntensity: 0.3
            })
        );
        triforce.position.set(-0.35, 0.15, 0.3);
        triforce.rotation.x = 0.3;
        triforce.rotation.z = -0.2;
        group.add(triforce);
        
        this.model = group;
        this.scene.add(this.model);
        this.isLoaded = true;
    }
    
    bindEvents() {
        // Mouse movement for parallax effect
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            if (!this.camera || !this.renderer) return;
            
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.model) return;
        
        // Idle animation - gentle floating
        const time = Date.now() * 0.001;
        this.model.position.y = Math.sin(time) * 0.05;
        
        // Mouse-based rotation (parallax)
        this.targetRotationY = this.mouseX * 0.3;
        this.targetRotationX = this.mouseY * 0.1;
        
        // Smooth interpolation
        this.model.rotation.y += (this.targetRotationY - this.model.rotation.y) * 0.05;
        this.model.rotation.x += (this.targetRotationX - this.model.rotation.x) * 0.05;
        
        // Subtle breathing animation
        const breathe = 1 + Math.sin(time * 2) * 0.01;
        this.model.scale.set(breathe, breathe, breathe);
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// SCROLL ANIMATIONS - Intersection Observer
// ============================================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, this.observerOptions);
        
        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }
}

// ============================================
// NAVBAR - Scroll Effect & Mobile Menu
// ============================================
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.hamburgerIcon = document.getElementById('hamburger-icon');
        this.isMenuOpen = false;
        this.lastScroll = 0;
        
        this.init();
    }
    
    init() {
        // Scroll effect - more transparent navbar
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle with animation
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu on link click
        this.mobileMenu?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }
    
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // More transparent navbar - only add slight background when scrolled
        if (currentScroll > 100) {
            this.navbar.classList.add('bg-forest-dark/60', 'backdrop-blur-sm');
            this.navbar.classList.remove('bg-transparent');
        } else {
            this.navbar.classList.remove('bg-forest-dark/60', 'backdrop-blur-sm');
            this.navbar.classList.add('bg-transparent');
        }
        
        this.lastScroll = currentScroll;
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        // Toggle hamburger animation
        if (this.hamburgerIcon) {
            if (this.isMenuOpen) {
                this.hamburgerIcon.classList.add('menu-open');
            } else {
                this.hamburgerIcon.classList.remove('menu-open');
            }
        }
        
        // Toggle menu visibility with animation
        if (this.isMenuOpen) {
            this.mobileMenu.classList.add('menu-visible');
        } else {
            this.mobileMenu.classList.remove('menu-visible');
        }
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        
        if (this.hamburgerIcon) {
            this.hamburgerIcon.classList.remove('menu-open');
        }
        
        this.mobileMenu.classList.remove('menu-visible');
    }
}

// ============================================
// CHARACTER CARDS - Mouse Glow Effect
// ============================================
class CharacterCards {
    constructor() {
        this.cards = document.querySelectorAll('.character-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    }
    
    handleMouseLeave(card) {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    }
}

// ============================================
// SMOOTH SCROLL - Navigation Links
// ============================================
class SmoothScroll {
    constructor() {
        this.isScrolling = false;
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    const hamburgerIcon = document.getElementById('hamburger-icon');
                    if (mobileMenu && mobileMenu.classList.contains('menu-visible')) {
                        mobileMenu.classList.remove('menu-visible');
                        hamburgerIcon?.classList.remove('menu-open');
                    }
                    
                    // Scroll to target - scroll snap will handle the snapping
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// CTA BUTTON - Interactive Effect
// ============================================
class CTAButton {
    constructor() {
        this.button = document.querySelector('.cta-button');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        this.button.addEventListener('click', () => {
            // Create magical sparkles effect
            this.createSparkles();
            
            // Scroll to about section
            document.getElementById('about')?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    createSparkles() {
        const rect = this.button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #4dd0e1;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 10px #4dd0e1;
            `;
            document.body.appendChild(sparkle);
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const duration = 600 + Math.random() * 400;
            
            sparkle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => sparkle.remove();
        }
    }
}

// ============================================
// PARALLAX EFFECT - Story Section
// ============================================
class ParallaxEffect {
    constructor() {
        this.storySection = document.getElementById('story');
        this.init();
    }
    
    init() {
        if (!this.storySection) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rect = this.storySection.getBoundingClientRect();
            const sectionTop = rect.top + scrolled;
            const relativeScroll = scrolled - sectionTop + window.innerHeight;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parallaxElements = this.storySection.querySelectorAll('.stone-panel');
                parallaxElements.forEach((el, index) => {
                    const speed = 0.05 + (index * 0.01);
                    const yPos = relativeScroll * speed;
                    el.style.transform = `translateY(${yPos * 0.1}px)`;
                });
            }
        });
    }
}


// ============================================
// AUDIO PLAYER - Zelda Ocarina of Time Music
// ============================================
class AudioPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTrack = 0;
        this.isLoading = false;
        
        // Zelda Ocarina of Time Soundtrack
        this.tracks = [
            { name: "Title Theme", file: "title-theme.mp3" },
            { name: "House", file: "house.mp3" },
            { name: "Kokiri Forest", file: "kokiri-forest.mp3" },
            { name: "Hyrule Field Main Theme", file: "hyrule-field-main-theme.mp3" },
            { name: "Hyrule Castle Courtyard", file: "hyrule-castle-courtyard.mp3" },
            { name: "Ocarina of Time", file: "ocarina-of-time.mp3" },
            { name: "Kaepora Gaebora's theme", file: "kaepora-gaebora's-theme.mp3" },
            { name: "Lost Woods", file: "lost-woods.mp3" },
            { name: "Great Fairy's Fountain", file: "great-fairy's-fountain.mp3" },
            { name: "Windmill Hut", file: "windmill-hut.mp3" },
        ];
        
        this.elements = {
            toggle: document.getElementById('audio-toggle'),
            prev: document.getElementById('audio-prev'),
            next: document.getElementById('audio-next'),
            trackName: document.getElementById('track-name'),
            trackStatus: document.getElementById('track-status'),
            soundWaves: document.getElementById('sound-waves'),
            playIcon: document.getElementById('play-icon'),
            pauseIcon: document.getElementById('pause-icon')
        };
        
        this.init();
    }
    

    init() {
        if (!this.elements.toggle) return;
        
        // Initialize audio element
        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.volume = 0.4; // 40% volume by default
        
        // Event listeners
        this.elements.toggle.addEventListener('click', () => this.toggle());
        this.elements.prev.addEventListener('click', () => this.previousTrack());
        this.elements.next.addEventListener('click', () => this.nextTrack());
        
        // Audio events
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('loadstart', () => this.setLoading(true));
        this.audio.addEventListener('canplay', () => this.setLoading(false));
        this.audio.addEventListener('error', () => this.handleError());
        
        // Load first track (paused)
        this.loadTrack(0, false);
        this.updateDisplay();
    }

    playFromPreloader() {
        // Attempt to bypass browser autoplay restrictions by using a muted audio trick
        const muteAndRetry = () => {
            this.audio.muted = true;
            this.audio.play().then(() => {
                // Now unmute since we have a user gesture
                this.audio.muted = false;
                this.isPlaying = true;
                this.updatePlayingState();
            }).catch(() => {
                // If muted play also fails, wait for user click
                this.setupUserGesturePlayback();
            });
        };
        
        // First try normal playback
        this.play().catch(() => {
            // If that fails, try muted + unmute trick
            muteAndRetry();
        });
    }

    updatePlayingState() {
        this.elements.toggle.classList.add('playing');
        this.elements.toggle.classList.remove('paused');
        this.elements.playIcon.classList.add('hidden');
        this.elements.pauseIcon.classList.remove('hidden');
        this.elements.trackStatus.textContent = 'Now Playing';
    }


    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    setupUserGesturePlayback() {
        const userGestureHandler = () => {
            if (this.isPlaying || this.isLoading) return;

            this.play().finally(() => {
                // Remove the listener after attempting playback once.
                document.removeEventListener('click', userGestureHandler);
                document.removeEventListener('keydown', userGestureHandler);
                document.removeEventListener('touchstart', userGestureHandler);
            });
        };

        document.addEventListener('click', userGestureHandler, { once: true, passive: true });
        document.addEventListener('keydown', userGestureHandler, { once: true, passive: true });
        document.addEventListener('touchstart', userGestureHandler, { once: true, passive: true });

        // If autoplay is blocked and the user hasn't interacted yet, show a helpful prompt.
        setTimeout(() => {
            if (!this.isPlaying) {
                this.elements.trackStatus.textContent = 'Click to play';
            }
        }, 2500);
    }

    play() {
        if (this.isLoading) return Promise.resolve();
        
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            return playPromise.then(() => {
                this.isPlaying = true;
                this.updatePlayingState();
                this.updateDisplay();
            }).catch(err => {
                console.log('Audio play failed:', err);
                this.elements.trackStatus.textContent = 'Click to play';
                return Promise.reject(err);
            });
        }
        return Promise.resolve();
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.elements.toggle.classList.remove('playing');
        this.elements.toggle.classList.add('paused');
        this.elements.playIcon.classList.remove('hidden');
        this.elements.pauseIcon.classList.add('hidden');
        this.elements.trackStatus.textContent = 'Paused';
    }
    
    loadTrack(index, autoPlay = true) {
        this.currentTrack = index;
        const track = this.tracks[index];
        
        // Update source
        this.audio.src = `audio/${track.file}`;
        this.updateDisplay();
        
        if (autoPlay && this.isPlaying) {
            this.audio.play().catch(() => {
                this.pause();
            });
        }
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack(this.currentTrack, this.isPlaying);
        
        // Visual feedback
        this.pulseButton(this.elements.next);
    }
    
    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(this.currentTrack, this.isPlaying);
        
        // Visual feedback
        this.pulseButton(this.elements.prev);
    }
    
    pulseButton(button) {
        button.style.transform = 'scale(0.9)';
        button.style.background = 'rgba(45, 158, 92, 0.3)';
        setTimeout(() => {
            button.style.transform = '';
            button.style.background = '';
        }, 150);
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        if (loading) {
            this.elements.trackStatus.textContent = 'Loading...';
            this.elements.toggle.classList.add('audio-loading');
        } else {
            this.elements.toggle.classList.remove('audio-loading');
            if (this.isPlaying) {
                this.elements.trackStatus.textContent = 'Now Playing';
            }
        }
    }
    
    handleError() {
        this.elements.trackStatus.textContent = 'Error loading';
        this.isPlaying = false;
        this.updateIcons();
    }
    
    updateIcons() {
        if (this.isPlaying) {
            this.elements.playIcon.classList.add('hidden');
            this.elements.pauseIcon.classList.remove('hidden');
        } else {
            this.elements.playIcon.classList.remove('hidden');
            this.elements.pauseIcon.classList.add('hidden');
        }
    }
    
    updateDisplay() {
        const track = this.tracks[this.currentTrack];
        if (track && this.elements.trackName) {
            this.elements.trackName.textContent = track.name;
        }
    }
    
    // Public method to set specific track
    setTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.loadTrack(index, false);
            this.pause();
        }
    }
    
    // Public method to get current track info
    getCurrentTrack() {
        return this.tracks[this.currentTrack];
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AudioPlayer FIRST (before Preloader so music can play during intro)
    const audioPlayer = new AudioPlayer();
    
    // Initialize Preloader with AudioPlayer reference
    const preloader = new Preloader(audioPlayer);
    
    // Wait for preloader to finish before initializing heavy components
    window.addEventListener('preloaderComplete', () => {
        // Initialize all other components after preloader
        new ParticleSystem();
        new ThreeJSScene();
        new ScrollAnimations();
        new Navbar();
        new CharacterCards();
        new SmoothScroll();
        new CTAButton();
        new ParallaxEffect();
    });
    
    // Add loading animation for body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}
