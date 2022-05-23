import './style.css'
import * as THREE from 'three';
import {
    gsap
} from "gsap";
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
const canvas = document.querySelector('canvas.bg')
const scene = new THREE.Scene()

// Loading Manager
const loadingManager = new THREE.LoadingManager(() => {
    //loading screen
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
});

/**
 * Objects
 */
const objectsDistance = 4
const pi = Math.PI

// Material
const material = new THREE.MeshStandardMaterial({
    color: '#C0C0C0',
    roughness: 0.5,
    metalness: 0.9,
    flatShading: true,
})

// Models
const loader = new GLTFLoader(loadingManager);
const [startData, booksData, toolsData, project1Data, project2Data, project3Data] = await Promise.all([
    loader.loadAsync('/models/jakob.glb'),
    loader.loadAsync('/models/books.glb'),
    loader.loadAsync('/models/doublediamond.glb'),
    loader.loadAsync('/models/gm.glb'),
    loader.loadAsync('/models/slx.glb'),
    loader.loadAsync('/models/vbo.glb'),
]);

// 0 - start
const start = setupModel(startData);
start.scale.set(5.7, 5.7, 5.7);
start.position.y = -objectsDistance * 0;
start.position.x = 2;
scene.add(start)

// 1 - books
const books = setupModel(booksData);
books.scale.set(4, 4, 4);
books.position.y = -objectsDistance * 1;
books.position.x = -2;
books.rotation.y = pi;
scene.add(books)

// 2 - tools
const tools = setupModel(toolsData);
tools.scale.set(5.7, 5.7, 5.7);
tools.position.y = -objectsDistance * 2;
tools.position.x = 2;
tools.rotation.y = pi;
scene.add(tools)

// 3 - projekt
const projekt = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
projekt.position.y = -objectsDistance * 3
projekt.position.x = -2

// 4 - project1 - gm
const project1 = setupModel(project1Data);
project1.scale.set(5.7, 5.7, 5.7);
project1.position.y = -objectsDistance * 4
project1.position.x = 2;
project1.rotation.y = pi;
scene.add(project1)

// 5 - project2 - slx
const project2 = setupModel(project2Data);
project2.scale.set(6, 6, 6);
project2.position.y = -objectsDistance * 5
project2.position.x = -2
project2.rotation.y = pi;
scene.add(project2)

// 6 - project3 - vbo
const project3 = setupModel(project3Data);
project3.scale.set(5.7, 5.7, 5.7);
project3.position.y = -objectsDistance * 6
project3.position.x = 2
project3.rotation.y = pi;
scene.add(project3)

// 7 - contact
const contact = new THREE.Mesh(
    new THREE.OctahedronGeometry(1, 2),
    material
)
contact.position.y = -objectsDistance * 7
contact.position.x = -2

// add objects to array and scene
const objectsArr = [start, books, tools, projekt, project1, project2, project3, contact]
scene.add(start, books, tools, projekt, project1, project2, project3, contact)

function setupModel(data) {
    const model = data.scene.children[0];
    return model;
}

/**
 * Particles
 */
// Geometry
const particlesCount = 2000
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10 //x
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * objectsArr.length //y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 //z
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const createLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    camera.add(pointLight);
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)
})

/**
 * Scroll
 */
const initScroll = () => {
    let scrollY = window.scrollY
    let currentSection = 0

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY
        const newSection = Math.round(scrollY / sizes.height)

        if (newSection != currentSection) {
            // turn old section object
            gsap.to(
                objectsArr[currentSection].rotation, {
                    duration: 1,
                    ease: 'power2.inOut',
                    y: '+=3.1415'
                },
            )

            currentSection = newSection
            // turn new section object
            gsap.to(
                objectsArr[currentSection].rotation, {
                    duration: 1,
                    ease: 'power2.inOut',
                    y: '+=3.1415',
                }, "<" //The start of previous animation
            )
        }
    })
}

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 8
scene.add(camera)
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate meshes
    projekt.rotation.x += deltaTime * 0.15
    projekt.rotation.y += deltaTime * 0.25
    projekt.rotation.z += deltaTime * 0.25

    contact.rotation.x += deltaTime * 0.25
    contact.rotation.y += deltaTime * 0.15
    contact.rotation.z += deltaTime * 0.10

    // Animate camera
    camera.position.y = -scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

async function main() {
    //init
    createLights();
    initScroll();

    // start the animation loop
    tick();
};

main().catch((err) => {
    console.error(err);
});