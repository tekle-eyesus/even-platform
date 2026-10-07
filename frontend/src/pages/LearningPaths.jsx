import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock3, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { hubService } from "../features/blog/services/hub.service";
import { pathService } from "../features/paths/services/path.service";
import { useTitle } from "../hooks/useTitle";

const PathCard = ({ path, progress }) => {
  const completed = progress?.completedSteps?.length || 0;
  const total = path.steps?.length || 0;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Link
      to={`/paths/${path._id}`}
      className='group border-b border-zinc-200 py-7 transition-colors hover:border-zinc-900'
    >
      <div className='flex items-start justify-between gap-5'>
        <div>
          <p className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-700'>
            {path.techHub?.name || "Even Path"}
          </p>
          <h2 className='text-2xl font-bold tracking-tight text-zinc-950 group-hover:underline'>
            {path.title}
          </h2>
          <p className='mt-2 max-w-2xl leading-relaxed text-zinc-600'>
            {path.description}
          </p>
        </div>
        <ArrowRight className='mt-1 h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-950' />
      </div>
      <div className='mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500'>
        <span className='flex items-center gap-1.5'>
          <BookOpen className='h-3.5 w-3.5' />
          {total} steps
        </span>
        <span className='flex items-center gap-1.5'>
          <Clock3 className='h-3.5 w-3.5' />
          {path.estimatedMinutes} min
        </span>
        <span className='capitalize'>{path.difficulty}</span>
        {progress && (
          <span className='text-zinc-900'>{percentage}% complete</span>
        )}
      </div>
      {progress && (
        <div className='mt-4 h-1 bg-zinc-200'>
          <div
            className='h-1 bg-green-700'
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </Link>
  );
};

export default function LearningPaths() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [paths, setPaths] = useState([]);
  const [myPaths, setMyPaths] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [goal, setGoal] = useState("");
  const [techHubId, setTechHubId] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  useTitle("Even Paths");

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const [pathsResponse, hubsResponse] = await Promise.all([
          pathService.getPaths(),
          hubService.getAllHubs(),
        ]);
        setPaths(pathsResponse.data || []);
        setHubs(hubsResponse.data || []);
        if (hubsResponse.data?.[0]) setTechHubId(hubsResponse.data[0]._id);
        if (user) {
          const mine = await pathService.getMyPaths();
          setMyPaths(mine.data || []);
        }
      } catch {
        showToast("Could not load learning paths", "error");
      } finally {
        setLoading(false);
      }
    };

    loadPaths();
  }, [showToast, user]);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!user) return showToast("Sign in to build a learning path", "error");
    if (!goal.trim() || !techHubId)
      return showToast("Choose a hub and enter a goal", "error");
    try {
      setCreating(true);
      const response = await pathService.createPath({ techHubId, goal });
      setPaths((current) => [response.data, ...current]);
      setGoal("");
      showToast("Your learning path is ready", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Could not build this path",
        "error",
      );
    } finally {
      setCreating(false);
    }
  };

  const progressFor = (pathId) => {
    const record = myPaths.find((item) => item.path?._id === pathId);
    return record || null;
  };

  return (
    <div className='min-h-screen bg-[#F5F5EE] px-4 py-10 text-zinc-950 md:py-16'>
      <div className='mx-auto max-w-6xl'>
        <header className='max-w-3xl'>
          <p className='mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-green-700'>
            <Sparkles className='h-4 w-4' /> Learn with intention
          </p>
          <h1 className='text-4xl font-black tracking-tight md:text-6xl'>
            Make progress, not just bookmarks.
          </h1>
          <p className='mt-5 text-lg leading-relaxed text-zinc-600'>
            Short, focused reading paths built from the stories already inside
            Even. Pick a direction, read in sequence, and come back exactly
            where you left off.
          </p>
        </header>

        <section className='mt-12 border-y border-zinc-300 py-7'>
          <form
            onSubmit={handleCreate}
            className='grid gap-3 md:grid-cols-[1fr_1fr_auto]'
          >
            <select
              value={techHubId}
              onChange={(event) => setTechHubId(event.target.value)}
              className='h-12 border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-zinc-950'
            >
              <option value=''>Choose a Tech Hub</option>
              {hubs.map((hub) => (
                <option key={hub._id} value={hub._id}>
                  {hub.name}
                </option>
              ))}
            </select>
            <input
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder={
                user ? "What do you want to learn?" : "Sign in to build a path"
              }
              className='h-12 border border-zinc-300 bg-white px-4 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-950'
              disabled={!user}
            />
            <button
              type='submit'
              disabled={creating || !user}
              className='flex h-12 items-center justify-center gap-2 bg-zinc-950 px-6 text-sm font-bold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-zinc-300'
            >
              {creating ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Sparkles className='h-4 w-4' />
              )}{" "}
              Build path
            </button>
          </form>
        </section>

        {loading ? (
          <div className='flex justify-center py-20'>
            <Loader2 className='h-7 w-7 animate-spin text-zinc-400' />
          </div>
        ) : (
          <section className='mt-8 grid gap-x-16 lg:grid-cols-[1fr_320px]'>
            <div>
              <h2 className='text-sm font-bold uppercase tracking-[0.16em] text-zinc-500'>
                Explore paths
              </h2>
              {paths.length ? (
                paths.map((path) => (
                  <PathCard
                    key={path._id}
                    path={path}
                    progress={progressFor(path._id)}
                  />
                ))
              ) : (
                <p className='py-16 text-zinc-500'>
                  No paths are available yet. Add published stories to a Tech
                  Hub to begin.
                </p>
              )}
            </div>
            <aside className='mt-12 h-fit border-l border-zinc-300 pl-7 lg:mt-0'>
              <h2 className='text-sm font-bold uppercase tracking-[0.16em] text-zinc-500'>
                Your momentum
              </h2>
              <p className='mt-4 text-4xl font-black'>{myPaths.length}</p>
              <p className='mt-1 text-sm leading-relaxed text-zinc-500'>
                {user
                  ? "paths in progress or completed"
                  : "Sign in to save progress and resume your paths."}
              </p>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}
