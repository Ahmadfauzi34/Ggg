import { MetaReasoner } from '../../reasoning/rrm/meta_reasoner.ts';
import { solveKronecker } from '../../solvers/grid/kronecker.ts';
import { solveEnclosure } from '../../solvers/grid/enclosure.ts';
import { solvePeriodicity } from '../../solvers/grid/periodicity.ts';
import { solveShear } from '../../solvers/grid/shear.ts';
import { solveIntersection } from '../../solvers/grid/intersection.ts';
import { solveDiagonalTiling } from '../../solvers/grid/diagonal_tiling.ts';
import { solveDiagonalOutlineTiling } from '../../solvers/grid/diagonal_outline_tiling.ts';
import { solveSymmetricPattern } from '../../solvers/grid/symmetric_pattern.ts';
import { solveGridCount } from '../../solvers/grid/grid_count.ts';
import { solveOverlayNeighborhoods } from '../../solvers/grid/overlay_neighborhoods.ts';
import { solveMoveToTouch } from '../../solvers/grid/move_to_touch.ts';
import { solveExhaustive2x2 } from '../../solvers/grid/exhaustive_2x2.ts';
import { solveMoveToAdjacency } from '../../solvers/grid/move_to_adjacency.ts';
import { solveGridSpread } from '../../solvers/grid/grid_spread.ts';
import { solveBarRanking } from '../../solvers/grid/bar_ranking.ts';
import { solvePlusExpansion } from '../../solvers/grid/plus_expansion.ts';
import { solveRepeatingLine } from '../../solvers/grid/repeating_line.ts';
import { solveMasterCell } from '../../solvers/grid/master_cell.ts';
import { solveMinorityBbox } from '../../solvers/grid/minority_bbox.ts';
import { solveDirectionalCopy } from '../../solvers/grid/directional_copy.ts';
import { solveLocalNeighborhood } from '../../solvers/grid/local_neighborhood.ts';
import { solveColorSubstitution } from '../../solvers/grid/color_substitution.ts';
import { solveSubgridConnections } from '../../solvers/grid/subgrid_connections.ts';
import { solveCrossFill } from '../../solvers/grid/cross_fill.ts';
import { solveMagneticAttraction } from '../../solvers/grid/magnetic_attraction.ts';
import { solveSideComparison } from '../../solvers/grid/side_comparison.ts';
import { solvePatternedSplit } from '../../solvers/grid/patterned_split.ts';
import { solveGravity } from '../../solvers/grid/gravity.ts';
import { solveFrameExtraction } from '../../solvers/grid/frame_extraction.ts';

export class GridAgent {
    private metaReasoner: MetaReasoner;
    private solvers: Array<any> = [
        Object.assign(solveGravity, { id: 'solveGravity' }),
        Object.assign(solveFrameExtraction, { id: 'solveFrameExtraction' }),
        Object.assign(solvePatternedSplit, { id: 'solvePatternedSplit' }),
        Object.assign(solveSideComparison, { id: 'solveSideComparison' }),
        Object.assign(solveMagneticAttraction, { id: 'solveMagneticAttraction' }),
        Object.assign(solveColorSubstitution, { id: 'solveColorSubstitution' }),
        Object.assign(solveCrossFill, { id: 'solveCrossFill' }),
        Object.assign(solveKronecker, { id: 'solveKronecker' }),
        Object.assign(solveEnclosure, { id: 'solveEnclosure' }),
        Object.assign((input: number[][]) => solvePeriodicity(input, 9, { 1: 2 }), { id: 'solvePeriodicity' }),
        Object.assign(solveShear, { id: 'solveShear' }),
        Object.assign(solveIntersection, { id: 'solveIntersection' }),
        Object.assign(solveDiagonalTiling, { id: 'solveDiagonalTiling' }),
        Object.assign(solveDiagonalOutlineTiling, { id: 'solveDiagonalOutlineTiling' }),
        Object.assign(solveSymmetricPattern, { id: 'solveSymmetricPattern' }),
        Object.assign(solveGridCount, { id: 'solveGridCount' }),
        Object.assign(solveOverlayNeighborhoods, { id: 'solveOverlayNeighborhoods' }),
        Object.assign(solveMoveToTouch, { id: 'solveMoveToTouch' }),
        Object.assign(solveExhaustive2x2, { id: 'solveExhaustive2x2' }),
        Object.assign(solveMoveToAdjacency, { id: 'solveMoveToAdjacency' }),
        Object.assign(solveGridSpread, { id: 'solveGridSpread' }),
        Object.assign(solveBarRanking, { id: 'solveBarRanking' }),
        Object.assign(solvePlusExpansion, { id: 'solvePlusExpansion' }),
        Object.assign(solveRepeatingLine, { id: 'solveRepeatingLine' }),
        Object.assign(solveMasterCell, { id: 'solveMasterCell' }),
        Object.assign(solveMinorityBbox, { id: 'solveMinorityBbox' }),
        Object.assign(solveDirectionalCopy, { id: 'solveDirectionalCopy' }),
        Object.assign((input: number[][], trainPairs: any) => solveLocalNeighborhood(input, trainPairs), { id: 'solveLocalNeighborhood' }),
        Object.assign(solveSubgridConnections, { id: 'solveSubgridConnections' })
    ];

