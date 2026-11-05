import { OnboardingData, ScheduleEvent } from '../types';

/**
 * Helper to parse "HH:MM" into minutes from midnight.
 */
function parseTimeToMinutes(timeStr: string, defaultMinutes: number): number {
  if (!timeStr || typeof timeStr !== 'string') return defaultMinutes;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return defaultMinutes;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return defaultMinutes;
  return (h * 60 + m) % (24 * 60);
}

/**
 * Helper to format minutes from midnight into 24h "HH:MM".
 */
function formatMinutesToTime(totalMinutes: number): string {
  let normalized = totalMinutes % (24 * 60);
  if (normalized < 0) normalized += 24 * 60;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

/**
 * Add or subtract minutes from a "HH:MM" time string.
 */
function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const currentMinutes = parseTimeToMinutes(timeStr, 390);
  return formatMinutesToTime(currentMinutes + minutesToAdd);
}

export const generateUserSchedule = (user: OnboardingData): ScheduleEvent[] => {
  const wakeTime = user.rhythm.wakeUpTime || '06:30';
  const depTime = user.rhythm.departureTime || '08:30';
  const retTime = user.rhythm.returnTime || '18:30';
  const sleepHours = user.rhythm.sleepHours || 7.5;
  const duration = user.training.durationMinutes || 45;

  const isMorningWorkout = user.training.preferredTime === 'morning';

  // 1. Wake Up event anchored to user's specified wake-up time
  const events: ScheduleEvent[] = [
    {
      id: 'sch-1',
      time: wakeTime,
      title: 'Wake Up & Circadian Hydration',
      type: 'recovery',
      description: 'Drink 500ml water to break overnight dehydration.',
      duration: '15m',
    },
  ];

  if (isMorningWorkout) {
    // 2. Pre-workout anchor: +20m after wake up
    const preWorkoutTime = addMinutesToTime(wakeTime, 20);
    events.push({
      id: 'sch-2',
      time: preWorkoutTime,
      title: 'Pre-Workout Energy Anchor',
      type: 'meal',
      description: 'Light hydration, black coffee, or banana before training.',
      duration: '15m',
    });

    // 3. Morning workout: +40m after wake up
    const workoutTime = addMinutesToTime(wakeTime, 40);
    events.push({
      id: 'sch-3',
      time: workoutTime,
      title: `${duration}-Min Training Window`,
      type: 'workout',
      description: `Planned ${duration}m session (${user.training.environment === 'home' ? 'Home Calisthenics' : 'Gym'}).`,
      duration: `${duration}m`,
    });

    // 4. Post-workout breakfast: immediately following training session
    const breakfastTime = addMinutesToTime(workoutTime, duration + 10);
    events.push({
      id: 'sch-4',
      time: breakfastTime,
      title: 'Post-Workout Breakfast',
      type: 'meal',
      description: 'High-protein breakfast from allocated Indian diet staples.',
      duration: '25m',
    });
  } else {
    // Morning without training: breakfast +45m after wake up
    const breakfastTime = addMinutesToTime(wakeTime, 45);
    events.push({
      id: 'sch-2',
      time: breakfastTime,
      title: 'Nutrient-Dense Breakfast',
      type: 'meal',
      description: 'High-protein breakfast from allocated Indian diet staples.',
      duration: '25m',
    });
  }

  // 5. Work / College departure anchored to user's transit departure time
  events.push({
    id: 'sch-5',
    time: depTime,
    title: 'Work / College Transit Departure',
    type: 'work',
    description: `Commute and focused occupational block (${user.rhythm.occupation.replace(/_/g, ' ')}).`,
    duration: 'Transit',
  });

  // 6. Mid-Day Lunch: midday between departure and return, or centered around 13:00
  const depMinutes = parseTimeToMinutes(depTime, 510);
  const retMinutes = parseTimeToMinutes(retTime, 1110);
  let lunchMinutes = Math.round((depMinutes + retMinutes) / 2);
  // Keep lunch in realistic 12:30 - 14:00 range
  if (lunchMinutes < 750) lunchMinutes = 780; // 13:00
  if (lunchMinutes > 870) lunchMinutes = 810; // 13:30
  const lunchTime = formatMinutesToTime(lunchMinutes);

  events.push({
    id: 'sch-6',
    time: lunchTime,
    title: 'Balanced Mid-Day Lunch',
    type: 'meal',
    description: 'Protein staple with complex carbohydrates (dal, roti, sabzi, curd).',
    duration: '30m',
  });

  // 7. Return Home Transit Transition anchored to user's return time
  events.push({
    id: 'sch-7',
    time: retTime,
    title: 'Return Home & Transit Transition',
    type: 'work',
    description: 'Shift from occupational focus to evening routine and unwind.',
    duration: 'Transit',
  });

  if (!isMorningWorkout) {
    // 8. Evening workout: +30m after returning home
    const eveningWorkoutTime = addMinutesToTime(retTime, 30);
    events.push({
      id: 'sch-8',
      time: eveningWorkoutTime,
      title: `${duration}-Min Evening Training Window`,
      type: 'workout',
      description: `Planned ${duration}m session (${user.training.environment === 'home' ? 'Home Calisthenics' : 'Gym'}).`,
      duration: `${duration}m`,
    });

    // 9. Post-workout dinner: +15m after evening training
    const dinnerTime = addMinutesToTime(eveningWorkoutTime, duration + 15);
    events.push({
      id: 'sch-9',
      time: dinnerTime,
      title: 'Post-Workout Dinner Course',
      type: 'meal',
      description: 'Whole-food dinner fulfilling daily protein & calorie targets.',
      duration: '30m',
    });
  } else {
    // Standard evening dinner: +60m after return home
    const dinnerTime = addMinutesToTime(retTime, 60);
    events.push({
      id: 'sch-9',
      time: dinnerTime,
      title: 'Evening Dinner Course',
      type: 'meal',
      description: 'Whole-food dinner fulfilling daily protein & calorie targets.',
      duration: '30m',
    });
  }

  // 10. Restorative Bedtime: calculated by subtracting sleep target from wake time
  const wakeMinutes = parseTimeToMinutes(wakeTime, 390);
  const sleepMinutesTotal = Math.round(sleepHours * 60);
  const bedtimeMinutes = wakeMinutes - sleepMinutesTotal;
  const bedtime = formatMinutesToTime(bedtimeMinutes);

  events.push({
    id: 'sch-10',
    time: bedtime,
    title: `Restorative Sleep Window (${sleepHours} hrs)`,
    type: 'sleep',
    description: `Target ${sleepHours} hours restorative sleep before ${wakeTime} wake-up.`,
    duration: `${sleepHours}h`,
  });

  return events;
};
