import { Quaternion } from 'three';
import * as THREE from 'three';
import { VALID_NETS } from './CubeNet';
import { easeCubicInOut, easeSinInOut } from 'd3-ease';
import { NEW_VERTICES, HOVER_MAT, SELECT_MAT,
    FACE_HOV_MAT, FACE_SEL_MAT, FACE_CACHE,
    OGRE_MAT,
 } from '../components/MatList';


// Math constants
const cos45 = Math.cos(Math.PI / 4);  // 0.7071067811865476;
const cos60 = 0.5;


export default class CubeEngine {

    ///////////////////////////////////////////////////////////////////////////
    // Static constants -----------------------------------------------------//

    /**
     * Cube orientation labels from a front-above view:
     *
     *           B
     *       +-------+
     *      /    T    \
     *     +-----------+
     *     |           |
     *   L |     F     | R
     *     |           |
     *     +-----------+
     *           D
     *
     * Axis directions (right-handed system):
     * T: +Y, D: -Y, R: +X, L: -X, F: +Z, B: -Z
     *
     * Each key in CUBE_GROUP is a two-letter label `${Top}${Front}` 
     * representing a cube orientation.
     *
     * Each entry contains:
     * - qtn: quaternion representing the rotation
     * - xp, xn, yp, yn, zp, zn: next orientations after 90° global rotations
     * - base: the bottom face label and its rotation in world coordinates
     */
    static CUBE_GROUP = {
        // ---------------------------------------- 'T' as Top
        TF: {
            qtn: new Quaternion(0, 0, 0, 1),
            xp: 'BT', xn: 'FD', 
            yp: 'TL', yn: 'TR', 
            zp: 'RF', zn: 'LF',
            base: 'D0',
        },
        TL: {
            qtn: new Quaternion(0, -cos45, 0, -cos45),
            xp: 'RT', xn: 'LD', 
            yp: 'TB', yn: 'TF', 
            zp: 'FL', zn: 'BL',
            base: 'D1',
        },
        TB: {
            qtn: new Quaternion(0, -1, 0, 0),
            xp: 'FT', xn: 'BD', 
            yp: 'TR', yn: 'TL', 
            zp: 'LB', zn: 'RB',
            base: 'D2',
        },
        TR: {
            qtn: new Quaternion(0, -cos45, 0, cos45),
            xp: 'LT', xn: 'RD', 
            yp: 'TF', yn: 'TB', 
            zp: 'BR', zn: 'FR',
            base: 'D3',
        },
        
        // ---------------------------------------- 'F' as Top
        FD: {
            qtn: new Quaternion(-cos45, 0, 0, cos45),
            xp: 'TF', xn: 'DB', 
            yp: 'FL', yn: 'FR', 
            zp: 'RD', zn: 'LD',
            base: 'B0',
        },
        FL: {
            qtn: new Quaternion(-cos60, cos60, cos60, cos60),
            xp: 'RF', xn: 'LB', 
            yp: 'FT', yn: 'FD', 
            zp: 'DL', zn: 'TL',
            base: 'B1',
        },
        FT: {
            qtn: new Quaternion(0, cos45, cos45, 0),
            xp: 'DF', xn: 'TB', 
            yp: 'FR', yn: 'FL', 
            zp: 'LT', zn: 'RT',
            base: 'B2',
        },
        FR: {
            qtn: new Quaternion(cos60, cos60, cos60, -cos60),
            xp: 'LF', xn: 'RB', 
            yp: 'FD', yn: 'FT', 
            zp: 'TR', zn: 'DR',
            base: 'B3',
        },
    
        // ---------------------------------------- 'L' as Top
        LD: {
            qtn: new Quaternion(cos60, -cos60, cos60, -cos60),
            xp: 'TL', xn: 'DR', 
            yp: 'LB', yn: 'LF', 
            zp: 'FD', zn: 'BD',
            base: 'R1',
        },
        LB: {
            qtn: new Quaternion(cos45, -cos45, 0, 0),
            xp: 'FL', xn: 'BR', 
            yp: 'LT', yn: 'LD', 
            zp: 'DB', zn: 'TB',
            base: 'R2',
        },
        LT: {
            qtn: new Quaternion(cos60, -cos60, -cos60, cos60),
            xp: 'DL', xn: 'TR', 
            yp: 'LF', yn: 'LB', 
            zp: 'BT', zn: 'FT',
            base: 'R3',
        },
        LF: {
            qtn: new Quaternion(0, 0, -cos45, cos45),
            xp: 'BL', xn: 'FR', 
            yp: 'LD', yn: 'LT', 
            zp: 'TF', zn: 'DF',
            base: 'R0',
        },
    
        // ---------------------------------------- 'B' as Top
        BD: {
            qtn: new Quaternion(0, -cos45, cos45, 0),
            xp: 'TB', xn: 'DF', 
            yp: 'BR', yn: 'BL', 
            zp: 'LD', zn: 'RD',
            base: 'F2',
        },
        BR: {
            qtn: new Quaternion(cos60, -cos60, cos60, cos60),
            xp: 'LB', xn: 'RF', 
            yp: 'BT', yn: 'BD', 
            zp: 'DR', zn: 'TR',
            base: 'F3',
        },
        BT: {
            qtn: new Quaternion(cos45, 0, 0, cos45),
            xp: 'DB', xn: 'TF', 
            yp: 'BL', yn: 'BR', 
            zp: 'RT', zn: 'LT',
            base: 'F0',
        },
        BL: {
            qtn: new Quaternion(cos60, cos60, -cos60, cos60),
            xp: 'RB', xn: 'LF', 
            yp: 'BD', yn: 'BT', 
            zp: 'TL', zn: 'DL',
            base: 'F1',
        },
    
        // ---------------------------------------- 'R' as Top
        RD: {
            qtn: new Quaternion(-cos60, -cos60, cos60, cos60),
            xp: 'TR', xn: 'DL', 
            yp: 'RF', yn: 'RB', 
            zp: 'BD', zn: 'FD',
            base: 'L3',
        },
        RF: {
            qtn: new Quaternion(0, 0, cos45, cos45),
            xp: 'BR', xn: 'FL', 
            yp: 'RT', yn: 'RD', 
            zp: 'DF', zn: 'TF',
            base: 'L0',
        },
        RT: {
            qtn: new Quaternion(cos60, cos60, cos60, cos60),
            xp: 'DR', xn: 'TL', 
            yp: 'RB', yn: 'RF', 
            zp: 'FT', zn: 'BT',
            base: 'L1',
        },
        RB: {
            qtn: new Quaternion(cos45, cos45, 0, 0),
            xp: 'FR', xn: 'BL', 
            yp: 'RD', yn: 'RT', 
            zp: 'TB', zn: 'DB',
            base: 'L2',
        },
    
        // ---------------------------------------- 'D' as Top
        DB: {
            qtn: new Quaternion(-1, 0, 0, 0),
            xp: 'FD', xn: 'BT', 
            yp: 'DL', yn: 'DR', 
            zp: 'RB', zn: 'LB',
            base: 'T0',
        },
        DL: {
            qtn: new Quaternion(-cos45, 0, cos45, 0),
            xp: 'RD', xn: 'LT', 
            yp: 'DF', yn: 'DB', 
            zp: 'BL', zn: 'FL',
            base: 'T1',
        },
        DF: {
            qtn: new Quaternion(0, 0, 1, 0),
            xp: 'BD', xn: 'FT', 
            yp: 'DR', yn: 'DL', 
            zp: 'LF', zn: 'RF',
            base: 'T2',
        },
        DR: {
            qtn: new Quaternion(cos45, 0, cos45, 0),
            xp: 'LD', xn: 'RT', 
            yp: 'DB', yn: 'DF', 
            zp: 'FR', zn: 'BR',
            base: 'T3',
        },
    };

