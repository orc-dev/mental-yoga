export default class CubeNet {
    // we use a 8*8 matrix to define a cubenet 
    static SIZE = 8;
    // 11 valid primitive nets
    static VALID_PNETS = [
        {   
            netId: 0,
            netName: 'Pickaxe',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {
            netId: 1,
            netName: 'Pipe-Wrench',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {  
            netId: 2,
            netName: 'Pliers',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 3,
            netName: 'Ring-Spanner',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,0,0,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 4,
            netName: 'Cross',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {  
            netId: 5,
            netName: 'Bone',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 6,
            netName: 'Seahorse-1',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 7,
            netName: 'Seahorse-2',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 8,
            netName: 'Seahorse-3',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 9,
            netName: 'Snake',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,1,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 10,
            netName: 'Stairs',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,0,0,0],
                [0,0,0,0,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
    ];

    // 16 selected invalid primitive nets
    static INVALID_PNETS = [
        {   
            netId: 0,
            netName: 'Triangle',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,1,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {   
            netId: 1,
            netName: 'Long-T',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,1,1,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {   
            netId: 2,
            netName: 'Table',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,1,0,0,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {   
            netId: 3,
            netName: 'Fork',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,1,0,0,0],
                [0,0,1,1,1,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {   
            netId: 4,
            netName: 'Trunk',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,1,1,1,1,1,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 5,
            netName: 'Wide-L',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 6,
            netName: 'T-junction',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 7,
            netName: 'Letter-F',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,0,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 8,
            netName: 'Chair',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,1,0,0,0],
                [0,0,1,1,1,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 9,
            netName: 'Waterfall',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,1,1,1,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 10,
            netName: 'Swivel-Chair',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 11,
            netName: 'Spoon',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,1,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 12,
            netName: 'Long-L',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,1,1,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 13,
            netName: 'River',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 14,
            netName: 'Diving-Board',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,1,1,1,1,0,0,0],
                [0,0,0,0,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {   
            netId: 15,
            netName: 'Skis',
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
    ];

    static buildManifestNets(isValid) {
        const list = [];
        const rotNums = [0,1,2,3];

        const pnets = isValid ? CubeNet.VALID_PNETS : CubeNet.INVALID_PNETS;

        pnets.forEach(net => {
            // Add non-flip cases to the list
            rotNums.forEach(rid => {
                list.push(new CubeNet(isValid, net.mat, false, rid, net.netName));
            });

            if (!net.isFlippable) {
                return;
            }
            // Add flipped cases to the list
            rotNums.forEach(rid => {
                list.push(new CubeNet(isValid, net.mat, true, rid, net.netName));
            });
        });
        return list;
    }

    constructor(
        isValid = undefined,
        baseMatrix = undefined,
        flip = false,  // Apply flip about y axis
        rotationNum = 0,
        name = 'Cubenet-Foo'
    ) {
        this.isValid = isValid;
        this.baseMatrix = baseMatrix;

        // We apply filp first, then do rotation
        this.flip = flip;

        // We assume X-axis points to left and Y-axis points to up in 2D plane
        this.rotationNum = rotationNum;

        // OutputMat is the matrix applied flip and rotation
        this.outputMatrix = this.#computeOutputMatrix();
        this.name = name;
    }

    #computeOutputMatrix() {
        // Create an zero-filled 8*8 matrix
        const transformedMatrix = Array.from(
            { length: CubeNet.SIZE }, 
            () => Array(CubeNet.SIZE).fill(0)
        );
        // Handle flip
        let tempMatrix = this.baseMatrix.map(row =>
            this.flip ? row.slice().reverse() : row.slice()
        );
        // Create a rotation mapping function
        const END = CubeNet.SIZE - 1;
        const getRotatedValue = (i, j) => {
            switch (this.rotationNum) {
                case 0:
                    return tempMatrix[i][j];
                case 1: // 90
                    return tempMatrix[j][END - i];
                case 2: // 180
                    return tempMatrix[END - i][END - j];
                case 3: // 270
                    return tempMatrix[END - j][i];
                default:
                    throw new Error(`Invalid rotationNum: ${this.rotationNum}`);
            }
        };
        // Apply rotation to outputMat
        for (let i = 0; i < CubeNet.SIZE; ++i) {
            for (let j = 0; j < CubeNet.SIZE; ++j) {
                transformedMatrix[i][j] = getRotatedValue(i, j);
            }
        }
        return transformedMatrix;
    }

    getValidFlag() {
        return this.isValid;
    }

    getOutputMatrix() {
        return this.outputMatrix.map(row => row.slice());
    }

    getNameCode() {
        const flipCode = this.flip ? '-f-' : '-';
        return `${this.name}${flipCode}${this.rotationNum}`;
    }
}


export const VALID_NETS   = CubeNet.buildManifestNets(true);
export const INVALID_NETS = CubeNet.buildManifestNets(false);