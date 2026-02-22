'use client'

import { useState } from 'react'
import { getDayName } from '@/lib/utils'
import type { Workout, WorkoutExercise } from '@/lib/types'
import { WORKOUT_SECTIONS } from '@/lib/types'

function ExerciseBadges({ exercise }: { exercise: WorkoutExercise }) {
  const { sets, reps, weight, rest } = exercise
  if (!sets && !reps && !weight && !rest) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {sets && (
        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md font-semibold">
          {sets} set
        </span>
      )}
      {reps && (
        <span className="text-xs bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-md font-semibold">
          {reps} tekrar
        </span>
      )}
      {weight && (
        <span className="text-xs bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-md font-semibold">
          {weight}
        </span>
      )}
      {rest && (
        <span className="text-xs bg-green-500/10 text-green-600 px-2.5 py-1 rounded-md font-semibold">
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

function groupExercisesBySupersets(exercises: WorkoutExercise[]) {
  const sorted = [...exercises].sort((a, b) => a.order_num - b.order_num)
  const groups: { type: 'single' | 'superset'; exercises: WorkoutExercise[] }[] = []
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
  return groups
}

function ExerciseGroup({ group, num }: { group: { type: 'single' | 'superset'; exercises: WorkoutExercise[] }; num: number }) {
  if (group.type === 'single') {
    return (
      <div className="flex items-start gap-3">
        <span className="text-sm font-mono text-text-secondary/60 w-6 pt-0.5 text-right flex-shrink-0">
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-text-primary">{group.exercises[0].name}</div>
          <ExerciseBadges exercise={group.exercises[0]} />
          {group.exercises[0].notes && (
            <p className="text-sm text-text-secondary mt-2 italic">{group.exercises[0].notes}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      <span className="text-sm font-mono text-primary w-6 pt-0.5 text-right flex-shrink-0">
        {num}
      </span>
      <div className="flex-1 min-w-0 border-l-2 border-primary pl-4 space-y-0">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Süper Set</span>
        </div>
        {group.exercises.map((ex, exIdx) => (
          <div key={ex.id}>
            {exIdx > 0 && (
              <div className="flex items-center gap-2 py-2">
                <span className="text-xs font-bold text-primary/50">+</span>
                <div className="flex-1 border-t border-dashed border-primary/15" />
              </div>
            )}
            <div>
              <div className="font-semibold text-base text-text-primary">{ex.name}</div>
              <ExerciseBadges exercise={ex} />
              {ex.notes && (
                <p className="text-sm text-text-secondary mt-2 italic">{ex.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface Props {
  dayIndex: number
  workout: Workout | undefined
  isToday: boolean
  colSpan?: boolean
}

export default function WorkoutDayCard({ dayIndex, workout, isToday, colSpan }: Props) {
  const [open, setOpen] = useState(isToday)
  const exerciseCount = workout?.exercises ? getLogicalExerciseCount(workout.exercises) : 0

  // Egzersiz bazlı bölümleri grupla (sadece strength ve accessory)
  const exerciseSections = workout?.exercises
    ? WORKOUT_SECTIONS
        .filter(sec => sec.type === 'exercises')
        .map(sec => ({
          ...sec,
          exercises: workout.exercises!.filter(e => (e.section || 'strength') === sec.key),
        }))
        .filter(sec => sec.exercises.length > 0)
    : []

  // Birden fazla egzersiz bölümü veya serbest metin varsa section başlıklarını göster
  const hasWarmup = !!workout?.warmup_text
  const hasCardio = !!workout?.cardio_text
  const showSectionHeaders = exerciseSections.length > 1 || hasWarmup || hasCardio

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all shadow-sm ${
        isToday
          ? 'ring-2 ring-primary/40 shadow-md'
          : ''
      } ${colSpan ? 'sm:col-span-2' : ''}`}
    >
      {/* Header */}
      <button
        onClick={() => workout && setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-5 sm:gap-4 sm:p-6 text-left transition-colors ${
          workout
            ? 'bg-primary hover:bg-primary-hover cursor-pointer'
            : 'bg-gray-300 cursor-default'
        }`}
      >
        <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold flex-shrink-0 ${
          workout
            ? 'bg-white/20 text-white'
            : 'bg-white/40 text-gray-500'
        }`}>
          {getDayName(dayIndex).slice(0, 3).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${workout ? 'text-white' : 'text-gray-500'}`}>
              {getDayName(dayIndex)}
            </h2>
            {isToday && <span className="text-xs bg-white/25 text-white px-2 py-0.5 rounded font-bold">BUGÜN</span>}
          </div>
          {workout ? (
            <p className="text-base text-white/80 truncate mt-0.5">
              {workout.title}
              {exerciseCount > 0 && <span className="text-white/50"> · {exerciseCount} egzersiz</span>}
            </p>
          ) : (
            <p className="text-base mt-0.5 text-gray-400">Antrenman yok</p>
          )}
        </div>
        {workout && (
          <svg
            className={`w-6 h-6 text-white/70 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* İçerik */}
      {open && workout && (
        <div className="bg-white px-6 pb-6 pt-5 space-y-5">
          {/* Gün Notu */}
          {workout.content && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Gün Notu</div>
              <div className="text-sm text-text-primary whitespace-pre-line">{workout.content}</div>
            </div>
          )}

          {/* Isınma (serbest metin) */}
          {workout.warmup_text && (
            <div>
              {showSectionHeaders && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
                  <span className="text-sm font-bold uppercase tracking-wider text-text-primary">Isınma</span>
                </div>
              )}
              <div className="text-sm text-text-primary whitespace-pre-line bg-gray-50 rounded-lg p-4">
                {workout.warmup_text}
              </div>
            </div>
          )}

          {/* Egzersiz bölümleri (Güç-Kuvvet, Aksesuar) */}
          {exerciseSections.map((sec) => {
            const groups = groupExercisesBySupersets(sec.exercises)

            return (
              <div key={sec.key}>
                {showSectionHeaders && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
                    <span className="text-sm font-bold uppercase tracking-wider text-text-primary">
                      {sec.label}
                    </span>
                    <span className="text-xs text-text-secondary">
                      ({sec.exercises.length})
                    </span>
                  </div>
                )}

                <div>
                  {groups.map((group, groupIdx) => (
                    <div key={group.exercises[0].id}>
                      {groupIdx > 0 && (
                        <div className="border-t border-border/40 my-4" />
                      )}
                      <ExerciseGroup group={group} num={groupIdx + 1} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Kardiyo-Metcon (serbest metin) */}
          {workout.cardio_text && (
            <div>
              {showSectionHeaders && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
                  <span className="text-sm font-bold uppercase tracking-wider text-text-primary">Kardiyo-Metcon</span>
                </div>
              )}
              <div className="text-sm text-text-primary whitespace-pre-line bg-gray-50 rounded-lg p-4">
                {workout.cardio_text}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