    /**
     * Defines adjacent faces for each cube face based on local axis directions,
     * in the order of [xp, zn, xn, zp].
     * 
     *     +------ B ------+       +------ F ------+      +------ D ------+
     *     |               |       |               |      |               |
     *     |               |       |               |      |               |
     *     L       D       R       L       T       R      L       F       R
     *     |               |       |               |      |               |
     *     |               |       |               |      |               |
     *     +------ F ------+       +------ B ------+      +------ T ------+
     * 
     *     +------ B ------+       +------ B ------+      +------ T ------+
     *     |               |       |               |      |               |
     *     |               |       |               |      |               |
     *     T       L       D       D       R       T      L       B       R
     *     |               |       |               |      |               |
     *     |               |       |               |      |               |
     *     +------ F ------+       +------ F ------+      +------ D ------+
     * 
     */
    static FACE_AXIS_MAP = {
        D: {
            R: 'xp', B: 'zn', L: 'xn', F: 'zp', 
            xp: 'R', zn: 'B', xn: 'L', zp: 'F',
        },
        T: {
            R: 'xp', F: 'zn', L: 'xn', B: 'zp',
            xp: 'R', zn: 'F', xn: 'L', zp: 'B',
        },
        F: {
            R: 'xp', D: 'zn', L: 'xn', T: 'zp',
            xp: 'R', zn: 'D', xn: 'L', zp: 'T',
        },
        B: {
            R: 'xp', T: 'zn', L: 'xn', D: 'zp',
            xp: 'R', zn: 'T', xn: 'L', zp: 'D',
        },
        L: {
            D: 'xp', B: 'zn', T: 'xn', F: 'zp',
            xp: 'D', zn: 'B', xn: 'T', zp: 'F',
        },
        R: {
            T: 'xp', B: 'zn', D: 'xn', F: 'zp',
            xp: 'T', zn: 'B', xn: 'D', zp: 'F',
        },
    };

