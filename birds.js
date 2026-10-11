const WIDTH = 800
const HEIGHT = 800
const BIRD_VISION = 50
const EAT_RADIUS = 6
const FRUIT_SPAWN_DELAY = 100
const FRUIT_SPAWN_RANGE = 275
const EAT_DELAY = 33
const SKULL_PERSISTENCE = 1000
const START_ENERGY = 50
const REPRODUCE_DELAY = 45
const HATCH_DELAY = 175
const BROKEN_EGG_PERSISTENCE = 65
const GROW_UP_DELAY = 333
var birds = []
var grass =[]
var trees = []
var skulls = []
var eggs = []
var ticks = 0

const populateBirds = (n) => {
    for (let x = 0; x < n; x++) {
        const rcx = Math.floor(Math.random() * WIDTH / 2.0) + WIDTH / 4.0;
        const rcy = Math.floor(Math.random() * HEIGHT / 2.0) + HEIGHT /4.0;
        const rr = 30;
        const rf = Math.random() > 0.5 ? (Math.random() > 0.5 ? "blue" : "indigo") : (Math.random() > 0.5 ? "darkcyan" : "purple");
        const heading = Math.random() * 2.0 * Math.PI;
        const facing = (heading < (3.0 * Math.PI / 2.0) && heading > (Math.PI / 2.0)) ? "left" : "right"
        const jumpPeriod = Math.floor(Math.random() * 10) + 15;
        const jumpOffset = Math.floor(Math.random() * jumpPeriod);
        const lastSwitch = 0
        const lastUpdate = 0
        const growTime = Math.floor(GROW_UP_DELAY * (0.5 + (Math.random() * 0.5)))
        const energy = START_ENERGY
        birds.push({
            x:rcx, 
            y:rcy, 
            r:rr, 
            h:heading,
            baby: true,
            growT: growTime,  
            fill: rf, 
            jP: jumpPeriod, 
            jO: jumpOffset, 
            eU: true, 
            lS: lastSwitch, 
            fa:facing, 
            en: energy, 
            peck: false, 
            eating:false, 
            eT: 0, 
            fullT: 0,
            lU: lastUpdate
        });
    }
};
const makeTrees = (n, spacing) => {
    let x = 0;
    while (x < n) {
        const rcx = Math.floor(Math.random() * WIDTH * 3.0 / 4.0) + WIDTH / 8.0;
        const rcy = Math.floor(Math.random() * HEIGHT * 3.0 / 4.0) + HEIGHT /8.0;
        const rr = 45;
        const fill = Math.random() < 0.33 ? "red" : Math.random() < 0.5 ? "orange" : "yellow"
        const regrowTime = Math.floor(FRUIT_SPAWN_DELAY + (Math.random() * FRUIT_SPAWN_DELAY))
        let nearest = Infinity
        let theTree = {x:rcx, y:rcy, r:rr, fill:fill, fruit: false, rgT: regrowTime, be: false}
        for (t of trees) {
            let d = distanceBetween(t, theTree)
            if (d < nearest) nearest = d;
        }
        if (nearest > spacing) {
            trees.push(theTree) 
            x++
        }
    }
};
const makeGrass= (n, spacing) => {
    let x = 0;
    while (x < n) {
        const rcx = Math.floor(Math.random() * WIDTH * 15.0 / 16.0) + WIDTH / 32.0;
        const rcy = Math.floor(Math.random() * HEIGHT * 15.0 / 16.0) + HEIGHT / 32.0;
        const rr = 30;
        const rx = rr * (Math.random() * 0.5 + 0.75)
        const ry = rr * (Math.random() * 0.5 + 0.75)
        const fill = Math.random() < 0.5 ? "#BDB76B" : "#ADC76B"
        let nearest = Infinity
        let theGrass = {x:rcx, y:rcy, r:rr, fill:fill, rx:rx, ry:ry}
        for (t of grass) {
            let d = distanceBetween(t, theGrass)
            if (d < nearest) nearest = d;
        }
        if (nearest > spacing) {
            grass.push(theGrass) 
            x++
        }
    }
};
const moveBirds = () => {
    let fruitTrees = []
    for (let t of trees) {
        if (t.fruit && !t.be) fruitTrees.push(t);
    }
    let newBirds = []
    for (let c of birds) {
        if (!c.baby) {
            if (!c.eating)
            {
                c.en -= 0.1
                c.lU = ticks
                let n = getNearestFront(c, fruitTrees)
                if (n.d < EAT_RADIUS && !n.e.be)
                {
                    c.eating = true
                    c.eT = ticks + EAT_DELAY
                    getEaten(n.e)
                }
                else if (n.d < BIRD_VISION && !n.e.be) {
                    c.h = headingToward(c, {...n.e, y: n.e.y + 15})
                }
                else  
                {
                    let turn = (Math.random() - 0.5) * Math.PI / 8.0;
                    c.h = (c.h + turn + (2.0 * Math.PI)) % (2.0 * Math.PI) 
                }
                c.x = (c.x +  3.0 * Math.cos(c.h) + WIDTH) % WIDTH;
                c.y = (c.y + 3.0 * Math.sin(c.h) + HEIGHT) % HEIGHT;
                if (ticks - c.lS > 15) {
                    c.fa = (c.h < (3.0 * Math.PI / 2.0) && c.h > (Math.PI / 2.0)) ? "left" : "right"
                    c.eU = (c.h < Math.PI) ? true : false
                    c.lS = ticks
                }
            }
            else {
                if ((ticks + c.jO) % 10 > 5) {c.peck = true} else {c.peck = false}
                if (c.eT < ticks) {
                    c.en += 20
                    c.eating = false
                    c.peck = false
                }

            }
            if (c.en > 100) c.fullT += 1; else c.fullT = 0;
            if (c.fullT > REPRODUCE_DELAY) {
                eggs.push({x: c.x, y: c.y, r: c.r * 0.6, fill: c.fill, lT: ticks, cracked: false})
                c.en -= START_ENERGY  
            }
            if (c.en >= 0) newBirds.push(c); else {
                skulls.push({x:c.x, y:c.y, r:(c.r * 0.6), ds: ticks + SKULL_PERSISTENCE})
            }
        }
        else
        {
            let turn = (Math.random() - 0.5) * Math.PI / 8.0;
            c.h = (c.h + turn + (2.0 * Math.PI)) % (2.0 * Math.PI)
            c.x = (c.x +  3.0 * Math.cos(c.h) + WIDTH) % WIDTH;
            c.y = (c.y + 3.0 * Math.sin(c.h) + HEIGHT) % HEIGHT;
            if (ticks - c.lS > 15) {
                c.fa = (c.h < (3.0 * Math.PI / 2.0) && c.h > (Math.PI / 2.0)) ? "left" : "right"
                c.eU = (c.h < Math.PI) ? true : false
                c.lS = ticks
            }
            if (ticks > c.growT) {
                c.baby = false
            }
            c.lU = ticks
            newBirds.push(c)
        }
    }
    let newEggs = []
    for (let e of eggs) {
        if (e.lT + HATCH_DELAY + BROKEN_EGG_PERSISTENCE > ticks) {
            if (!e.cracked && e.lT + HATCH_DELAY < ticks)
            {
                e.cracked = true
                newBirds.push(makeBirdFromEgg(e))
            }
            newEggs.push(e)
        }
    }
    eggs = newEggs
    birds = newBirds
    let newSkulls = []
    for (let s of skulls) {
        if (s.ds > ticks) {
            newSkulls.push(s)
        }
    }
    skulls = newSkulls
};

