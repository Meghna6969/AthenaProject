import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const beforePlayModels = [];
const cooldown_duration = 2000;
let isPlayEnabled = true;

const MOUSE_MOVE_THRESHOLD = 0.05;
const ORBIT_SPEED = 0.001;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

const MODEL_PATHS = {
    'Rock': './Rock.glb',
    'Paper': './Paper.glb',
    'Scissors': './Scissors.glb',
    'Spock': './Spock.glb',
    'Lizard': './Lizard.glb'
}

//const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);
//const gridHelper = new THREE.GridHelper(100, 10);
//scene.add(gridHelper);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const defaultSettings = {
    enableDamping: true,
    dampingFactor: 0.05,
    rotateSpeed: 0.5,
    maxPolarAngle: Math.PI / 1.8,
    minPolarAngle: Math.PI / 2.5,
    enableZoom: false,
    enablePan: false,
    enabled: false,
    minAzimuthAngle: -Math.PI / 4,
    maxAzimuthAngle: Math.PI / 4
}

const devSettings = {
    enableDamping: true,
    dampingFactor: 0.05,
    rotateSpeed: 0.5,
    enableZoom: true,
    enablePan: true,
    minDistance: 2,
    maxDistance: 100,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity
};
function toggleControlMode(isDev = false){
    const settings = isDev ? devSettings : defaultSettings;
    Object.assign(controls, settings);
}
toggleControlMode(false);

const toonMaterial = new THREE.MeshToonMaterial({
    color: 0xf0f8ff,     
    emissive: 0x406f9c,   
    emissiveIntensity: 1,
});
const toonMaterial2 = new THREE.MeshToonMaterial({
    color: 0xf0f8ff,
    emissive: 0xf0f8ff,
    emissiveIntensity: 0.38
});

loader.load('./Cloud1.glb',
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(140,40,-180);
        model.traverse((child) => {
            if (child.isMesh){
                child.material = toonMaterial;
            }
        })
        scene.add(model);

        console.log('Model loaded successfully');
    },
    function (xhr){
        console.log((xhr.loaded/xhr.total * 100) + '% loaded');
    },
    function (error){
        console.error('An error occured loading the model:', error);
    }
)
loader.load('./Cloud2.glb', 
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(-140, 30, -180);
        model.traverse((child) => {
            if(child.isMesh){
                child.material = toonMaterial;
            }
        })
        scene.add(model);
    }
)
loader.load('./Cloud3.glb',
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(-80, -30, -100);
        model.traverse((child) => {
            if(child.isMesh){
                child.material = toonMaterial2;
                child.material.transparent = true;
                child.material.opacity = 0.9;
            }
        })
        scene.add(model);
    }
)
loader.load('./Cloud4.glb', 
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(30,-6,-150);
        model.traverse((child) => {
            if(child.isMesh){
                child.material = toonMaterial2;
            }
        })
        scene.add(model);
    }
)
//Computer hand
loader.load('./Rock.glb',
    function(gltf){
        const model = gltf.scene;
        model.position.set(-0.7,0,-2);
        model.scale.set(0.02,0.02,0.02);
        model.traverse((child) => {
            if(child.isMesh){
                child.material.emissive = new THREE.Color(0xa35e48);
                child.material.emissiveIntensity = 1;
            }
        })
        beforePlayModels.push(model);
        scene.add(model);
    }
)
//Player hand
loader.load('./Rock.glb',
    function(gltf){
        const model = gltf.scene;
        model.position.set(0.7,0,-2);
        model.scale.set(-0.02,0.02,0.02);
        model.traverse((child) => {
            if(child.isMesh){
                child.material.emissive = new THREE.Color(0xa35e48);
                child.material.emissiveIntensity = 1;
            }
        })
        beforePlayModels.push(model)
        scene.add(model);
    }
)
const vertexShader = `
 varying vec3 vWorldPosition;
 void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
 }`;

const fragmentShader = `
varying vec3 vWorldPosition;
void main() {
    vec3 topColor = vec3(0.62, 0.89, 1.76); //Light blue
    vec3 bottomColor = vec3(0.702, 0.953, 1); //Dark blue
    float h = normalize(vWorldPosition).y;
    gl_FragColor = vec4(mix(bottomColor, topColor, max(h + 0.2, 0.0)), 1.0);
}`;


const skyGeo = new THREE.SphereGeometry(300, 32, 32);
const skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0,1,1);
scene.add(directionalLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(0,1,0);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff,0.5);
fillLight.position.set(-1,0.5,-1);
scene.add(fillLight);



camera.position.set(0,0,0);