    /**
     * [face][index] is a 4-element array, representing the face-rotation
     * in 2D net coordinates in order xp, zn, xn, zp.
     */
    static CHILD_FACE_ROTATION = {
        D: [
            ['R0', 'B0', 'L0', 'F0'],
            ['F1', 'R1', 'B1', 'L1'],
            ['L2', 'F2', 'R2', 'B2'],
            ['B3', 'L3', 'F3', 'R3'],
        ],
        T: [
            ['R2', 'F0', 'L2', 'B0'],
            ['B1', 'R3', 'F1', 'L3'],
            ['L0', 'B2', 'R0', 'F2'],
            ['F3', 'L1', 'B3', 'R1'],
        ],
        F: [
            ['R3', 'D0', 'L1', 'T0'],
            ['T1', 'R0', 'D1', 'L2'],
            ['L3', 'T2', 'R1', 'D2'],
            ['D3', 'L0', 'T3', 'R2'],
        ],
        B: [
            ['R1', 'T0', 'L3', 'D0'],
            ['D1', 'R2', 'T1', 'L0'],
            ['L1', 'D2', 'R3', 'T2'],
            ['T3', 'L2', 'D3', 'R0'],
        ],
        L: [
            ['D0', 'B1', 'T2', 'F3'],
            ['F0', 'D1', 'B2', 'T3'],
            ['T0', 'F1', 'D2', 'B3'],
            ['B0', 'T1', 'F2', 'D3'],
        ],
        R: [
            ['T2', 'B3', 'D0', 'F1'],
            ['F2', 'T3', 'B0', 'D1'],
            ['D2', 'F3', 'T0', 'B1'],
            ['B2', 'D3', 'F0', 'T1'],
        ],
    };

    static HALF_UNIT = 0.5;
    static HALF_PI = Math.PI * 0.5;

    /** Shift vector for setting positions of the child face based on
     * the xz_type of pFace-cFace edge.
     */
    static POS_TABLE = {
        xn: [-CubeEngine.HALF_UNIT, 0, 0],
        zp: [0, 0, +CubeEngine.HALF_UNIT],
        xp: [+CubeEngine.HALF_UNIT, 0, 0],
        zn: [0, 0, -CubeEngine.HALF_UNIT],
    };