const growFruit = () => {
    for (t of trees) {
            if (t.rgT < ticks && t.be) {
                t.fruit = false
                t.be = false
                t.rgT = ticks + Math.floor(FRUIT_SPAWN_DELAY + (Math.random() * FRUIT_SPAWN_DELAY))
            }
            else if (t.rgT < ticks && !t.fruit) {
                t.fruit = true
                t.be = false
            }
        }

};

const getEaten = (t) => {
    t.be = true
    t.rgT = ticks + EAT_DELAY
}



const stepSimulation = () => {
    growFruit()
    moveBirds()
    ticks += 1
}


const render= () => {
    var stuff = '<svg id="main-draw-space" width="' + WIDTH + '" height="' + HEIGHT + '" style="border:4px solid black; background:#F0E68C">'
    let drawings = new Array()
    for (let g of grass) {
        drawings.push(drawGrass(g))
    }
    for (let t of trees) {
        drawings.push(drawTree(t))
    }
    for (let b of birds) {
        drawings = drawings.concat(drawWithWrap(drawBird, b));
    }
    for (let s of skulls) {
        drawings = drawings.concat(drawWithWrap(drawSkull, s));
    }
    for (let e of eggs) {
        drawings = drawings.concat(drawWithWrap(drawEgg, e));
    }
    drawings.sort((a, b) => (a[0] - b[0]))
    for (d of drawings) {
        stuff += d[1];
    }
    for (let b of birds) {
        if (!b.baby) {
            stuff += drawMeter({...b, x: (b.x + 25 + WIDTH) % WIDTH , y: (b.y - 25 + HEIGHT) % HEIGHT, r: 14 })
        }
    }
    stuff += '</svg>'
    document.getElementById("main").innerHTML = stuff;
};

