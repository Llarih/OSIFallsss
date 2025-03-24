import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

// Configuração inicial da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('threejs-container').appendChild(renderer.domElement);

// Ajusta o renderizador ao redimensionar a janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Define o fundo da cena
scene.background = new THREE.Color(0x87ceeb); // Azul claro (céu)

// Adiciona luzes à cena
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Luz ambiente
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Função para criar o chão
function createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc2b280 }); // Bege
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Deixa o plano horizontal
    floor.receiveShadow = true;
    return floor;
}

// Adiciona o chão à cena
const floor = createFloor();
scene.add(floor);

// Função para criar paredes
function createWalls() {
    const wallGroup = new THREE.Group();

    const wallGeometry = new THREE.BoxGeometry(20, 10, 0.5); // Geometria das paredes
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc }); // Bege claro

    // Parede traseira
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 5, -10);
    backWall.receiveShadow = true;
    wallGroup.add(backWall);

    // Parede esquerda
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 5, 0);
    leftWall.receiveShadow = true;
    wallGroup.add(leftWall);

    return wallGroup;
}

// Adiciona as paredes à cena
const walls = createWalls();
scene.add(walls);

// Função para criar uma mesa
function createTable() {
    const tableGroup = new THREE.Group();

    // Tampo da mesa
    const topGeometry = new THREE.BoxGeometry(8, 0.3, 6);
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Marrom
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.set(0, 1, 0); // Mesa na posição normal
    top.castShadow = true;
    tableGroup.add(top);

    // Pernas da mesa
    const legGeometry = new THREE.BoxGeometry(0.3, 2, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const legPositions = [
        [-3.5, 0, -2.5], [3.5, 0, -2.5],
        [-3.5, 0, 2.5], [3.5, 0, 2.5],
    ];
    legPositions.forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(x, y, z);
        leg.castShadow = true;
        tableGroup.add(leg);
    });

    return tableGroup;
}

// Adiciona a mesa à cena
const table = createTable();
scene.add(table);

// Função para criar uma NIC (placa de rede) sem bolinhas azuis
function createNICWithoutGlows() {
    const nicGroup = new THREE.Group();

    // Placa base da NIC
    const baseGeometry = new THREE.BoxGeometry(5, 0.1, 3);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 }); // Verde claro
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 1.2, 0);
    base.castShadow = true;
    nicGroup.add(base);

    // Chip central
    const chipGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const chipMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Preto
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0, 1.3, 0);
    chip.castShadow = true;
    nicGroup.add(chip);

    // Conector da NIC
    const connectorGeometry = new THREE.BoxGeometry(0.5, 0.3, 1);
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Cinza
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.set(-2.2, 1.25, 0);
    connector.castShadow = true;
    nicGroup.add(connector);

    return nicGroup;
}

// Substitui a NIC existente por uma sem bolinhas azuis
const nicWithoutGlows = createNICWithoutGlows();
scene.add(nicWithoutGlows);

// Função para criar uma NIC (placa de rede) com luzes azuis neon
function createNICWithNeonGlows() {
    const nicGroup = new THREE.Group();

    // Placa base da NIC
    const baseGeometry = new THREE.BoxGeometry(5, 0.1, 3);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 }); // Verde claro
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 1.2, 0);
    base.castShadow = true;
    nicGroup.add(base);

    // Chip central
    const chipGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const chipMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Preto
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0, 1.3, 0);
    chip.castShadow = true;
    nicGroup.add(chip);

    // Luzes azuis neon nas extremidades do chip
    const glowGeometry = new THREE.CircleGeometry(0.1, 16); // Geometria do brilho
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff, // Azul neon
        transparent: true,
        opacity: 0.8,
    });
    const glows = [];
    const glowPositions = [
        [-0.4, 1.4, -0.4], [0.4, 1.4, -0.4], // Frente esquerda e direita
        [-0.4, 1.4, 0.4], [0.4, 1.4, 0.4],   // Traseira esquerda e direita
    ];
    glowPositions.forEach(([x, y, z]) => {
        const glow = new THREE.Mesh(glowGeometry, glowMaterial.clone());
        glow.position.set(x, y, z);
        glow.rotation.x = -Math.PI / 2; // Deixa o brilho horizontal
        nicGroup.add(glow);
        glows.push(glow);
    });

    // Animação para as luzes neon brilharem
    function animateNeonGlows() {
        glows.forEach((glow, index) => {
            glow.material.opacity = 0.5 + Math.abs(Math.sin(Date.now() * 0.005 + index)) * 0.5; // Brilho pulsante
        });
        requestAnimationFrame(animateNeonGlows);
    }
    animateNeonGlows();

    // Conector da NIC
    const connectorGeometry = new THREE.BoxGeometry(0.5, 0.3, 1);
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Cinza
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.set(-2.2, 1.25, 0);
    connector.castShadow = true;
    nicGroup.add(connector);

    return nicGroup;
}