    /** Relative rotation numbers for an pFace-cFace edge. */
    static ROT_TABLE = {
        D: {R: 0, B: 0, L: 0, F: 0},
        T: {R: 2, F: 0, L: 2, B: 0},
        F: {R: 3, L: 1, T: 0, D: 0},
        B: {R: 1, T: 0, L: 3, D: 0},
        L: {B: 1, T: 2, F: 3, D: 0},
        R: {T: 2, B: 3, F: 1, D: 0},
    };

    /** Specifies the rotation axis and cube bounds for xz_type edges. */
    static ROT_AXES = {
        xp: {axis: 'z', rad90: +CubeEngine.HALF_PI},
        xn: {axis: 'z', rad90: -CubeEngine.HALF_PI},
        zp: {axis: 'x', rad90: -CubeEngine.HALF_PI},
        zn: {axis: 'x', rad90: +CubeEngine.HALF_PI},
    };

    /** one-hot encoding for each face */
    static BIT_FLAG = {
        T: 0b000001,
        D: 0b000010,
        F: 0b000100,
        B: 0b001000,
        L: 0b010000,
        R: 0b100000,
    };

    ///////////////////////////////////////////////////////////////////////////
    // Constructor and Instance methods -------------------------------------//

    constructor({cubeType='coach', initPos=[0,CubeEngine.HALF_UNIT,0]} ={}) {
        this.cubeType = cubeType;
        this.initPos = initPos;

        this.init = false;
        this.allRefsReady = false;

        // Rotation fields
        this.isRotating = false;
        this.currPose = 'TF';
        this.nextPose = 'TF';
        this.t = 1;  // time parameter for rotation animation

        this.quaternion = new Quaternion();
        this.initSpeed = 0;
        this.ACC = 0.5;
        this.currSpeed = this.initSpeed;
        this.easeFn = (t) => (t);  // ease function for rotation

        // Mesh refs fields
        this.faceKeys = ['T', 'D', 'F', 'B', 'L', 'R'];
        this.fieldKeys = [
            'ref', 'xp', 'xn', 'zp', 'zn',
            // 'skin', 'textRef',
        ];
        this.core = null;
        this.boneFaces = {
            T: {},
            D: {},
            F: {},
            B: {},
            L: {},
            R: {},
        };

        // Cube-net transformation fields
        this.t100 = 0;
        this.p200 = 0;
        this.tValues = null;
        this.animationMode = null;

        this.sliderRef = null;
        this.isAutoPlay = false;
        this.meshDirty = false;

        this.manifestMatrix = null;
        this.faceIndices = null;
        this.baseId = null;
        this.hierMatrix = null;
        this.guide = null;

        // Face, edge, vertex fields
        this.interactorFlag = {
            face: this.cubeType === 'chicken',
            edge: false,
            vertex: ['coach', 'ogre'].includes(this.cubeType),
            rocket: false,
        };
        this.faces = {};
        this.edges = Object.fromEntries(
            Object.keys(CubeEngine.CUBE_GROUP).map(key => [key, null])
        );
        this.vertices = {};

        this.hover = {
            face: null,
            edge: null,
            vertex: null,
        };

        this.selected = {
            fSet: new Set(),
            eSet: new Set(),
            vSet: new Set(),
        };

        this.wingTime = 0;
    }


    assemblyFaces(faceKeyList) {
        const h = CubeEngine.HALF_UNIT;
        const p = Math.PI;
        const q = p * 0.5;

        const pos = {
            T: [0,+h,0],
            D: [0,-h,0],
            F: [0,0,+h],
            B: [0,0,-h],
            L: [-h,0,0],
            R: [+h,0,0],
        };

        const rot = {
            T: [-p,0,0],
            D: [0,0,0],
            F: [-q,0,0],
            B: [q,0,0],
            L: [0,0,-q],
            R: [0,0,+q],   
        };

        faceKeyList.forEach(f => {
            this.boneFaces[f].ref.current.position.set(...pos[f]);
            this.boneFaces[f].ref.current.rotation.set(...rot[f]);
        });
    }


