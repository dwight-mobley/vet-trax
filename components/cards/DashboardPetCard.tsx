import { Pet } from "@/types/pets";
import Link from "next/link";

export function DashboardPetCard({ pet }: { pet: Pet }) {
  // Gradient palette based on pet name's first letter
  const gradients = [
    "from-emerald-500 to-teal-400",
    "from-sky-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-rose-500 to-pink-400",
    "from-amber-500 to-orange-400",
    "from-indigo-500 to-blue-400",
  ];
  const gradient = gradients[pet.name.charCodeAt(0) % gradients.length];

  return (
    <Link
      href={`/pets/${pet.id}`}
      className="group relative flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg active:scale-[0.98] sm:gap-4 sm:p-4 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      {/* Avatar */}
      <div
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-base font-bold text-white shadow-inner sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg`}
      >
        {pet.name.charAt(0).toUpperCase()}
        {/* Online indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 dark:border-gray-900" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-emerald-600 sm:text-base dark:text-gray-100 dark:group-hover:text-emerald-400">
          {pet.name}
        </h3>
        <p className="text-xs text-gray-500 capitalize sm:text-sm dark:text-gray-400">
          {pet.breed || pet.species || "Pet"}
        </p>
      </div>

      {/* Chevron */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-gray-300 transition-all group-hover:text-gray-500 group-hover:translate-x-0.5 dark:text-gray-600 dark:group-hover:text-gray-400"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
