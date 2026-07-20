export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-1">
      <h1 className="text-7xl font-extrabold text-slate-800">HELLO, AKHONA</h1>

      <p className="text-2xl text-slate-500 mt-4 max-w-4xl">
        Transform documents into meaningful insights, intelligent visuals and
        interactive experiences.
      </p>

      <div className="mt-16 mb-12 relative">
        <div className="w-72 h-72 rounded-full bg-blue-500 blur-[120px] opacity-20 absolute" />

        <div className="relative flex justify-center items-center">
          <div className="w-80 h-40 border-[8px] border-blue-500 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.6)]" />

          <div className="absolute w-24 h-24 border-4 border-blue-400 rounded-full" />

          <div className="absolute w-5 h-5 bg-blue-600 rounded-full" />
        </div>
      </div>

      <h2 className="text-6xl tracking-[12px] font-bold text-blue-600 drop-shadow-lg">
        VISUALIZER
      </h2>
    </div>
  );
}