    initCube() {
        // Raise the cube up half unit and assmebly the faces
        this.core.current.position.set(...this.initPos);
        this.assemblyFaces(['T', 'D', 'F', 'B', 'L', 'R']);
        
        // Set default values for cube net
        this.setManifestMatrix(VALID_NETS[0].getOutputMatrix());
        this.setBaseId(0);

        // Set default time parameters
        this.setAnimationMode('compact');
        this.tValues = [1,1,1,1,1];
        this.t100 = 100;

        // Set init and dirty flags
        this.init = true;
        this.meshDirty = true;

        console.log('[Cube Init: done]');
    }

    checkAllMeshRefs() {
        this.allRefsReady = this.core && this.faceKeys.every(f => {
            const currFace = this.boneFaces[f];
            return this.fieldKeys.every(e => currFace[e]);
        });

        if (!this.allRefsReady) {
            console.warn('[Loading mesh ref of core...]');
            return;
        }
        console.log('[Ref Check Passed]');
        this.initCube();
    };

    rotateTo(rotationKey) {
        if (this.isRotating) {
            return;
        }
        if (!CubeEngine.CUBE_GROUP.hasOwnProperty(rotationKey)) {
            throw new Error(`Invalid rotation key: '${rotationKey}'`);
        }
        this.nextPose = rotationKey;
        this.t = 0;
        this.isRotating = true;
        this.meshDirty = true;
    }

    rotate(op) {
        if (this.isRotating) {
            return;
        }
        this.nextPose = CubeEngine.CUBE_GROUP[this.nextPose][op];
        this.t = 0;
        this.isRotating = true;
        this.meshDirty = true;
    }

    resetTimeParameters(value=0) {
        this.t100 = value;
        this.p200 = value;
        if (this.sliderRef) {
            this.sliderRef.current.value = value;
        }
    }

    setManifestMatrix(matrix) {
        const getFacesCoordinate = () => {
            const list = [];
            for (let r = 0; r < 8; ++r) {
                for (let c = 0; c < 8; ++c) {
                    if (this.manifestMatrix[r][c] === 1) {
                        list.push({rid: r, cid: c});
                    }
                }
            }
            return list;
        }
        this.manifestMatrix = matrix;
        this.faceIndices = getFacesCoordinate();
        this.meshDirty = true;
        this.resetTimeParameters(100);
    }

    setBaseId(baseId) {
        this.baseId = baseId;
        this.meshDirty = true;
        this.resetTimeParameters(100);
    }

    setAnimationMode(mode) {
        this.animationMode = mode;
        this.meshDirty = true;
        this.resetTimeParameters(100);
    }

    setAutoPlay(flag) {
        if (flag) {
            this.p200 = this.t100;
        }
        this.isAutoPlay = flag;
    }

    setSliderRef(sliderRef) {
        if (sliderRef && !this.sliderRef) {
            this.sliderRef = sliderRef;
        } 
    }

    updateRotation(delta) {
        // rotation sentinel
        if (!this.isRotating) {
            return;
        }

        this.currSpeed += this.ACC;
        this.t += delta * this.currSpeed;
        
        const qa = CubeEngine.CUBE_GROUP[this.currPose].qtn;
        const qb = CubeEngine.CUBE_GROUP[this.nextPose].qtn;
        const qm = new THREE.Quaternion();

        // Finsih rotation
        if (this.t >= 1) {
            this.core.current.quaternion.copy(qb);
            this.t = 1;
            this.isRotating = false;
            this.currPose = this.nextPose;
            this.currSpeed = this.initSpeed;
            return;
        }

        // Process rotation for current frame
        const easedT = this.easeFn(this.t);
        qm.slerpQuaternions(qa, qb, easedT);
        this.core.current.quaternion.copy(qm);
    }


