'use client'

import { useState } from 'react'
import { getDayName } from '@/lib/utils'
import type { Workout, WorkoutExercise } from '@/lib/types'

function ExerciseBadges({ exercise }: { exercise: WorkoutExercise }) {
  const { sets, reps, weight, rest } = exercise
  if (!sets && !reps && !weight && !rest) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {sets && (
        <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">
          {sets} set
        </span>
      )}
      {reps && (
        <span className="text-[11px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md font-medium">
          {reps} tekrar
        </span>
      )}
      {weight && (
        <span className="text-[11px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-medium">
          {weight}
        </span>
      )}
      {rest && (
        <span className="text-[11px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md font-medium">
          {rest} din.
        </span>
      )}
    </div>
  )
}

/** Mantıksal egzersiz sayısını hesapla (süper set = 1 hareket) */
function getLogicalExerciseCount(exercises: WorkoutExercise[]): number {
  const seen = new Set<number>()
  let count = 0
  for (const ex of exercises) {
    if (ex.superset_group != null) {
      if (!seen.has(ex.superset_group)) {
        seen.add(ex.superset_group)
        count++
      }
    } else {
      count++
    }
  }
  return count
}

interface Props {
  dayIndex: number
  workout: Workout | undefined
  isToday: boolean
  colSpan?: boolean
}

export default function WorkoutDayCard({ dayIndex, workout, isToday, colSpan }: Props) {
  const [open, setOpen] = useState(isToday)
  const isSunday = dayIndex === 6
  const exerciseCount = workout?.exercises ? getLogicalExerciseCount(workout.exercises) : 0

  return (
    <div
      className={`rounded-xl border transition-all ${
        isToday
          ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20'
          : workout
            ? 'border-border bg-surface'
            : 'border-border/50 bg-surface/50'
      } ${colSpan ? 'sm:col-span-2' : ''}`}
    >
      {/* Header — her zaman görünür, tıklanabilir */}
      <button
        onClick={() => workout && setOpen(!open)}
        className={`w-full flex items-center gap-3 p-5 text-left ${workout ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          isToday
            ? 'bg-primary text-white'
            : isSunday
              ? 'bg-green-500/10 text-green-500'
              : 'bg-surface-hover text-text-secondary'
        }`}>
          {getDayName(dayIndex).slice(0, 3).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={`font-semibold ${isToday ? 'text-primary' : 'text-text-primary'}`}>
              {getDayName(dayIndex)}
            </h2>
            {isToday && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium">BUGÜN</span>}
          </div>
          {workout ? (
            <p className="text-sm text-text-secondary truncate">
              {workout.title}
              {exerciseCount > 0 && <span className="text-text-secondary/50"> · {exerciseCount} egzersiz</span>}
            </p>
          ) : (
            <p className="text-sm text-text-secondary/50">
              {isSunday ? 'Aktif Dinlenme' : 'Antrenman yok'}
            </p>
          )}
        </div>
        {workout && (
          <svg
            className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* İçerik — açılır-kapanır */}
      {open && workout && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-border/50 pt-4">
            {workout.exercises && workout.exercises.length > 0 && (
              <div className="mb-3">
                {(() => {
                  const sorted = [...workout.exercises].sort((a, b) => a.order_num - b.order_num)

                  // Egzersizleri gruplara ayır (süper set = tek grup, normal = tek grup)
                  const groups: { type: 'single' | 'superset'; exercises: typeof sorted }[] = []
                  let i = 0
                  while (i < sorted.length) {
                    const ex = sorted[i]
                    if (ex.superset_group != null) {
                      const group = [ex]
                      let k = i + 1
                      while (k < sorted.length && sorted[k].superset_group === ex.superset_group) {
                        group.push(sorted[k])
                        k++
                      }
                      groups.push({ type: 'superset', exercises: group })
                      i = k
                    } else {
                      groups.push({ type: 'single', exercises: [ex] })
                      i++
                    }
                  }

                  return groups.map((group, groupIdx) => {
                    const num = groupIdx + 1

                    return (
                      <div key={group.exercises[0].id}>
                        {/* Ayırıcı — ilk grup hariç */}
                        {groupIdx > 0 && (
                          <div className="border-t border-border/30 my-3" />
                        )}

                        {group.type === 'single' ? (
                          /* Tek egzersiz */
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-mono text-text-secondary/60 w-5 pt-0.5 text-right flex-shrink-0">
                              {num}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-text-primary">{group.exercises[0].name}</div>
                              <ExerciseBadges exercise={group.exercises[0]} />
                              {group.exercises[0].notes && (
                                <p className="text-xs text-text-secondary mt-1.5 italic">{group.exercises[0].notes}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Süper set grubu */
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-mono text-primary w-5 pt-0.5 text-right flex-shrink-0">
                              {num}
                            </span>
                            <div className="flex-1 min-w-0 border-l-2 border-primary pl-3 space-y-0">
                              <div className="flex items-center gap-1.5 mb-2">
                                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Süper Set</span>
                              </div>
                              {group.exercises.map((ex, exIdx) => (
                                <div key={ex.id}>
                                  {exIdx > 0 && (
                                    <div className="flex items-center gap-2 py-1.5">
                                      <span className="text-[10px] font-bold text-primary/50">+</span>
                                      <div className="flex-1 border-t border-dashed border-primary/15" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-sm text-text-primary">{ex.name}</div>
                                    <ExerciseBadges exercise={ex} />
                                    {ex.notes && (
                                      <p className="text-xs text-text-secondary mt-1.5 italic">{ex.notes}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                })()}
              </div>
            )}

            {workout.content && (
              <div className="bg-background rounded-lg p-3 text-sm text-text-secondary whitespace-pre-line">
                {workout.content}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Boş Pazar kartı */}
      {!workout && isSunday && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-border/50 pt-3 text-center text-sm text-text-secondary">
            Yürüyüş, yoga veya hafif esneme ile aktif toparlanma
          </div>
        </div>
      )}
    </div>
  )
}
