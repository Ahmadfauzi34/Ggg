
import { InteractionSolver } from './solvers/InteractionSolver';
import { PDRLogger } from '../pdr/pdr-debug';

// Mock Grid Helper
const createGrid = (w: number, h: number) => Array(h).fill(0).map(() => Array(w).fill(0));
const placeObject = (grid: number[][], color: number, x: number, y: number, w: number, h: number) => {
    for(let i=0; i<h; i++) {
        for(let j=0; j<w; j++) {
            if(y+i < grid.length && x+j < grid[0].length) {
                grid[y+i][x+j] = color;
            }
        }
    }
};

const W = 10, H = 10;
const inputGrid = createGrid(W, H);
const outputGrid = createGrid(W, H);

// 1. Setup Input
placeObject(inputGrid, 2, 8, 4, 1, 1); // Magnet Merah (Target)
placeObject(inputGrid, 1, 1, 2, 1, 1); // Besi Kecil (Actor)
placeObject(inputGrid, 1, 1, 6, 3, 3); // Besi Besar (Actor - Berat)

// 2. Setup Output
placeObject(outputGrid, 2, 8, 4, 1, 1); 
placeObject(outputGrid, 1, 7, 4, 1, 1); // Besi Kecil pindah
placeObject(outputGrid, 1, 1, 6, 3, 3); // Besi Besar DIAM

console.log("🧪 TEST: Conditional Physics (Mass Limit)");
console.log("=======================================");

// 3. Derive Laws
const laws = InteractionSolver.deriveLaws(inputGrid, outputGrid);

console.log("\n📜 DEDUCED LAWS:");
laws.forEach(l => {
    console.log(`- Type: ${l.type}`);
    console.log(`  Actor: ${l.actorColor}, Target: ${l.targetColor}`);
    console.log(`  Conditions: ${JSON.stringify(l.conditions)}`);
});

// 4. Apply Laws to New Test Case
const testInput = createGrid(W, H);
placeObject(testInput, 2, 8, 4, 1, 1); // Magnet
placeObject(testInput, 1, 2, 2, 1, 1); // Besi Kecil (Mass 1) -> Harusnya gerak
placeObject(testInput, 1, 2, 7, 2, 2); // Besi Sedang (Mass 4) -> Harusnya diam (karena limit mass <= 1)

console.log("\n🔄 SIMULATION (Test Case):");
const resultGrid = InteractionSolver.applyLaws(testInput, laws);

// Visualisasi
console.log("\n🗺️ FINAL GRID VISUALIZATION:");
console.log(resultGrid.map(row => row.map(c => c===0 ? '.' : c===1 ? 'B' : 'R').join(' ')).join('\n'));

// Cek Hasil
let smallMoved = false;
let bigStayed = true;

// Cek Besi Kecil (Awalnya di 2,2)
// Jika dia bergerak ke arah magnet (8,4), x harusnya > 2
if (resultGrid[2][2] === 0) {
    // Cek apakah dia ada di tempat lain?
    let found = false;
    for(let y=0; y<H; y++) {
        for(let x=0; x<W; x++) {
            if (resultGrid[y][x] === 1 && y < 6) { // Area atas
                if (x > 2) found = true;
            }
        }
    }
    if (found) smallMoved = true;
}

// Cek Besi Sedang (Awalnya di 2,7, size 2x2)
// Cek apakah pixel di 2,7 masih 1
if (resultGrid[7][2] === 1) {
    // Cek apakah dia geser?
    // Kalau dia geser, harusnya 2,7 jadi 0 atau posisi lain berubah
    // Tapi karena dia besar, kita cek bounding box nya
    // Simplifikasi: Cek apakah ada pixel 1 di kanan area asalnya (x > 3) di area bawah
    let moved = false;
    for(let y=6; y<H; y++) {
        for(let x=4; x<W; x++) {
            if (resultGrid[y][x] === 1) moved = true;
        }
    }
    if (moved) bigStayed = false;
} else {
    // Kalau 2,7 kosong, berarti dia pindah
    bigStayed = false;
}

console.log(`\n✅ RESULT:`);
console.log(`   Small Object Moved? ${smallMoved ? 'YES (Correct)' : 'NO (Failed)'}`);
console.log(`   Big Object Stayed?  ${bigStayed ? 'YES (Correct)' : 'NO (Failed)'}`);

if (smallMoved && bigStayed) {
    console.log("\n🎉 SUCCESS: Conditional Physics Logic Verified!");
} else {
    console.log("\n❌ FAILED: Simulation did not respect mass conditions.");
}