    updateAnimation(delta) {
        // Guard: Refs check and cube init
        if (!this.allRefsReady) {
            this.checkAllMeshRefs();
            return;
        }

        // Animation logic
        if (this.isRotating) {
            this.updateRotation(delta);
        }
        else if (this.meshDirty) {
            this.computeHierarchyGuide();
            this.rebuildMeshHierarchy();
            this.meshDirty = false;
        } 
        else {
            if (this.isAutoPlay) {
                this.updateT100FromDelta(delta);
                if (this.sliderRef) {
                    this.sliderRef.current.value = this.t100;
                }
            }
            if (this.guide) {
                this.updateCubeNetTransformation();
            }
        }
    }

    
    /**
     * Computes the hierarchical structure and relative rotations of cube net faces
     * starting from a base face. It traverses the outline matrix recursively to:
     * 
     * 1. Build a labeled hierarchy matrix (`hierMatrix`) where each face is marked
     *    with its label and rotation number.
     * 2. Generate an assembly guide (`guide`) recording parent-child relationships
     *    and rotation (in radians) needed to align each face with its parent.
     */
    computeHierarchyGuide() {
        // Init hierarchy matrix and assembly guide
        const hierMatrix = this.manifestMatrix.map(row => 
            row.map(cell => (cell === 1 ? 'xx' : '__'))
        );
        const guide = [];

        // Define a dfs helper
        function dfs(pKey, currFace, r, c) {
            if (r < 0 || r === 8 || c < 0 || c === 8) {
                return;  // Out of bound
            }
            if (hierMatrix[r][c] !== 'xx') {
                return;  // Visited
            }
            // add a piece of record to the guide
            hierMatrix[r][c] = currFace;
            const cKey = currFace[0];
            const rNum = Number(currFace[1]);

            if (pKey) {
                const edge = CubeEngine.FACE_AXIS_MAP[pKey][cKey];
                const rotation = CubeEngine.ROT_TABLE[pKey][cKey];
                const position = CubeEngine.POS_TABLE[edge];
                guide.push({ 
                    pKey, cKey, edge, rotation, position 
                });
            }
            
            // Process child-nodes recursively 
            const list = CubeEngine.CHILD_FACE_ROTATION[cKey][rNum];
            dfs(cKey, list[0], r, c + 1);
            dfs(cKey, list[1], r - 1, c);
            dfs(cKey, list[2], r, c - 1);
            dfs(cKey, list[3], r + 1, c);
        }
        
        // Add base face to matrix
        const baseFace = CubeEngine.CUBE_GROUP[this.currPose].base
        const {rid, cid} = this.faceIndices[this.baseId];

        // Call dfs to update hierMatrix and guide
        dfs(null, baseFace, rid, cid);
        this.hierMatrix = hierMatrix;
        this.guide = guide;
    }
    
    
    // Detaches and resets all face transforms except for the base face ('down').
    deconstructMeshHierarchy() {
        // eslint-disable-next-line
        for (const [key, face] of Object.entries(this.boneFaces)) {
            const group = face.ref?.current;
            if (!group) {
                continue;
            }
            if (group.parent) {
                group.parent.remove(group); // Remove from scene graph
            }
            group.position.set(0, 0, 0);
            group.rotation.set(0, 0, 0);
        }
    }
    
    
    /**
     * Rebuilds the cube face hierarchy based on the provided assembly guide.
     */
    rebuildMeshHierarchy() {
        if (!this.boneFaces || !this.guide) {
            return;
        }
        this.deconstructMeshHierarchy();
        
        // handle base face
        const baseFace = CubeEngine.CUBE_GROUP[this.currPose].base;
        const baseKey = baseFace[0];
        const baseGroup = this.boneFaces[baseKey].ref.current;
        this.core.current.add(baseGroup);
        this.assemblyFaces([baseKey]);
        
        // Rebuild the hierarchy based on the guide
        this.guide.forEach(({ pKey, cKey, rotation, position, edge }, i) => {
            
            // Get the parent and child objects
            const parentEdgeGroup = this.boneFaces[pKey][cKey].current;
            const childGroup = this.boneFaces[cKey].ref.current;
    
            if (!parentEdgeGroup || !childGroup) {
                console.warn(`Failed to rebind ${cKey} to ${pKey}.`);
                return;
            }
            // Attach to parent and adjust child transformation
            parentEdgeGroup.add(childGroup);
            childGroup.position.set(...position);
            childGroup.rotation.set(0, rotation * CubeEngine.HALF_PI, 0);

            const { axis, rad90 } = CubeEngine.ROT_AXES[edge];
            const edgeGroup = this.boneFaces[pKey][cKey].current;
            edgeGroup.rotation[axis] = this.tValues[i] * rad90;
        });

        console.log('[Mesh Hierarchy Rebuild: done]');
    }
    