// Substitui a NIC existente por uma com luzes azuis neon
const nicWithNeonGlows = createNICWithNeonGlows();
scene.add(nicWithNeonGlows);

// Função para criar uma NIC (placa de rede) com pequenos brilhos piscando e resistores girando
function createNICWithBlinkingGlowsAndRotatingResistors() {
    const nicGroup = new THREE.Group();

    // Placa base da NIC
    const baseGeometry = new THREE.BoxGeometry(5, 0.1, 3);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 }); // Verde claro
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 1.2, 0);
    base.castShadow = true;
    nicGroup.add(base);

    // Chip central
    const chipGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const chipMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Preto
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0, 1.3, 0);
    chip.castShadow = true;
    nicGroup.add(chip);

    // Quatro pequenos brilhos azuis nas extremidades do chip
    const glowGeometry = new THREE.CircleGeometry(0.1, 16); // Geometria do brilho
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff, // Azul
        transparent: true,
        opacity: 0.8,
    });
    const glows = [];
    const glowPositions = [
        [-0.4, 1.4, -0.4], [0.4, 1.4, -0.4], // Frente esquerda e direita
        [-0.4, 1.4, 0.4], [0.4, 1.4, 0.4],   // Traseira esquerda e direita
    ];
    glowPositions.forEach(([x, y, z]) => {
        const glow = new THREE.Mesh(glowGeometry, glowMaterial.clone());
        glow.position.set(x, y, z);
        glow.rotation.x = -Math.PI / 2; // Deixa o brilho horizontal
        nicGroup.add(glow);
        glows.push(glow);
    });

    // Animação para as luzes piscarem
    function animateGlows() {
        glows.forEach((glow, index) => {
            glow.material.opacity = 0.5 + Math.abs(Math.sin(Date.now() * 0.005 + index)) * 0.5; // Pisca com intensidade variável
        });
        requestAnimationFrame(animateGlows);
    }
    animateGlows();

    // Resistores com animação de rotação
    const resistorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const resistorMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 }); // Laranja
    const resistorPositions = [
        [-1, 1.25, 0.5], [1, 1.25, -0.5],
    ];
    const resistors = [];
    resistorPositions.forEach(([x, y, z]) => {
        const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
        resistor.position.set(x, y, z);
        resistor.rotation.z = Math.PI / 2;
        resistor.castShadow = true;
        nicGroup.add(resistor);
        resistors.push(resistor);
    });

    // Animação de rotação dos resistores
    function animateResistors() {
        resistors.forEach(resistor => {
            resistor.rotation.y += 0.01; // Gira os resistores em torno do eixo Y
        });
        requestAnimationFrame(animateResistors);
    }
    animateResistors();

    // Conector da NIC
    const connectorGeometry = new THREE.BoxGeometry(0.5, 0.3, 1);
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Cinza
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.set(-2.2, 1.25, 0);
    connector.castShadow = true;
    nicGroup.add(connector);

    return nicGroup;
}

