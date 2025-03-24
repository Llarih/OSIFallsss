import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

// Configuração inicial da cena
const scene = new THREE.Scene(); // Cria a cena principal onde todos os objetos serão adicionados
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Configura a câmera com perspectiva
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Cria o renderizador com suavização de bordas
renderer.setSize(window.innerWidth, window.innerHeight); // Define o tamanho do renderizador para ocupar toda a janela
renderer.shadowMap.enabled = true; // Habilita sombras no renderizador
document.getElementById('threejs-container').appendChild(renderer.domElement); // Adiciona o canvas do renderizador ao HTML

// Ajusta o renderizador ao redimensionar a janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // Atualiza a proporção da câmera
    camera.updateProjectionMatrix(); // Recalcula a matriz de projeção
    renderer.setSize(window.innerWidth, window.innerHeight); // Ajusta o tamanho do renderizador
});

// Define o fundo da cena como azul claro (simulando o céu)
scene.background = new THREE.Color(0x87ceeb);

// Adiciona luzes à cena
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Luz ambiente para iluminação geral
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direcional para criar sombras
directionalLight.position.set(10, 20, 10); // Define a posição da luz
directionalLight.castShadow = true; // Habilita sombras para a luz direcional
scene.add(directionalLight);

// Cria o chão com textura de grama
const textureLoader = new THREE.TextureLoader(); // Carregador de texturas
const grassTexture = textureLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg'); // Carrega a textura de grama
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; // Configura a textura para repetir
grassTexture.repeat.set(10, 10); // Define o número de repetições da textura
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50), // Cria um plano de 50x50 unidades
    new THREE.MeshStandardMaterial({ map: grassTexture }) // Aplica a textura de grama ao material
);
plane.rotation.x = -Math.PI / 2; // Rotaciona o plano para ficar horizontal
plane.receiveShadow = true; // Permite que o plano receba sombras
scene.add(plane);

// Função para criar uma antena ajustada
function createBeautifulAntenna() {
    const antennaGroup = new THREE.Group(); // Cria um grupo para agrupar os componentes da antena

    // Base sólida da antena
    const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32); // Geometria cilíndrica para a base
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 }); // Material metálico para a base
    const base = new THREE.Mesh(baseGeometry, baseMaterial); // Cria a malha da base
    base.position.y = 0.25; // Eleva a base ligeiramente acima do chão
    base.castShadow = true; // Permite que a base projete sombras
    antennaGroup.add(base); // Adiciona a base ao grupo da antena

    // Mastro principal da antena
    const poleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 5, 32); // Geometria cilíndrica para o mastro
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 }); // Material metálico para o mastro
    const pole = new THREE.Mesh(poleGeometry, poleMaterial); // Cria a malha do mastro
    pole.position.y = 2.75; // Posiciona o mastro acima da base
    pole.castShadow = true; // Permite que o mastro projete sombras
    antennaGroup.add(pole); // Adiciona o mastro ao grupo da antena

    // Prato parabólico da antena
    const dishGeometry = new THREE.CylinderGeometry(1.5, 0.1, 0.5, 32, 1, true); // Geometria para o prato parabólico
    const dishMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.2,
        side: THREE.DoubleSide, // Renderiza os dois lados do prato
    });
    const dish = new THREE.Mesh(dishGeometry, dishMaterial); // Cria a malha do prato
    dish.rotation.x = Math.PI / 3; // Inclina o prato para cima
    dish.position.y = 5.5; // Posiciona o prato no topo do mastro
    dish.castShadow = true; // Permite que o prato projete sombras
    antennaGroup.add(dish); // Adiciona o prato ao grupo da antena

    return antennaGroup; // Retorna o grupo completo da antena
}

// Adiciona a antena à cena
const beautifulAntenna = createBeautifulAntenna();
beautifulAntenna.position.set(0, 0, 0); // Centraliza a antena na cena
scene.add(beautifulAntenna);

// Função para criar ondas que saem do prato parabólico
const waves = [];
function createWave() {
    const waveGeometry = new THREE.RingGeometry(1, 1.2, 64); // Geometria de anel para a onda
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff, // Cor azul para a onda
        side: THREE.DoubleSide, // Renderiza os dois lados da onda
        transparent: true, // Permite transparência
        opacity: 0.5, // Define a opacidade inicial
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial); // Cria a malha da onda
    wave.rotation.x = -Math.PI / 2; // Rotaciona a onda para ficar horizontal
    wave.position.set(0, 5.5, 0); // Posiciona a onda no centro do prato parabólico
    scene.add(wave); // Adiciona a onda à cena
    waves.push(wave); // Armazena a onda no array para animação
}

// Função de animação para as ondas
function animateWaves() {
    waves.forEach((wave, index) => {
        wave.scale.x += 0.03; // Expande a onda no eixo X
        wave.scale.y += 0.05; // Expande a onda no eixo Y
        wave.material.opacity -= 0.003; // Reduz a opacidade gradualmente
        if (wave.material.opacity <= 0) {
            scene.remove(wave); // Remove a onda da cena quando ela desaparece
            waves.splice(index, 1); // Remove a onda do array
        }
    });

    if (waves.length === 0 || waves[waves.length - 1].scale.x > 2) {
        createWave(); // Cria uma nova onda quando necessário
    }
}

