import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock3, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { pathService } from "../features/paths/services/path.service";
import { useTitle } from "../hooks/useTitle";

export default function LearningPathDetails() {
  const { pathId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [path, setPath] = useState(null);
  const [progress, setProgress] = useState({
    completedSteps: [],
    currentStep: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useTitle(path?.title || "Learning Path");

  useEffect(() => {
    const load = async () => {
      try {
        const pathResponse = await pathService.getPath(pathId);
        setPath(pathResponse.data);
        if (user) {
          const progressResponse = await pathService.getProgress(pathId);
          setProgress(progressResponse.data);
        }
      } catch {
        showToast("Could not load this learning path", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pathId, showToast, user]);

  const completedIds = useMemo(
    () => new Set((progress.completedSteps || []).map(String)),
    [progress.completedSteps],
  );
  const completedCount = completedIds.size;

  const handleProgress = async (stepId) => {
    if (!user) return showToast("Sign in to track your progress", "error");
    const completed = !completedIds.has(stepId);
    try {
      setUpdating(stepId);
      const response = await pathService.updateProgress(
        pathId,
        stepId,
        completed,
      );
      setProgress(response.data.progress);
    } catch {
      showToast("Could not update your progress", "error");
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-7 w-7 animate-spin text-zinc-400' />
      </div>
    );
  if (!path)
    return (
      <div className='py-20 text-center text-zinc-500'>
        Learning path not found.
      </div>
    );

  return (
    <div className='min-h-screen bg-[#F5F5EE] px-4 py-10 text-zinc-950 md:py-16'>
      <div className='mx-auto max-w-6xl'>
        <Link
          to='/paths'
          className='mb-10 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950'
        >
          <ArrowLeft className='h-4 w-4' /> All paths
        </Link>
        <div className='grid gap-12 lg:grid-cols-[280px_1fr]'>
          <aside className='h-fit lg:sticky lg:top-24'>
            <p className='text-xs font-bold uppercase tracking-[0.16em] text-green-700'>
              {path.techHub?.name}
            </p>
            <h1 className='mt-3 text-3xl font-black tracking-tight'>
              {path.title}
            </h1>
            <p className='mt-4 leading-relaxed text-zinc-600'>
              {path.description}
            </p>
            <div className='mt-6 flex items-center gap-4 text-xs font-semibold text-zinc-500'>
              <span className='flex items-center gap-1'>
                <Clock3 className='h-3.5 w-3.5' /> {path.estimatedMinutes} min
              </span>
              <span>
                {completedCount}/{path.steps.length} complete
              </span>
            </div>
            <div className='mt-5 h-1 bg-zinc-200'>
              <div
                className='h-1 bg-green-700 transition-all'
                style={{
                  width: `${path.steps.length ? (completedCount / path.steps.length) * 100 : 0}%`,
                }}
              />
            </div>
          </aside>
          <main>
            <div className='mb-8 border-b border-zinc-300 pb-5'>
              <p className='text-sm leading-relaxed text-zinc-600'>
                Read each story in order. The goal is not to rush the list; it
                is to leave each step with one idea you can use.
              </p>
            </div>
            <div className='space-y-4'>
              {path.steps.map((step, index) => {
                const stepId = step.post?._id;
                const completed = completedIds.has(String(stepId));
                return (
                  <article
                    key={stepId}
                    className={`border p-5 transition-colors md:p-7 ${completed ? "border-green-700 bg-green-50/50" : "border-zinc-300 bg-white"}`}
                  >
                    <div className='flex gap-5'>
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${completed ? "bg-green-700 text-white" : "bg-zinc-100 text-zinc-500"}`}
                      >
                        {completed ? <Check className='h-4 w-4' /> : index + 1}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-xs font-bold uppercase tracking-[0.14em] text-zinc-400'>
                          Step {index + 1}
                        </p>
                        <h2 className='mt-2 text-xl font-bold tracking-tight'>
                          {step.post?.title}
                        </h2>
                        <p className='mt-2 leading-relaxed text-zinc-600'>
                          {step.rationale}
                        </p>
                        <div className='mt-5 flex flex-wrap items-center gap-3'>
                          <Link
                            to={`/posts/${step.post?.slug}`}
                            className='inline-flex items-center bg-zinc-950 px-4 py-2 text-sm font-bold text-white hover:bg-green-800'
                          >
                            Read story
                          </Link>
                          <button
                            onClick={() => handleProgress(stepId)}
                            disabled={updating === stepId}
                            className='inline-flex items-center gap-2 border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-700 hover:border-zinc-950 disabled:opacity-50'
                          >
                            {updating === stepId && (
                              <Loader2 className='h-3.5 w-3.5 animate-spin' />
                            )}
                            {completed ? "Mark incomplete" : "Mark complete"}
                          </button>
                        </div>
                        {completed && (
                          <p className='mt-5 border-t border-green-200 pt-4 text-sm italic text-green-900'>
                            {step.reflectionPrompt}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {completedCount === path.steps.length && (
              <div className='mt-8 border border-green-700 bg-green-50 p-6'>
                <h2 className='text-xl font-black'>Path complete.</h2>
                <p className='mt-2 text-sm text-green-900'>
                  You made it through every step. Keep the momentum going in{" "}
                  {path.techHub?.name}.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
