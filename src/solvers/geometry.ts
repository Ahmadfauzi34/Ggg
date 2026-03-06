/**
 * ARC Solver: Geometric Transformations
 * 
 * Handles rotation and reflection.
 */

export function solveRotation90(input: number[][]): number[][] {
    const H = input.length;
    const W = input[0].length;
    const output = Array.from({ length: W }, () => Array(H).fill(0));
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            output[c][H - 1 - r] = input[r][c];
        }
    }
    return output;
}

export function solveRotation180(input: number[][]): number[][] {
    const H = input.length;
    const W = input[0].length;
    const output = Array.from({ length: H }, () => Array(W).fill(0));
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            output[H - 1 - r][W - 1 - c] = input[r][c];
        }
    }
    return output;
}

export function solveRotation270(input: number[][]): number[][] {
    const H = input.length;
    const W = input[0].length;
    const output = Array.from({ length: W }, () => Array(H).fill(0));
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            output[W - 1 - c][r] = input[r][c];
        }
    }
    return output;
}

export function solveFlipHorizontal(input: number[][]): number[][] {
    const H = input.length;
    const W = input[0].length;
    const output = Array.from({ length: H }, () => Array(W).fill(0));
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            output[r][W - 1 - c] = input[r][c];
        }
    }
    return output;
}

export function solveFlipVertical(input: number[][]): number[][] {
    const H = input.length;
    const W = input[0].length;
    const output = Array.from({ length: H }, () => Array(W).fill(0));
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            output[H - 1 - r][c] = input[r][c];
        }
    }
    return output;
}