    constructor() {
        this.metaReasoner = new MetaReasoner();
    }

    public solve(input: number[][], expectedOutput?: number[][], trainPairs?: {input: number[][], output: number[][]}[], testPairs?: {input: number[][], output: number[][]}[]) {
        console.log(\n--- RRM (Recursive Reasoning Machine) Activated ---\n);
        
        if (!trainPairs) {
            console.log("RRM: No training pairs provided. Using fallback search.");
            return this.fallbackSolve(input);
        }

        const result = this.recursiveSearch(input, trainPairs, 0, 2);
        if (result) {
            if (expectedOutput) {
                if (JSON.stringify(result) === JSON.stringify(expectedOutput)) {
                    console.log("RRM: Solution found and verified!");
                    return result;
                }
            } else {
                return result;
            }
        }

        console.log("RRM: No solution found via recursive search. Using fallback.");
        return this.fallbackSolve(input, trainPairs);
    }

    private recursiveSearch(\n        currentInput: number[][], \n        currentTrainPairs: {input: number[][], output: number[][]}[], \n        depth: number, \n        maxDepth: number\n    ): number[][] | null {\n        if (depth > maxDepth) return null;

        let allSolved = true;
        for (const pair of currentTrainPairs) {
            if (JSON.stringify(pair.input) !== JSON.stringify(pair.output)) {
                allSolved = false;
                break;
            }
        }
        if (allSolved) return currentInput;

        const rankedSolvers = this.metaReasoner.selectRankedSolvers(currentTrainPairs, currentInput);
        
        const solversToTry = rankedSolvers.map(rs => rs.solver);
        
        const otherSolvers = this.solvers.filter(s => !solversToTry.includes(s));
        solversToTry.push(...otherSolvers);

        for (const solver of solversToTry) {
            try {
                const solverName = (solver as any).id || solver.name || 'anonymous';
                const nextInput = solver(currentInput, currentTrainPairs);
                
                const nextTrainPairs = currentTrainPairs.map(pair => ({
                    input: solver(pair.input, currentTrainPairs),
                    output: pair.output
                }));

                let madeProgress = false;
                for (let i = 0; i < currentTrainPairs.length; i++) {
                    if (JSON.stringify(nextTrainPairs[i].input) !== JSON.stringify(currentTrainPairs[i].input)) {
                        madeProgress = true;
                        break;
                    }
                }

                if (!madeProgress) continue;

                console.log(`RRM [Depth ${depth}]: Applied ${solverName}. Progress made.`);

                const finalResult = this.recursiveSearch(nextInput, nextTrainPairs, depth + 1, maxDepth);
                if (finalResult) return finalResult;

            } catch (e) {
                continue;
            }
        }

        return null;
    }

    private fallbackSolve(input: number[][], trainPairs?: {input: number[][], output: number[][]}[]) {
        for (const solver of this.solvers) {
            try {
                const result = solver(input, trainPairs);
                if (result && result.length > 0) return result;
            } catch (e) {
                continue;
            }
        }
        return input;
    }
}