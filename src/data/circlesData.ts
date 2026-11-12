import { BrotherhoodCircle } from '../types/circles';

export const INITIAL_BROTHERHOOD_CIRCLES: BrotherhoodCircle[] = [
  {
    id: 'circle-apex-ridge',
    name: 'Apex Ridge Ascenders',
    tagline: 'High-Altitude Trail Grinds & Summit Mastery',
    description: 'A private circle of brothers pushing boundaries on steep trail grades, high-altitude ridges, and weighted mountain ascents. We measure grit in vertical meters and unbroken brotherhood.',
    crestIcon: 'Mountain',
    themeColor: '#10b981', // emerald
    isPrivate: true,
    inviteCode: 'RIDGE-5500',
    founderId: 'coach-kwame',
    founderName: 'Coach Kwame Osei',
    createdAt: '2026-08-01',
    focusCategory: 'Trail & Altitude',
    members: [
      {
        id: 'coach-kwame',
        name: 'Coach Kwame Osei',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 6 — PRIDE LEADER',
        role: 'Founder',
        joinedAt: '2026-08-01',
        stats: {
          totalPoints: 2450,
          challengesCompleted: 8,
          currentStreak: 48,
          weeklyContribution: 38.5
        }
      },
      {
        id: 'current-user',
        name: 'You (Athlete)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 4 — PANTHER',
        role: 'Brother',
        joinedAt: '2026-08-15',
        isCurrentUser: true,
        stats: {
          totalPoints: 1820,
          challengesCompleted: 5,
          currentStreak: 12,
          weeklyContribution: 24.8
        }
      },
      {
        id: 'm-2',
        name: 'Marcus Adebayo',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 4 — PANTHER',
        role: 'Officer',
        joinedAt: '2026-08-05',
        stats: {
          totalPoints: 1980,
          challengesCompleted: 6,
          currentStreak: 18,
          weeklyContribution: 31.2
        }
      },
      {
        id: 'm-4',
        name: 'Tendai Mutasa',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 4 — PANTHER',
        role: 'Brother',
        joinedAt: '2026-08-10',
        stats: {
          totalPoints: 1450,
          challengesCompleted: 4,
          currentStreak: 11,
          weeklyContribution: 19.5
        }
      }
    ],
    challenges: [
      {
        id: 'ch-apex-50k',
        circleId: 'circle-apex-ridge',
        title: '50km High-Altitude Ridge Trail Crusade',
        description: 'Accumulate 50 kilometers of outdoor trail running, rucking, or mountain ascents. No treadmills; earn your dirt in the fresh air.',
        category: 'Endurance',
        metric: 'distance',
        metricUnit: 'km',
        targetValue: 50,
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        status: 'active',
        xpReward: 650,
        badgeRewardName: 'Ridge Crusader Crest',
        createdBy: {
          id: 'coach-kwame',
          name: 'Coach Kwame Osei'
        },
        participants: [
          {
            memberId: 'coach-kwame',
            memberName: 'Coach Kwame Osei',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            currentValue: 42.6,
            completed: false,
            lastLogDate: 'Yesterday'
          },
          {
            memberId: 'm-2',
            memberName: 'Marcus Adebayo',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
            currentValue: 37.2,
            completed: false,
            lastLogDate: '2 days ago'
          },
          {
            memberId: 'current-user',
            memberName: 'You (Athlete)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            currentValue: 28.5,
            completed: false,
            lastLogDate: 'Today'
          },
          {
            memberId: 'm-4',
            memberName: 'Tendai Mutasa',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
            currentValue: 21.0,
            completed: false,
            lastLogDate: '3 days ago'
          }
        ]
      },
      {
        id: 'ch-vert-2000',
        circleId: 'circle-apex-ridge',
        title: 'Summit Vert: 2,000m Cumulative Elevation',
        description: 'Conquer 2,000 meters of vertical trail climbing. Hills build stamina, grit, and impenetrable leg power.',
        category: 'Trail & Elevation',
        metric: 'elevation',
        metricUnit: 'meters',
        targetValue: 2000,
        startDate: '2026-09-05',
        endDate: '2026-10-05',
        status: 'active',
        xpReward: 800,
        badgeRewardName: 'Goat of the Crag',
        createdBy: {
          id: 'm-2',
          name: 'Marcus Adebayo'
        },
        participants: [
          {
            memberId: 'coach-kwame',
            memberName: 'Coach Kwame Osei',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            currentValue: 1650,
            completed: false,
            lastLogDate: 'Today'
          },
          {
            memberId: 'current-user',
            memberName: 'You (Athlete)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            currentValue: 1240,
            completed: false,
            lastLogDate: 'Today'
          },
          {
            memberId: 'm-2',
            memberName: 'Marcus Adebayo',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
            currentValue: 1100,
            completed: false,
            lastLogDate: '2 days ago'
          },
          {
            memberId: 'm-4',
            memberName: 'Tendai Mutasa',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
            currentValue: 820,
            completed: false,
            lastLogDate: '4 days ago'
          }
        ]
      }
    ],
    activityFeed: [
      {
        id: 'act-1',
        circleId: 'circle-apex-ridge',
        authorName: 'Coach Kwame Osei',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        text: 'Logged 8.4 km on Ngong Ridge! The winds were heavy but the pace was steady. Brothers, keep putting in the miles!',
        timestamp: '2 hours ago',
        type: 'progress_logged'
      },
      {
        id: 'act-2',
        circleId: 'circle-apex-ridge',
        authorName: 'Marcus Adebayo',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        text: 'Passed 1,000m on the Summit Vert challenge! Climbing with 12kg ruck this morning.',
        timestamp: '6 hours ago',
        type: 'progress_logged'
      }
    ]
  },
  {
    id: 'circle-iron-clad',
    name: 'Iron Clad Calisthenics Circle',
    tagline: 'Pure Bodyweight Dominance & Ground Strength',
    description: 'Forging armor without barbells. Strict push-ups, explosive pull-ups, pistol squats, and hollow core holds. Strictly form over ego.',
    crestIcon: 'Shield',
    themeColor: '#eab308', // amber / gold
    isPrivate: true,
    inviteCode: 'IRON-1000',
    founderId: 'm-2',
    founderName: 'Marcus Adebayo',
    createdAt: '2026-08-10',
    focusCategory: 'Strength & Calisthenics',
    members: [
      {
        id: 'm-2',
        name: 'Marcus Adebayo',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 4 — PANTHER',
        role: 'Founder',
        joinedAt: '2026-08-10',
        stats: {
          totalPoints: 3100,
          challengesCompleted: 9,
          currentStreak: 18,
          weeklyContribution: 450
        }
      },
      {
        id: 'current-user',
        name: 'You (Athlete)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 4 — PANTHER',
        role: 'Officer',
        joinedAt: '2026-08-12',
        isCurrentUser: true,
        stats: {
          totalPoints: 2650,
          challengesCompleted: 7,
          currentStreak: 12,
          weeklyContribution: 380
        }
      },
      {
        id: 'm-3',
        name: 'Jabari Mensah',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 3 — HUNTER',
        role: 'Brother',
        joinedAt: '2026-08-14',
        stats: {
          totalPoints: 2150,
          challengesCompleted: 6,
          currentStreak: 14,
          weeklyContribution: 290
        }
      },
      {
        id: 'm-5',
        name: 'Kofi Boateng',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 2 — SCOUT',
        role: 'Brother',
        joinedAt: '2026-08-20',
        stats: {
          totalPoints: 1240,
          challengesCompleted: 3,
          currentStreak: 6,
          weeklyContribution: 160
        }
      }
    ],
    challenges: [
      {
        id: 'ch-iron-1000',
        circleId: 'circle-iron-clad',
        title: 'Century 1,000 Push-Up Crusade',
        description: 'Complete 1,000 chest-to-deck strict push-ups within 14 days. Sets of 25, 50, or 100 — every rep accounted for honestly.',
        category: 'Strength',
        metric: 'reps',
        metricUnit: 'reps',
        targetValue: 1000,
        startDate: '2026-09-08',
        endDate: '2026-09-22',
        status: 'active',
        xpReward: 750,
        badgeRewardName: 'Iron Chest Standard',
        createdBy: {
          id: 'm-2',
          name: 'Marcus Adebayo'
        },
        participants: [
          {
            memberId: 'm-2',
            memberName: 'Marcus Adebayo',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
            currentValue: 620,
            completed: false,
            lastLogDate: 'Today'
          },
          {
            memberId: 'current-user',
            memberName: 'You (Athlete)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            currentValue: 550,
            completed: false,
            lastLogDate: 'Today'
          },
          {
            memberId: 'm-3',
            memberName: 'Jabari Mensah',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
            currentValue: 430,
            completed: false,
            lastLogDate: 'Yesterday'
          },
          {
            memberId: 'm-5',
            memberName: 'Kofi Boateng',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
            currentValue: 280,
            completed: false,
            lastLogDate: '2 days ago'
          }
        ]
      }
    ],
    activityFeed: [
      {
        id: 'act-iron-1',
        circleId: 'circle-iron-clad',
        authorName: 'Jabari Mensah',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
        text: 'Knocked out 80 clean push-ups post-breakfast. Chest is on fire! Chasing you Marcus!',
        timestamp: '3 hours ago',
        type: 'progress_logged'
      }
    ]
  },
  {
    id: 'circle-dawn-patrol',
    name: 'Dawn Patrol 0500 Club',
    tagline: 'Awaken Before the World. Own the Day.',
    description: 'Up at 05:00 AM sharp. Cold water, morning breathwork, and non-negotiable physical training before emails or noise begin. Silent, ruthless consistency.',
    crestIcon: 'Flame',
    themeColor: '#f97316', // orange / flame
    isPrivate: true,
    inviteCode: 'DAWN-0500',
    founderId: 'm-4',
    founderName: 'Tendai Mutasa',
    createdAt: '2026-08-18',
    focusCategory: 'Dawn Discipline',
    members: [
      {
        id: 'm-4',
        name: 'Tendai Mutasa',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 4 — PANTHER',
        role: 'Founder',
        joinedAt: '2026-08-18',
        stats: {
          totalPoints: 1750,
          challengesCompleted: 5,
          currentStreak: 11,
          weeklyContribution: 5
        }
      },
      {
        id: 'coach-kwame',
        name: 'Coach Kwame Osei',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 6 — PRIDE LEADER',
        role: 'Brother',
        joinedAt: '2026-08-19',
        stats: {
          totalPoints: 2200,
          challengesCompleted: 7,
          currentStreak: 48,
          weeklyContribution: 6
        }
      },
      {
        id: 'current-user',
        name: 'You (Athlete)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        level: 'LEVEL 4 — PANTHER',
        role: 'Brother',
        joinedAt: '2026-08-22',
        isCurrentUser: true,
        stats: {
          totalPoints: 1600,
          challengesCompleted: 4,
          currentStreak: 12,
          weeklyContribution: 5
        }
      }
    ],
    challenges: [
      {
        id: 'ch-dawn-14',
        circleId: 'circle-dawn-patrol',
        title: '14-Day 05:00 AM Morning Training Protocol',
        description: 'Complete 14 workouts or mobility sessions logged before 07:00 AM. Proof of discipline over comfort.',
        category: 'Daily Discipline',
        metric: 'workouts',
        metricUnit: 'sessions',
        targetValue: 14,
        startDate: '2026-09-01',
        endDate: '2026-09-20',
        status: 'active',
        xpReward: 900,
        badgeRewardName: 'Dawn Warrior Crest',
        createdBy: {
          id: 'm-4',
          name: 'Tendai Mutasa'
        },
        participants: [
          {
            memberId: 'coach-kwame',
            memberName: 'Coach Kwame Osei',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            currentValue: 11,
            completed: false,
            lastLogDate: 'Today 05:15 AM'
          },
          {
            memberId: 'current-user',
            memberName: 'You (Athlete)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            currentValue: 9,
            completed: false,
            lastLogDate: 'Today 05:40 AM'
          },
          {
            memberId: 'm-4',
            memberName: 'Tendai Mutasa',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
            currentValue: 9,
            completed: false,
            lastLogDate: 'Today 05:30 AM'
          }
        ]
      }
    ],
    activityFeed: [
      {
        id: 'act-dawn-1',
        circleId: 'circle-dawn-patrol',
        authorName: 'Coach Kwame Osei',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        text: 'Session 11 complete at 05:15 AM. Cold shower done. The mind is clear and ready.',
        timestamp: '5 hours ago',
        type: 'progress_logged'
      }
    ]
  }
];