// Função para adicionar decorações e animações à NIC
function addNICDecorations(nicGroup) {
    // Capacitores
    const capacitorGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
    const capacitorMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Azul
    const capacitorPositions = [
        [-1.5, 1.25, -1], [1.5, 1.25, 1],
    ];
    capacitorPositions.forEach(([x, y, z]) => {
        const capacitor = new THREE.Mesh(capacitorGeometry, capacitorMaterial);
        capacitor.position.set(x, y, z);
        capacitor.castShadow = true;
        nicGroup.add(capacitor);
    });

    // Resistores com faixas coloridas
    const resistorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const resistorMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 }); // Laranja
    const resistorPositions = [
        [-1, 1.25, 0.5], [1, 1.25, -0.5],
    ];
    resistorPositions.forEach(([x, y, z]) => {
        const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
        resistor.position.set(x, y, z);
        resistor.rotation.z = Math.PI / 2;
        resistor.castShadow = true;
        nicGroup.add(resistor);

        // Faixas coloridas nos resistores
        const stripeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
        const stripeColors = [0xffff00, 0x000000, 0xff0000]; // Amarelo, preto, vermelho
        stripeColors.forEach((color, index) => {
            const stripeMaterial = new THREE.MeshStandardMaterial({ color });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.set(x, y, z + (index - 1) * 0.15);
            stripe.rotation.z = Math.PI / 2;
            nicGroup.add(stripe);
        });
    });

    // Trilhas decorativas com animação de brilho
    const trackMaterial = new THREE.LineBasicMaterial({ color: 0x808080 }); // Cinza metálico
    const trackPaths = [
        [[-2, 1.21, -1], [-1, 1.21, 0], [0, 1.21, 1]],
        [[2, 1.21, -1], [1, 1.21, 0], [0, 1.21, 1]],
    ];
    trackPaths.forEach(path => {
        const curve = new THREE.CatmullRomCurve3(path.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
        const trackGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
        const track = new THREE.Line(trackGeometry, trackMaterial);
        nicGroup.add(track);
    });

    // Animação de brilho nas trilhas
    function animateTracks() {
        trackMaterial.color.offsetHSL(0.001, 0, 0); // Muda a cor ao longo do tempo
        requestAnimationFrame(animateTracks);
    }
    animateTracks();
}

// Adiciona a NIC animada e suas decorações à cena
const nicWithLights = createNICWithBlinkingGlowsAndRotatingResistors();
addNICDecorations(nicWithLights);
scene.add(nicWithLights);

// Função para criar uma NIC (placa de rede) com múltiplos raios verdes escuros translúcidos movendo-se aleatoriamente dentro da placa
function createNICWithMultipleRandomDataEffects() {
    const nicGroup = new THREE.Group();

    // Placa base da NIC
    const baseGeometry = new THREE.BoxGeometry(5, 0.1, 3);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 }); // Verde claro
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 1.2, 0);
    base.castShadow = true;
    nicGroup.add(base);

    // Chip central
    const chipGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const chipMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Preto
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0, 1.3, 0);
    chip.castShadow = true;
    nicGroup.add(chip);

    // Conector da NIC
    const connectorGeometry = new THREE.BoxGeometry(0.5, 0.3, 1);
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Cinza
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.set(-2.2, 1.25, 0);
    connector.castShadow = true;
    nicGroup.add(connector);

    // Função para criar um raio verde escuro translúcido
    function createRandomLine() {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x006400, // Verde escuro
            transparent: true,
            opacity: 0.3, // Translúcido
        });
        const linePoints = [
            new THREE.Vector3(0, 1.25, 0), // Ponto inicial dentro da placa
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        const line = new THREE.Line(lineGeometry, lineMaterial);

        // Animação do raio movendo-se aleatoriamente dentro da placa
        function animateLine() {
            const lastPoint = linePoints[linePoints.length - 1];
            const newPoint = lastPoint.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.2, // Movimento aleatório no eixo X
                0,                           // Mantém no mesmo plano Y
                (Math.random() - 0.5) * 0.2  // Movimento aleatório no eixo Z
            ));

            // Limita o movimento dentro da placa
            newPoint.x = THREE.MathUtils.clamp(newPoint.x, -2.5, 2.5);
            newPoint.z = THREE.MathUtils.clamp(newPoint.z, -1.5, 1.5);

            linePoints.push(newPoint);
            if (linePoints.length > 50) linePoints.shift(); // Remove pontos antigos para manter o tamanho do raio

            lineGeometry.setFromPoints(linePoints); // Atualiza a geometria
            requestAnimationFrame(animateLine);
        }
        animateLine();

        return line;
    }

    // Adiciona múltiplos raios à placa
    for (let i = 0; i < 5; i++) { // Adiciona 5 raios
        const randomLine = createRandomLine();
        nicGroup.add(randomLine);
    }

    return nicGroup;
}

// Substitui a NIC existente por uma com múltiplos raios aleatórios dentro da placa
const nicWithMultipleRandomDataEffects = createNICWithMultipleRandomDataEffects();
scene.add(nicWithMultipleRandomDataEffects);

// Função para criar uma estante de livros
function createBookshelf() {
    const shelfGroup = new THREE.Group();

    // Estrutura da estante
    const frameGeometry = new THREE.BoxGeometry(0.2, 5, 3);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Marrom

    const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    leftFrame.position.set(-7, 3, -8);
    shelfGroup.add(leftFrame);

    const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    rightFrame.position.set(-5, 3, -8);
    shelfGroup.add(rightFrame);

    // Prateleiras
    const shelfGeometry = new THREE.BoxGeometry(2.2, 0.1, 3);
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    for (let i = 0; i < 4; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.set(-6, 1 + i * 1.2, -8);
        shelfGroup.add(shelf);
    }

    return shelfGroup;
}