function shakeModels(callback) {
    const duration = 500;
    const startTime = Date.now();

    setButtonsEnabled(false);

    function animate(){
        const elasped = Date.now() - startTime;
        const progress = elasped / duration;

        if(progress < 1){
            beforePlayModels.forEach(model => {
                const offsetX = Math.sin(progress * Math.PI * 8) * 0.05;
                const offsetY = Math.sin(progress * Math.PI * 6) * 0.05;

                model.position.x = model.userData.originalX + offsetX;
                model.position.y = model.userData.originalY + offsetY;
            });
            requestAnimationFrame(animate);
        } else {
            beforePlayModels.forEach(model => {
                model.position.x = model.userData.originalX;
                model.position.y = model.userData.originalY;
            });
            if(callback) callback();
        }
    }
    beforePlayModels.forEach(model => {
        model.userData.originalX = model.position.x;
        model.userData.originalY = model.position.y;
    });

    animate();
}
function setButtonsEnabled(enabled) {
    document.querySelectorAll('.options button').forEach(button => {
        button.diabled = !enabled;
        button.style.opacity = enabled ? '1' : '0.5';
        button.style.cursor = enabled ? 'pointer' : 'not-allowed';
    });
}
async function switchModels(playerChoice){
    if(!isPlayEnabled) return;
    isPlayEnabled = false;

    const computerChoice = getComputerChoice();
    const leftPos = new THREE.Vector3(-0.7, 0, -2);
    const rightPos = new THREE.Vector3(0.7, 0, -2);
    const scale = 0.02;

    beforePlayModels.forEach(model => {
        scene.remove(model);
    });
    beforePlayModels.length = 0;

    const [computerModel, playerModel] = await Promise.all([
        loadModel(MODEL_PATHS[computerChoice], leftPos, scale, false),
        loadModel(MODEL_PATHS[playerChoice], rightPos, scale, true)
    ]);

    scene.add(computerModel);
    scene.add(playerModel);
    beforePlayModels.push(computerModel, playerModel);

    const result = determineWinner(playerChoice, computerChoice);

    const overlay = document.querySelector('.overlay');
    const resultText = document.querySelector('h1');
    resultText.style.fontSize = '32px';
    resultText.style.marginTop = '20px';
    resultText.textContent = `${result}`;

    const oldResult = overlay.querySelector('p');
    if(oldResult){
        overlay.removeChild(oldResult);
    }

    overlay.appendChild(resultText);

    console.log(`Computer chose: ${computerChoice}, Player chose: ${playerChoice}`);
    console.log(result);
    setTimeout(() => {
        isPlayEnabled = true;
        setButtonsEnabled(true);
    }, cooldown_duration);
}
function loadModel(modelPath, position, scale, isFlipped = false){
    return new Promise((resolve) => {
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            model.position.copy(position);
            model.scale.set(
                isFlipped ? -scale : scale,
                scale,
                scale
            );
            model.traverse((child) => {
                if(child.isMesh){
                    child.material.emissive = new THREE.Color(0xa35e48);
                    child.material.emissiveIntensity = 1;
                }
            });
            resolve(model);
        })
    })
}
function getComputerChoice(){
    const choices = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}
function determineWinner(playerChoice, computerChoice){
    const rules = {
        'Rock': ['Scissors', 'Lizard'],
        'Paper': ['Rock', 'Spock'],
        'Scissors': ['Paper', 'Lizard'],
        'Spock': ['Scissors', 'Rock'],
        'Lizard': ['Spock', 'Paper']
    };

    if(playerChoice === computerChoice){
        return "Tie!";
    }
    if(rules[playerChoice].includes(computerChoice)){
        return "You Win!";
    }
    return "Computer Wins!";

}
function setupMouseMove(){
    document.addEventListener('mousemove', (event) => {
        targetX = (event.clientX / window.innerWidth) * 2 - 1;
        targetY = -((event.clientY / window.innerHeight) * 2 - 1);
    });
}

function animate(){
    requestAnimationFrame(animate);

    currentX += (targetX - currentX) * MOUSE_MOVE_THRESHOLD;
    currentY += (targetY - currentY) * MOUSE_MOVE_THRESHOLD;

    const horizontalRadius = 0.15;
    const verticalMovement = 0.1;
    const baseZ = 2;

    camera.position.x = horizontalRadius * Math.sin(currentX * Math.PI * 0.5);
    camera.position.y = currentY * verticalMovement;

    camera.position.z = baseZ - horizontalRadius * (1 - Math.cos(currentX * Math.PI * 0.5));

    camera.lookAt(0, 0, -1);

    controls.update();
    renderer.render(scene, camera);
}
animate();
camera.position.set(0, 0, 0.1);
setupMouseMove();


window.addEventListener('keydown', (event) => {
    if(event.key.toLowerCase() === 'd'){
        toggleControlMode(true);
        console.log('Developer mode enabled');
    }
    if(event.key.toLowerCase() === 's'){
        toggleControlMode(false);
        console.log('Subtle movement mode enabled');
    }
})
document.querySelectorAll('.options button').forEach(button => {
    button.addEventListener('click', () => {
        if(!isPlayEnabled) return;
        const playerChoice = button.textContent;
        shakeModels(() => {
            switchModels(playerChoice);
        });
    });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})