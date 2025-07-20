# Mental Yoga

## Overview
...

## Design Specifications

### Problem Levels

We design 6 level of problems (from easy to challenging) on testing the mental simulation process of the transformation between a cube to some valid net, while maintaining correct geometric and physical properties.

#### Level 1
- **Label:** `valid-net`
- **Description:** Given a 2D pattern of six connected square faces, determine whether it forms a valid cube net.
- **Prompt:** "Is the given pattern a valid cube net?"

#### Level 2
- **Label:** `opposite-faces`
- **Description:** Given a valid cube net with one face highlighted, identify the face opposite to it when the net is folded into a cube.
- **Prompt:** "Select the face opposite to the highlighted one when folded into a cube."

#### Level 3
- **Label:** `overlapping-edges`
- **Description:** Given a valid cube net with one edge highlighted, identify the edge that overlaps with it when the net is folded into a cube.
- **Prompt:** "Select the edge that overlaps with the highlighted one when folded into a cube."

#### Level 4
- **Label:** `overlapping-vertices`
- **Description:** Given a valid cube net with one vertex highlighted, identify the two vertices that overlap with it when the net is folded into a cube.
- **Prompt:** "Select the two vertices that overlap with the highlighted one when folded into a cube."

#### Level 5
- **Label:** `face-orientation-tracing-folding`
- **Description:** Given a valid cube net with one face marked as the base, and a "Huntress" cube that has arrows on two of its faces, select the correct orientation of these arrows on the unfolded net.
- **Prompt:** "Select the correct arrow orientations on the net when the cube is placed on the highlighted base face and unfolded."

#### Level 6
- **Label:** `face-orientation-tracing-unfolding`
- **Description:** Given a valid cube net with one face marked as the base, and an "Evil-Eye" cube that has eye symbols on three faces, rotate the cube so that, when unfolded at the base, it matches the given net pattern.
- **Prompt:** "Rotate the cube so that its unfolded net matches the given pattern when opened at the highlighted base face."



## Coordinate System Specification

# FoldableCube
```
    FoldableCube
    |- BoneCube
    |   |- 6 face coord * (4 edge coord, 1 skin-slot coord) 
    |   |- anim
    |
    |- SkinCube
        |- rotationMap
        |- skinRefs
```