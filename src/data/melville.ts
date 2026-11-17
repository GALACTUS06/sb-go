import type { BuildingBranch } from '../domain/types'

export const melvilleBranch: BuildingBranch = {
  id: 'melville',
  title: 'Melville Library',
  sequential: false,
  floorPlanKey: 'maps/real/melville-floor-p3.png',
  enterCopy:
    'Frank Melville Jr. Memorial Library — scan archive stops, then open the Library Memory layer (real photos).',
  completeToast: 'Melville branch complete',
  completeWhenFlags: [
    'melville.openStacks',
    'melville.naming',
    'melville.expansion',
    'melville.bridge',
    'melville.specialCollections',
    'melville.world.complete',
  ],
  hotspots: [
    {
      id: 'open-stacks',
      x: 0.5,
      y: 0.335,
      label: 'Open Stacks (1963)',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/real/melville-place-interior.jpg',
      rewardFlag: 'melville.openStacks',
      copy:
        'July 1963: the first campus library opens as an open-stack research hall. The North Reading Room still carries that workaday spirit—seats, outlets, and shelves you walk yourself.',
    },
    {
      id: 'melville-name',
      x: 0.29,
      y: 0.49,
      label: 'Why “Melville”?',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/real/melville-place-building.jpg',
      rewardFlag: 'melville.naming',
      copy:
        'Named for Frank Melville Jr.—father of Ward Melville. Ward’s land gift made the Stony Brook campus possible; from 1964 the library carried that family name.',
    },
    {
      id: 'expansion-wings',
      x: 0.7,
      y: 0.44,
      label: 'Wings Around the Core',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/real/melville-place-exterior.jpg',
      rewardFlag: 'melville.expansion',
      copy:
        'The 1963 building was modular. By 1971, four five-story wings wrapped the original module—old footprint kept, capacity for a booming university.',
    },
    {
      id: 'bridge-echo-story',
      x: 0.44,
      y: 0.72,
      label: 'Bridge to Nowhere',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/real/melville-place-building.jpg',
      rewardFlag: 'melville.bridge',
      copy:
        'Started in 1967 to link Fine Arts, the Union, and the Library—unfinished so long students nicknamed it the Bridge to Nowhere. Connected in 1977 (~475 ft).',
    },
    {
      id: 'special-collections',
      x: 0.65,
      y: 0.64,
      label: 'Archives Vault',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/real/melville-place-interior.jpg',
      rewardFlag: 'melville.specialCollections',
      copy:
        'Special Collections & University Archives keep the primary sources behind campus lore—bulletins, photos, institutional memory.',
    },
    {
      id: 'bridge-echo',
      x: 0.5,
      y: 0.4,
      label: 'Enter Library Memory →',
      interaction: 'jump',
      imageKey: 'maps/places/real/melville-place-building.jpg',
      requiresFlags: ['melville.openStacks', 'melville.naming'],
      jumpToWorldId: 'melville-memory',
      rewardFlag: 'melville.jumpStarted',
      copy:
        'Open the Melville Library memory layer—real exterior and reading-room photos from campus.',
      lockedCopy: 'Scan Open Stacks and Why “Melville”? first.',
    },
  ],
  worlds: [
    {
      id: 'melville-memory',
      title: 'Melville Library Memory',
      backgroundKey: 'maps/melville-memory.jpg',
      exitLabel: 'Back to Melville map',
      hotspots: [
        {
          id: 'mem-exterior',
          x: 0.28,
          y: 0.62,
          label: 'Library Exterior',
          interaction: 'hold',
          holdMs: 900,
          imageKey: 'maps/places/real/melville-place-exterior.jpg',
          rewardFlag: 'melville.world.catalog',
          copy:
            'Real exterior of the Frank Melville Jr. Memorial Library. Frame this facade when you stand on the Academic Mall side.',
        },
        {
          id: 'mem-interior',
          x: 0.75,
          y: 0.62,
          label: 'North Reading Room',
          interaction: 'hold',
          holdMs: 900,
          imageKey: 'maps/places/real/melville-place-interior.jpg',
          rewardFlag: 'melville.world.modular',
          copy:
            'North Reading Room—students’ workplace with long tables and stacks beyond. Match this interior view to log the stop.',
        },
        {
          id: 'mem-seal',
          x: 0.5,
          y: 0.22,
          label: 'Seal the Echo',
          interaction: 'tap',
          requiresFlags: ['melville.world.catalog', 'melville.world.modular'],
          rewardFlag: 'melville.world.complete',
          imageKey: 'maps/places/real/melville-place-building.jpg',
          copy:
            'Library memory sealed. Return to the floor plate and finish any remaining echoes.',
        },
      ],
    },
  ],
}