const makeBirdFromEgg = (e) => {
    const rr = 30;
    const heading = Math.random() * 2.0 * Math.PI;
    const facing = (heading < (3.0 * Math.PI / 2.0) && heading > (Math.PI / 2.0)) ? "left" : "right"
    const jumpPeriod = Math.floor(Math.random() * 10) + 15;
    const jumpOffset = Math.floor(Math.random() * jumpPeriod);
    const lastSwitch = ticks
    const growTime = ticks + GROW_UP_DELAY
    const energy = START_ENERGY
    return {
            x:e.x, 
            y:e.y, 
            r:rr, 
            h:heading,
            baby: true,
            growT: growTime,  
            fill: e.fill, 
            jP: jumpPeriod, 
            jO: jumpOffset, 
            eU: true, 
            lS: lastSwitch, 
            fa: facing, 
            en: energy, 
            peck: false, 
            eating:false, 
            eT: 0, 
            fullT: 0 }
};

// Hook up the slider
const speedSlider = document.getElementById("speedSlider");
const speedDisplay = document.getElementById("speedDisplay");
if (speedSlider) {
    speedSlider.addEventListener("input", (e) => {
        speed = parseFloat(e.target.value);
        speedDisplay.textContent = speed === 0 ? "Paused" : `${speed.toFixed(1)}x`;
    });
}
const update = (currentTime) => {
    let delta = currentTime - lastTime;
    lastTime = currentTime;
    // Safety cap: prevents massive lag spikes if the tab was in the background
    if (delta > 250) delta = 250;
    // Scale delta by the speed slider
    accumulator += delta * speed;
    // Safety guard: execute at most 100 physics steps in a single frame
    let steps = 0;
    while (accumulator >= TIMESTEP && steps < 100) {
        stepSimulation(); // growFruit(), moveBirds(), ticks++
        accumulator -= TIMESTEP;
        steps++;
    }
    render();
    requestAnimationFrame(update);
};

let lastTime = performance.now();
const TIMESTEP = 1000 / 30; // 33.3ms fixed simulation step
let accumulator = 0;
let speed = 1.0;

const resetSimulation = () => {
    // 1. Reset clocks and accumulator
    ticks = 0;
    accumulator = 0;
    lastTime = performance.now();
    // 2. Clear all entity pools
    birds = [];
    grass = [];
    trees = [];
    skulls = [];
    eggs = [];
    // 3. Re-seed the world
    makeGrass(50, 20);
    populateBirds(20);
    makeTrees(20, 60);
    // 4. Immediately paint the initial state
    render();
};
// Hook up the button
const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", resetSimulation);
}


// Initial start
resetSimulation();
requestAnimationFrame(update);
