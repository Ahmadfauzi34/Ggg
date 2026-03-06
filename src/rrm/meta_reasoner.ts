/**
 * RRM (Recursive Reasoning Machine) - Meta Reasoner
 * 
 * This module takes the "Physics" and "Signal" features from the Analyzer
 * and decides WHICH strategy to use.
 * 
 * It performs "Hypothesis Testing":
 * 1. Look at Input -> Output changes in training data.
 * 2. Formulate a hypothesis (e.g., "Mass doubled -> Scaling").
 * 3. Select the best solver.
 */

import { analyzeGrid } from './features.ts';
import { solveGravity } from '../solvers/gravity.ts';
import { solveFrameExtraction } from '../solvers/frame_extraction.ts';
import { solvePatternedSplit } from '../solvers/patterned_split.ts';
import { solveSideComparison } from '../solvers/side_comparison.ts';
import { solveMagneticAttraction } from '../solvers/magnetic_attraction.ts';
import { solveCrossFill } from '../solvers/cross_fill.ts';
import { solveColorSubstitution } from '../solvers/color_substitution.ts';
import { 
    solveRotation90, 
    solveRotation180, 
    solveRotation270, 
    solveFlipHorizontal, 
    solveFlipVertical 
} from '../solvers/geometry.ts';

type SolverFunction = (input: number[][], ...args: any[]) => number[][];

export class MetaReasoner {
    
    public selectRankedSolvers(trainPairs: {input: number[][], output: number[][]}[], testInput: number[][]): Array<{id: string, solver: SolverFunction}> {
        console.log("RRM: Analyzing Physics & Signals...");

        // 1. Analyze Training Data
        const scores = this.formulateHypotheses(trainPairs);
        
        // 2. Map IDs to Solver Functions
        return scores.map(s => ({
            id: s.id,
            solver: this.getSolverById(s.id)
        })).filter(s => s.id !== 'UNKNOWN');
    }

    private getSolverById(id: string): SolverFunction {
        switch (id) {
            case 'GRAVITY': return solveGravity;
            case 'FRAME_EXTRACTION': return solveFrameExtraction;
            case 'PATTERN_SPLIT': return solvePatternedSplit;
            case 'SIDE_COMPARISON': return solveSideComparison;
            case 'MAGNETIC_ATTRACTION': return solveMagneticAttraction;
            case 'CROSS_FILL': return solveCrossFill;
            case 'COLOR_SUBSTITUTION': return solveColorSubstitution;
            case 'ROTATION_90': return solveRotation90;
            case 'ROTATION_180': return solveRotation180;
            case 'ROTATION_270': return solveRotation270;
            case 'FLIP_H': return solveFlipHorizontal;
            case 'FLIP_V': return solveFlipVertical;
            default: return (input) => input;
        }
    }

    private formulateHypotheses(trainPairs: {input: number[][], output: number[][]}[]) : Array<{id: string, val: number}> {
        let scores: Record<string, number> = {
            GRAVITY: 0,
            FRAME_EXTRACTION: 0,
            PATTERN_SPLIT: 0,
            SIDE_COMPARISON: 0,
            MAGNETIC_ATTRACTION: 0,
            COLOR_SUBSTITUTION: 0,
            ROTATION_90: 0,
            ROTATION_180: 0,
            ROTATION_270: 0,
            FLIP_H: 0,
            FLIP_V: 0
        };

        for (const pair of trainPairs) {
            const inFeat = analyzeGrid(pair.input);
            const outFeat = analyzeGrid(pair.output);

            const inH = pair.input.length;
            const inW = pair.input[0].length;
            const outH = pair.output.length;
            const outW = pair.output[0].length;

            // --- Geometric Transformations ---
            if (inH === outW && inW === outH) {
                if (this.gridsEqual(solveRotation90(pair.input), pair.output)) scores.ROTATION_90 += 10;
                if (this.gridsEqual(solveRotation270(pair.input), pair.output)) scores.ROTATION_270 += 10;
            }
            if (inH === outH && inW === outW) {
                if (this.gridsEqual(solveRotation180(pair.input), pair.output)) scores.ROTATION_180 += 10;
                if (this.gridsEqual(solveFlipHorizontal(pair.input), pair.output)) scores.FLIP_H += 10;
                if (this.gridsEqual(solveFlipVertical(pair.input), pair.output)) scores.FLIP_V += 10;
            }

            // --- Frame Extraction ---
            if (outH < inH || outW < inW) {
                if (outH <= 5 && outW <= 5) scores.FRAME_EXTRACTION += 3;
                if (inFeat.objects.count > 1 && outFeat.objects.count === 1) scores.FRAME_EXTRACTION += 2;
            }

            // --- Pattern Split ---
            if (inFeat.periodicity.rowPeriod > 0 || inFeat.periodicity.colPeriod > 0) {
                if (inH % outH === 0 && inW % outW === 0) scores.PATTERN_SPLIT += 5;
            }

            // --- Side Comparison ---
            if (inW === 2 * outW || inW === 2 * outW + 1) {
                scores.SIDE_COMPARISON += 3;
            }

            // --- Gravity & Magnetic ---
            if (inH === outH && inW === outW && inFeat.mass === outFeat.mass) {
                const dr = outFeat.centerOfMass.r - inFeat.centerOfMass.r;
                const dc = Math.abs(outFeat.centerOfMass.c - inFeat.centerOfMass.c);
                if (dr > 0.5 && dc < 0.1) scores.GRAVITY += 5;
                else if (Math.abs(dr) > 0.1 || dc > 0.1) scores.MAGNETIC_ATTRACTION += 2;
            }

            // --- Color Substitution ---
            if (inH === outH && inW === outW && inFeat.objects.count === outFeat.objects.count) {
                if (inFeat.mass === outFeat.mass && !this.gridsEqual(pair.input, pair.output)) {
                    scores.COLOR_SUBSTITUTION += 4;
                }
            }
        }

        return Object.entries(scores)
            .map(([id, val]) => ({ id, val }))
            .filter(s => s.val > 0)
            .sort((a, b) => b.val - a.val);
    }

    private gridsEqual(a: number[][], b: number[][]): boolean {
        if (a.length !== b.length || a[0].length !== b[0].length) return false;
        for (let r = 0; r < a.length; r++) {
            for (let c = 0; c < a[0].length; c++) {
                if (a[r][c] !== b[r][c]) return false;
            }
        }
        return true;
    }
}
