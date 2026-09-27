'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface StatusTimelineProps {
  languageName?: string;
  onComplete?: () => void;
}

export function StatusTimeline({ languageName = 'मराठी / Marathi', onComplete }: StatusTimelineProps) {
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStage(2), 900);
    const t2 = setTimeout(() => setCurrentStage(3), 1900);
    const t3 = setTimeout(() => setCurrentStage(4), 3000);
    const t4 = setTimeout(() => {
      setCurrentStage(5);
      onComplete?.();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const stages = [
    { id: 1, title: 'आपकी आवाज़ सुन ली', sub: 'Heard your voice' },
    { id: 2, title: `भाषा समझी (${languageName})`, sub: `Understood ${languageName}` },
    { id: 3, title: 'विवरण तैयार हो रहा है', sub: 'Writing your product description' },
    { id: 4, title: 'उचित मूल्य अनुमान तय हो रहा है', sub: 'Setting suggested price band' },
  ];

  return (
    <div
      className="bg-white/90 border border-[#E4DACE] rounded-2xl p-6 shadow-sm max-w-md mx-auto space-y-6"
      role="region"
      aria-live="polite"
      aria-label="AI Processing Status"
    >
      <div className="text-center pb-2 border-b border-[#E4DACE]">
        <h3 className="text-xl font-bold text-[#22201D]">बन रहा है / Creating your listing</h3>
        <p className="text-xs text-stone-500 mt-1">Bhashini ASR & Indic LLM Pipeline in progress</p>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-[#FAF5EF] border border-[#C05A34]/30'
                  : isDone
                  ? 'bg-emerald-50/50'
                  : 'opacity-50'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-6 h-6 text-[#C05A34] animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-stone-300" />
                )}
              </div>

              <div>
                <p className={`text-base font-bold ${isCurrent ? 'text-[#C05A34]' : isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                  {stage.title}
                </p>
                <p className="text-xs text-stone-500 font-medium">{stage.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