// Adiciona a estante à cena
const bookshelf = createBookshelf();
scene.add(bookshelf);

// Função para adicionar livros à estante
function addBooksToShelf(shelfGroup) {
    const bookGeometry = new THREE.BoxGeometry(0.4, 1, 0.2);
    const bookColors = [0xff4500, 0x1e90ff, 0x32cd32, 0xffff00, 0x8a2be2]; // Cores variadas

    const bookPositions = [
        { x: -6.5, y: 1.5, z: -8.5 },
        { x: -6.0, y: 2.7, z: -8.5 },
        { x: -5.5, y: 3.9, z: -8.5 },
        { x: -6.8, y: 5.1, z: -8.5 },
        { x: -5.2, y: 5.1, z: -8.5 },
    ];

    bookPositions.forEach((pos, index) => {
        const bookMaterial = new THREE.MeshStandardMaterial({ color: bookColors[index % bookColors.length] });
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.set(pos.x, pos.y, pos.z);
        book.castShadow = true;
        shelfGroup.add(book);
    });
}

// Adiciona livros à estante
addBooksToShelf(bookshelf);

// Função para criar uma flor mais realista em um vaso
function createRealisticFlowerInVase() {
    const flowerGroup = new THREE.Group();

    // Vaso
    const vaseGeometry = new THREE.CylinderGeometry(0.5, 0.3, 1.5, 32);
    const vaseMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 }); // Vermelho escuro
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.position.set(2, 0.75, -2);
    vase.castShadow = true;
    flowerGroup.add(vase);

    // Haste da flor
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 32);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 }); // Verde
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(2, 2, -2);
    stem.castShadow = true;
    flowerGroup.add(stem);

    // Pétalas da flor
    const petalGeometry = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI);
    const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 }); // Rosa
    const petalPositions = [
        [0, 0.2, 0.2], [0, 0.2, -0.2], [0.2, 0.2, 0], [-0.2, 0.2, 0],
    ];
    petalPositions.forEach(([x, y, z]) => {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.set(2 + x, 2.8 + y, -2 + z); // Ajusta a posição relativa ao caule
        petal.rotation.x = Math.PI / 2;
        petal.castShadow = true;
        flowerGroup.add(petal);
    });

    // Miolo da flor
    const centerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Amarelo
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.set(2, 3, -2); // Ajusta a posição no topo do caule
    center.castShadow = true;
    flowerGroup.add(center);

    return flowerGroup;
}

// Substitui o vaso de flor existente por um mais realista
const realisticFlowerInVase = createRealisticFlowerInVase();
scene.add(realisticFlowerInVase);

// Função para criar uma luminária que brilha
function createGlowingLamp() {
    const lampGroup = new THREE.Group();

    // Base da luminária
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(5, 1.1, -5);
    base.castShadow = true;
    lampGroup.add(base);

    // Haste da luminária
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(5, 2.6, -5);
    pole.castShadow = true;
    lampGroup.add(pole);

    // Abajur da luminária
    const shadeGeometry = new THREE.ConeGeometry(0.8, 1, 32);
    const shadeMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.5 });
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.set(5, 4, -5);
    shade.rotation.x = Math.PI;
    shade.castShadow = true;
    lampGroup.add(shade);

    // Luz da luminária
    const lampLight = new THREE.PointLight(0xffff00, 1, 10);
    lampLight.position.set(5, 4, -5);
    lampLight.castShadow = true;
    lampGroup.add(lampLight);

    return lampGroup;
}

// Substitui a luminária existente por uma que brilha
const glowingLamp = createGlowingLamp();
scene.add(glowingLamp);

// Função para criar um tapete
function createRug() {
    const rugGeometry = new THREE.PlaneGeometry(6, 4);
    const rugMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 }); // Dourado
    const rug = new THREE.Mesh(rugGeometry, rugMaterial);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, 0); // Levemente acima do chão
    rug.receiveShadow = true;
    return rug;
}

// Adiciona o tapete à cena
const rug = createRug();
scene.add(rug);

// Configuração inicial da câmera
camera.position.set(0, 8, 10); // Eleva a câmera para uma visão mais alta
camera.lookAt(0, 1.3, 0); // Faz a câmera focar no NIC

// Função de animação principal
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Inicia a animação
animate();