import type { BuildingBranch } from '../domain/types'

export const wangBranch: BuildingBranch = {
  id: 'wang',
  title: 'Charles B. Wang Center',
  sequential: true,
  floorPlanKey: 'maps/real/wang-gallery.png',
  enterCopy:
    'Wang Center (opened 2002) — follow the path, then enter the Mirror Garden Memory Layer.',
  completeToast: 'Wang Center branch complete — cultures still in conversation.',
  completeWhenFlags: [
    'wang.arrival',
    'wang.water',
    'wang.bridge',
    'wang.tower',
    'wang.gallery',
    'wang.crossroads',
    'wang.world.complete',
  ],
  hotspots: [
    {
      id: 'gate-arrival',
      x: 0.5,
      y: 0.6,
      label: 'Threshold · 2002',
      interaction: 'hold',
      holdMs: 900,
      imageKey: 'maps/places/wang-building.jpg',
      rewardFlag: 'wang.arrival',
      copy:
        'October 22, 2002: the Charles B. Wang Center opens after a landmark gift—then the largest private donation in SUNY history. Red trellis entries invite you across a cultural threshold.',
    },
    {
      id: 'courtyard-water',
      x: 0.21,
      y: 0.48,
      label: 'Gardens & Water',
      interaction: 'hold',
      holdMs: 900,
      imageKey: 'maps/places/wang-garden.jpg',
      requiresFlags: ['wang.arrival'],
      rewardFlag: 'wang.water',
      copy:
        'Architect P.H. Tuan framed courts, water, and bridges in glass so indoors and sky stay in dialogue. A Zen rock garden below evokes China, Korea, and Japan in three beds.',
    },
    {
      id: 'arch-bridge',
      x: 0.47,
      y: 0.455,
      label: 'Shanghai → Stony Brook',
      interaction: 'hold',
      holdMs: 900,
      imageKey: 'maps/places/wang-gift.jpg',
      requiresFlags: ['wang.water'],
      rewardFlag: 'wang.bridge',
      copy:
        'Charles B. Wang (CA Technologies) called himself “doubly blessed”—cherishing Shanghai and the Long Island home that grew around his company. The center was meant as a marketplace of cultural awakenings.',
    },
    {
      id: 'pagoda-tower',
      x: 0.38,
      y: 0.28,
      label: 'Pagoda Skyline',
      interaction: 'quiz',
      imageKey: 'maps/places/wang-pagoda.jpg',
      requiresFlags: ['wang.bridge'],
      rewardFlag: 'wang.tower',
      copy:
        'A ~100-foot octagonal pagoda abstraction crowns the roof—temple memory rendered in modern metal. You can spot the silhouette before the facade appears.',
      quiz: {
        prompt: 'What crowning form marks the Wang Center on the campus skyline?',
        options: [
          'An octagonal pagoda-like tower',
          'A Gothic stone spire',
          'A stadium light mast',
        ],
        answerIndex: 0,
        hint: 'Think temple silhouette—octagonal layers on soaring poles.',
        failCopy: 'Not that—look for the pagoda abstraction above the trees.',
      },
    },
    {
      id: 'gallery-wing',
      x: 0.7,
      y: 0.45,
      label: 'Living Venue',
      interaction: 'hold',
      holdMs: 900,
      imageKey: 'maps/places/wang-lantern.jpg',
      requiresFlags: ['wang.tower'],
      rewardFlag: 'wang.gallery',
      copy:
        'Inside: theater, galleries, lecture hall, chapel, dining—120,000 sq ft built for exhibitions, film, performance, and scholarship, not a sealed monument.',
    },
    {
      id: 'jasmine-edge',
      x: 0.79,
      y: 0.45,
      label: 'Jasmine Crossroads',
      interaction: 'hold',
      holdMs: 900,
      imageKey: 'maps/places/wang-jasmine.jpg',
      requiresFlags: ['wang.gallery'],
      rewardFlag: 'wang.crossroads',
      copy:
        'Jasmine (and later Jasmine Market) stitches daily student life—bibimbap, snacks, friends—to the cultural mission upstairs. Culture here includes lunch.',
    },
    {
      id: 'mirror-garden',
      x: 0.35,
      y: 0.52,
      label: 'Enter Mirror Garden →',
      interaction: 'jump',
      imageKey: 'maps/places/wang-water.jpg',
      // Unlock after the gift story so memory is findable mid-path
      requiresFlags: ['wang.arrival', 'wang.water', 'wang.bridge'],
      jumpToWorldId: 'wang-mirror',
      rewardFlag: 'wang.jumpStarted',
      copy:
        'The garden doubles. Lantern glass and still water open a Memory Layer—reflection as archive. Step through.',
      lockedCopy: 'Complete Threshold, Gardens & Water, and Shanghai → Stony Brook first.',
    },
  ],
  worlds: [
    {
      id: 'wang-mirror',
      title: 'Mirror Garden · Memory Layer',
      backgroundKey: 'maps/wang-mirror.svg',
      exitLabel: 'Step back',
      hotspots: [
        {
          id: 'mirror-lantern',
          x: 0.33,
          y: 0.38,
          label: 'Lantern Glass',
          interaction: 'hold',
          holdMs: 900,
          imageKey: 'maps/places/wang-lantern.jpg',
          rewardFlag: 'wang.world.lantern',
          copy:
            'Shoji-like screens and lanterned glow turn modern glass into a cultural threshold—light held like paper-screen memory.',
        },
        {
          id: 'mirror-still-water',
          x: 0.66,
          y: 0.58,
          label: 'Still Water',
          interaction: 'hold',
          holdMs: 900,
          imageKey: 'maps/places/wang-water.jpg',
          rewardFlag: 'wang.world.water',
          copy:
            'Pools slow Nicolls Road rush into pause. In this layer, water archives the campus twice—see it, remember it.',
        },
        {
          id: 'mirror-seal',
          x: 0.5,
          y: 0.8,
          label: 'Close the Mirror',
          interaction: 'tap',
          requiresFlags: ['wang.world.lantern', 'wang.world.water'],
          rewardFlag: 'wang.world.complete',
          copy:
            'The mirror settles. Return to the walking path and finish Jasmine if you have not—culture is both ritual and daily return.',
        },
      ],
    },
  ],
}
