
import { GridAgent } from './src/agent.ts';

// --- Test Data: Task 12 (Gravity + Color Mapping) ---
// Concept: Objects fall down (Gravity), AND Red pixels turn Blue (Color Sub).

const trainInput1 = [
    [0, 0, 0, 0],
    [2, 0, 0, 0], // Red block
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const trainOutput1 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 0] // Blue block at bottom
];

const trainInput2 = [
    [0, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const trainOutput2 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 1, 0, 0]
];

// Test Case
const testInput = [
    [0, 0, 2, 0], // Red block at top
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const expectedOutput = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, 0] // Blue block at bottom
];

// --- Execution ---

async function runTest() {
    console.log("--- Starting RRM Test: Gravity + Color Substitution ---");

    const agent = new GridAgent();
    
    const trainPairs = [
        { input: trainInput1, output: trainOutput1 },
        { input: trainInput2, output: trainOutput2 }
    ];

    const result = agent.solve(testInput, expectedOutput, trainPairs);

    console.log("\n--- Final Result ---");
    console.log(JSON.stringify(result));

    if (JSON.stringify(result) === JSON.stringify(expectedOutput)) {
        console.log("✅ SUCCESS: Agent solved the multi-step task!");
    } else {
        console.log("❌ FAILURE: Agent did not produce expected output.");
        console.log("Expected:", JSON.stringify(expectedOutput));
        console.log("Actual:  ", JSON.stringify(result));
    }
}

runTest();
