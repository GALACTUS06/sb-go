import type { BuildingBranch } from '../domain/types'

export const melvilleBranch: BuildingBranch = {
  id: 'melville',
  title: 'Melville Library',
  sequential: false,
  floorPlanKey: 'maps/real/melville-floor-p3.png',
  enterCopy:
    'Frank Melville Jr. Memorial Library — scan archive echoes, then enter the 1963 Memory Layer.',
  completeToast: 'Melville branch complete — you carry 1963 forward.',
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
      imageKey: 'maps/places/melville-open-stacks.jpg',
      rewardFlag: 'melville.openStacks',
      copy:
        'July 1963: the first campus library opens as an open-stack research hall—carrels, study rooms, and shelves you walk yourself. Knowledge here was meant to be browsed, not gated.',
    },
    {
      id: 'melville-name',
      x: 0.29,
      y: 0.49,
      label: 'Why “Melville”?',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/melville-ward-name.jpg',
      rewardFlag: 'melville.naming',
      copy:
        'Named for Frank Melville Jr.—father of Ward Melville. Ward’s 1950s land gift made the Stony Brook campus possible; the library name (used from 1964) stitches that family story to the campus spine.',
    },
    {
      id: 'expansion-wings',
      x: 0.7,
      y: 0.44,
      label: 'Wings Around the Core',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/melville-wings.jpg',
      rewardFlag: 'melville.expansion',
      copy:
        'The 1963 building was modular on purpose. By 1971, Ervin Galantay wrapped four five-story wings around that first module—old footprint kept, new capacity for a booming university.',
    },
    {
      id: 'bridge-echo-story',
      x: 0.44,
      y: 0.72,
      label: 'Bridge to Nowhere',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/melville-bridge.jpg',
      rewardFlag: 'melville.bridge',
      copy:
        'Started in 1967 to link Fine Arts, the Union, and the Library—then unfinished so long that students nicknamed it the Bridge to Nowhere. In 1977 it finally connected: ~475 feet of campus stubbornness.',
    },
    {
      id: 'special-collections',
      x: 0.65,
      y: 0.64,
      label: 'Archives Vault',
      interaction: 'hold',
      holdMs: 1000,
      imageKey: 'maps/places/melville-archives.jpg',
      rewardFlag: 'melville.specialCollections',
      copy:
        'Special Collections & University Archives keep the primary sources behind campus lore—bulletins, photos, and institutional memory. Every echo you scan has a folder somewhere.',
    },
    {
      id: 'bridge-echo',
      x: 0.5,
      y: 0.4,
      label: 'Enter 1963 Memory →',
      interaction: 'jump',
      imageKey: 'maps/places/melville-building.jpg',
      // Unlock early so players can find the memory layer
      requiresFlags: ['melville.openStacks', 'melville.naming'],
      jumpToWorldId: 'melville-1963',
      rewardFlag: 'melville.jumpStarted',
      copy:
        'The modular 1963 library flickers open—card catalogs, unfinished wings, a campus still inventing itself. Step into the Memory Layer.',
      lockedCopy: 'Scan Open Stacks and Why “Melville”? first — then the 1963 door opens.',
    },
  ],
  worlds: [
    {
      id: 'melville-1963',
      title: 'Melville 1963 · Memory Layer',
      backgroundKey: 'maps/melville-1963.svg',
      exitLabel: 'Return to present',
      hotspots: [
        {
          id: 'world-card-catalog',
          x: 0.3,
          y: 0.4,
          label: 'Card Catalog',
          interaction: 'hold',
          holdMs: 900,
          imageKey: 'maps/places/melville-card-catalog.jpg',
          rewardFlag: 'melville.world.catalog',
          copy:
            'Before search bars: wooden drawers, subject cards, and shared patience. In 1963 this was the campus search engine.',
        },
        {
          id: 'world-modular-plan',
          x: 0.68,
          y: 0.38,
          label: 'Modular Plan',
          interaction: 'hold',
          holdMs: 900,
          imageKey: 'maps/places/melville-modular.jpg',
          rewardFlag: 'melville.world.modular',
          copy:
            'Damaz, Pokorny & Weigel designed a library that could grow bay by bay—toward a million volumes for ten thousand students. The wings came later; the idea was here first.',
        },
        {
          id: 'world-return-seal',
          x: 0.5,
          y: 0.78,
          label: 'Seal the Echo',
          interaction: 'tap',
          requiresFlags: ['melville.world.catalog', 'melville.world.modular'],
          rewardFlag: 'melville.world.complete',
          copy:
            '1963 settles into the present stacks. Carry the modular promise forward—and finish any remaining echoes on the floor plate.',
        },
      ],
    },
  ],
}
