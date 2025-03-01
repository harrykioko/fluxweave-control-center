
export function WelcomeMessage() {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-white">Hello, Henry</h1>
      <p className="text-slate-300 mt-2">
        You have 3 resources and 5 tasks due this week.
      </p>
    </div>
  );
}
