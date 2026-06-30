import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";

const ENGAGEMENT_BENCHMARK = 0.06;

export function ShortlistPage() {
  const selectedProfiles = useListStore((state) => state.selectedProfiles);
  const removeProfile = useListStore((state) => state.removeProfile);

  return (
    <Layout>
      <Link to="/" className="text-sm text-teal mb-6 inline-block">
        ← Back to search
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">
          My Shortlist
        </h1>
        <p className="text-slate text-sm mb-6">
          {selectedProfiles.length === 0
            ? "Nothing here yet."
            : `${selectedProfiles.length} profile${
                selectedProfiles.length === 1 ? "" : "s"
              } shortlisted`}
        </p>

        {selectedProfiles.length === 0 ? (
          <div className="text-center py-16 bg-white border border-line rounded-xl">
            <p className="font-display text-lg text-ink mb-1">
              Your shortlist is empty
            </p>
            <p className="text-sm text-slate mb-4">
              Add profiles from the search page to see them here
            </p>
            <Link
              to="/"
              className="inline-block bg-ink text-paper text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
            >
              Browse profiles
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {selectedProfiles.map((profile) => {
              const engagementRate = profile.engagement_rate ?? 0;
              const barWidth = Math.min(
                (engagementRate / ENGAGEMENT_BENCHMARK) * 100,
                100
              );

              return (
                <div
                  key={profile.user_id}
                  className="bg-white border border-line rounded-xl p-4 flex items-center gap-4"
                >
                  <img
                    src={profile.picture}
                    alt={`${profile.fullname} profile picture`}
                    className="w-14 h-14 rounded-full border border-line object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-display font-semibold text-ink truncate">
                      @{profile.username}
                      <VerifiedBadge verified={profile.is_verified} />
                    </div>
                    <div className="text-sm text-slate truncate">
                      {profile.fullname}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-mono text-xs text-ink">
                        {formatFollowers(profile.followers)} followers
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-ink">
                          {formatEngagementRate(profile.engagement_rate)}
                        </span>
                        <div className="w-12 h-1.5 bg-line rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal rounded-full"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProfile(profile.user_id)}
                    className="flex-shrink-0 bg-amber-light text-amber text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-amber/20 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}