// Função para criar árvores realistas com movimento suave das folhas
function createRealisticTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 16); // Tronco maior e mais detalhado
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Cor marrom
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 2, z); // Posiciona o tronco
    trunk.castShadow = true;

    const foliageGroup = new THREE.Group(); // Grupo para as camadas de folhagem
    for (let i = 0; i < 3; i++) {
        const foliageGeometry = new THREE.SphereGeometry(1.5 - i * 0.4, 16, 16); // Camadas de folhagem menores no topo
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 }); // Cor verde
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(0, 3 + i * 1.2, 0); // Posiciona cada camada de folhagem
        foliage.castShadow = true;
        foliageGroup.add(foliage);
    }

    foliageGroup.position.set(x, 0, z); // Posiciona o grupo de folhagem
    foliageGroup.userData = { swaySpeed: Math.random() * 0.02 + 0.01 }; // Velocidade de movimento das folhas

    scene.add(trunk);
    scene.add(foliageGroup);
    return foliageGroup;
}

// Adiciona árvores realistas ao cenário
const trees = [];
trees.push(createRealisticTree(-5, -5));
trees.push(createRealisticTree(5, -5));
trees.push(createRealisticTree(-5, 5));
trees.push(createRealisticTree(5, 5));

// Função para criar nuvens
function createCloud(x, y, z) {
    const cloudGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const cloudGeometry = new THREE.SphereGeometry(1 - Math.random() * 0.3, 16, 16);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
        });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
            x + Math.random() * 2 - 1,
            y + Math.random() * 0.5 - 0.25,
            z + Math.random() * 2 - 1
        );
        cloud.castShadow = false;
        cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);
    return cloudGroup;
}

// Adiciona nuvens ao céu
const clouds = [];
clouds.push(createCloud(-10, 10, -10));
clouds.push(createCloud(0, 12, -15));
clouds.push(createCloud(10, 10, -10));

// Função para criar um pássaro mais bonito e detalhado
function createBeautifulBird() {
    const birdGroup = new THREE.Group();

    // Corpo do pássaro
    const bodyGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Corpo arredondado
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.3, roughness: 0.7 }); // Amarelo vibrante
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0, 0);
    birdGroup.add(body);

    // Cabeça do pássaro
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32); // Cabeça menor e arredondada
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.3, roughness: 0.7 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.4, 0.3); // Posiciona a cabeça acima do corpo
    birdGroup.add(head);

    // Bico do pássaro
    const beakGeometry = new THREE.ConeGeometry(0.05, 0.2, 16); // Geometria do bico
    const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Cor vermelha vibrante
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 0.45, 0.5); // Posiciona o bico na frente da cabeça
    beak.rotation.x = Math.PI / 2; // Rotaciona o bico para apontar para frente
    birdGroup.add(beak);

    // Olhos do pássaro
    const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 16); // Geometria dos olhos
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Cor branca para os olhos
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.5, 0.35); // Posiciona o olho esquerdo
    rightEye.position.set(0.1, 0.5, 0.35); // Posiciona o olho direito
    birdGroup.add(leftEye);
    birdGroup.add(rightEye);

    // Pupilas
    const pupilGeometry = new THREE.SphereGeometry(0.01, 16, 16); // Geometria das pupilas
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Cor preta para as pupilas
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.1, 0.5, 0.38); // Posiciona a pupila esquerda
    rightPupil.position.set(0.1, 0.5, 0.38); // Posiciona a pupila direita
    birdGroup.add(leftPupil);
    birdGroup.add(rightPupil);

    // Asas do pássaro
    const wingGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.3); // Geometria das asas
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Amarelo para combinar com o corpo
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.4, 0, 0); // Posiciona a asa esquerda
    rightWing.position.set(0.4, 0, 0); // Posiciona a asa direita
    birdGroup.add(leftWing);
    birdGroup.add(rightWing);

    // Cauda do pássaro
    const tailGeometry = new THREE.ConeGeometry(0.1, 0.3, 16); // Geometria da cauda
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Amarelo para combinar com o corpo
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, -0.2, -0.3); // Posiciona a cauda atrás do corpo
    tail.rotation.x = Math.PI / 2; // Rotaciona a cauda para apontar para trás
    birdGroup.add(tail);

    birdGroup.userData = { leftWing, rightWing, wingSpeed: Math.random() * 0.02 + 0.03 };
    birdGroup.position.set(-10, 8, -5); // Posição inicial do pássaro
    birdGroup.rotation.y = Math.PI / 2; // Rotaciona o pássaro para frente
    scene.add(birdGroup);

    return birdGroup;
}

// Substitui o pássaro antigo pelo novo pássaro mais bonito
const bird = createBeautifulBird();

// Função de animação principal
function animate() {
    requestAnimationFrame(animate);

    // Movimento das folhas das árvores
    trees.forEach((tree) => {
        const swaySpeed = tree.userData.swaySpeed;
        tree.rotation.z = Math.sin(Date.now() * swaySpeed) * 0.03; // Movimento suave das folhas
    });

    // Movimento das nuvens
    clouds.forEach((cloudGroup) => {
        cloudGroup.position.x += 0.01;
        if (cloudGroup.position.x > 15) cloudGroup.position.x = -15;
    });

    // Movimento do pássaro
    bird.position.x += 0.05;
    if (bird.position.x > 15) bird.position.x = -15;
    bird.userData.leftWing.rotation.z = Math.sin(Date.now() * bird.userData.wingSpeed) * 0.5;
    bird.userData.rightWing.rotation.z = -Math.sin(Date.now() * bird.userData.wingSpeed) * 0.5;

    // Animação das ondas
    animateWaves();

    renderer.render(scene, camera);
}

// Configuração inicial da câmera
camera.position.set(0, 8, 15); // Aproxima a câmera da cena
camera.lookAt(0, 0, 0); // Faz a câmera olhar para o centro da cena

// Inicia a animação
animate();
