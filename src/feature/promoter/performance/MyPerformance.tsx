import { Hammer, Clock3 } from "lucide-react";

export default function WorkingInProgress() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <section className="w-full max-w-2xl text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-icon-bg p-6 rounded-2xl shadow-sm border border-border-stroke">
            <Hammer className="w-10 h-10 text-icon-text animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-heading-color">
            This Page is Under Construction
          </h1>
          <p className="text-inactive-text text-sm max-w-md mx-auto">
            We’re working hard to bring you performance insights and metrics.
            Please check back shortly.
          </p>
        </div>
        <div className="bg-white border border-border-stroke rounded-xl p-6 shadow-sm flex items-center gap-4 justify-center">
          <Clock3 className="w-5 h-5 text-icon-text" />
          <p className="text-sm text-icon-text font-medium">
            Feature currently in progress
          </p>
        </div>
      </section>
    </main>
  );
}
