'use client'

import { useState } from 'react'
import { getDayName } from '@/lib/utils'
import type { Workout } from '@/lib/types'

interface Props {
  dayIndex: number
  workout: Workout | undefined
  isToday: boolean
  colSpan?: boolean
}

export default function WorkoutDayCard({ dayIndex, workout, isToday, colSpan }: Props) {
  const [open, setOpen] = useState(isToday)
  const isSunday = dayIndex === 6
  const exerciseCount = workout?.exercises?.length || 0

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
              <div className="space-y-2 mb-3">
                {(() => {
                  const sorted = [...workout.exercises].sort((a, b) => a.order_num - b.order_num)
                  return sorted.map((ex, j) => {
                    const prevEx = j > 0 ? sorted[j - 1] : null
                    const nextEx = j < sorted.length - 1 ? sorted[j + 1] : null
                    const inSuperset = ex.superset_group != null
                    const isFirstInGroup = inSuperset && (!prevEx || prevEx.superset_group !== ex.superset_group)
                    const isLastInGroup = inSuperset && (!nextEx || nextEx.superset_group !== ex.superset_group)
                    const isMidGroup = inSuperset && !isFirstInGroup && !isLastInGroup

                    return (
                      <div key={ex.id} className="relative">
                        {/* Superset sol çizgi */}
                        {inSuperset && (
                          <div className={`absolute left-0 w-1 bg-primary rounded-full ${
                            isFirstInGroup && isLastInGroup ? 'top-2 bottom-2'
                            : isFirstInGroup ? 'top-2 bottom-0'
                            : isLastInGroup ? 'top-0 bottom-2'
                            : 'top-0 bottom-0'
                          }`} />
                        )}
                        {/* Superset etiketi */}
                        {isFirstInGroup && (
                          <div className="ml-4 mb-1">
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Süper Set</span>
                          </div>
                        )}
                        <div className={`flex items-start gap-3 py-2 ${!isLastInGroup && !isMidGroup ? 'border-b border-border/50' : ''} ${inSuperset ? 'ml-4' : ''}`}>
                          {!inSuperset && <span className="text-xs font-mono text-text-secondary w-5 pt-0.5">{j + 1}</span>}
                          {inSuperset && !isFirstInGroup && (
                            <span className="text-xs font-mono text-primary w-5 pt-0.5">+</span>
                          )}
                          {inSuperset && isFirstInGroup && (
                            <span className="text-xs font-mono text-primary w-5 pt-0.5">{j + 1}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-text-primary">{ex.name}</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {ex.sets && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  {ex.sets} set
                                </span>
                              )}
                              {ex.reps && (
                                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">
                                  {ex.reps} tekrar
                                </span>
                              )}
                              {ex.weight && (
                                <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded">
                                  {ex.weight}
                                </span>
                              )}
                              {ex.rest && (
                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded">
                                  {ex.rest} din.
                                </span>
                              )}
                            </div>
                            {ex.notes && (
                              <p className="text-xs text-text-secondary mt-1 italic">{ex.notes}</p>
                            )}
                          </div>
                        </div>
                        {/* Superset son egzersiz sonrası ayırıcı */}
                        {isLastInGroup && j < sorted.length - 1 && (
                          <div className="border-b border-border/50 mt-2" />
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