    updateT100FromDelta(delta) {
        const speed = 20;
        const MAX_PROGRESS = 200;

        this.p200 += delta * speed;
        if (this.p200 >= MAX_PROGRESS) {
            this.p200 -= MAX_PROGRESS;
        }
        this.t100 = Math.min(this.p200, MAX_PROGRESS - this.p200);
    }
    
    /** Animation update function */
    updateCubeNetTransformation() {
        // Compute a list of 5 normalized t-values
        this.tValues = this.computeTValues();

        for (let i = 0; i < 5; ++i) {
            // access guide record
            const { pKey, cKey, edge } = this.guide[i];
            const { axis, rad90 } = CubeEngine.ROT_AXES[edge];

            // perform rotation on edges in guide note
            const edgeGroup = this.boneFaces[pKey][cKey].current;
            edgeGroup.rotation[axis] = this.tValues[i] * rad90;
        }
    }
    
    // Compute t values for each animation mode
    computeTValues() {
        const EDGE_NUM = 5;
        if (this.animationMode === 'compact') {
            const t = this.t100 / 100;
            const easeT = easeSinInOut(t)
            return Array(EDGE_NUM).fill(easeT);
        }

        const tValues = Array(EDGE_NUM).fill(0);
        let temp = this.t100;
        for (let i = 0; i < EDGE_NUM; ++i) {
            if (temp <= 0) {
                break;
            }
            tValues[i] = Math.min(temp / 20, 1);
            if (this.animationMode !== 'compact') {
                tValues[i] = easeCubicInOut(tValues[i]);
            }
            temp -= 20;
        }
    
        if (this.animationMode === 'rootFirst') {
            return tValues;
        }
        if (this.animationMode === 'leaveFirst') {
            return tValues.reverse();
        }
        return Array(EDGE_NUM).fill(1);
    }

    inCubeMode() {
        return this.t100 === 100 && !this.isAutoPlay;
    }

    handleVertexHover(vid, flag, faceLabel) {
        const vertex = this.vertices[vid]?.current;
        if (!vertex) return;

        // Hover out: restore cached material
        if (flag === 1) {
            vertex.material = HOVER_MAT;
            return;
        }
        const selected = this.selected.vSet.has(vid);
        const mat = {
            coach: NEW_VERTICES[faceLabel],
            ogre: OGRE_MAT.bodyV.new,
        }[this.cubeType];
        vertex.material = selected ? SELECT_MAT : mat;
    }

    handleVertexClick(vid, faceLabel) {
        const vertex = this.vertices[vid]?.current;
        if (!vertex) return;

        const mat = {
            coach: NEW_VERTICES[faceLabel],
            ogre: OGRE_MAT.bodyV.new,
        }[this.cubeType];

        if (this.selected.vSet.has(vid)) {
            vertex.material = mat;
            vertex.scale.set(1, 1, 1);
            this.selected.vSet.delete(vid);
        }
        else {
            vertex.material = SELECT_MAT;
            vertex.scale.set(1.1, 1.2, 1.1);
            this.selected.vSet.add(vid);
        }
    }

    handleFaceHover(fid, flag) {
        const face = this.faces[fid]?.current;
        if (!face) return;

        // Hover out: restore cached material
        if (flag === 1) {
            face.material = FACE_HOV_MAT;
            return;
        }
        const selected = this.selected.fSet.has(fid);
        face.material = selected ? FACE_SEL_MAT : FACE_CACHE;
        face.scale.set(1, 1, (selected) ? 2.05: 1);
    }

    handleFaceClick(fid) {
        const face = this.faces[fid]?.current;
        if (!face) return;

        if (this.selected.fSet.has(fid)) {
            console.log(`vid: ${fid}`);
            face.material = FACE_CACHE;
            face.scale.set(1, 1, 1);
            this.selected.fSet.delete(fid);
        }
        else {
            face.material = FACE_SEL_MAT;
            face.scale.set(1, 1, 2.05);
            this.selected.fSet.add(fid);
        }
    }
}