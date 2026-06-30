import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";

const ENGAGEMENT_BENCHMARK = 0.06;

interface StatBoxProps {
  label: string;
  value: string;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <div className="text-xs text-slate mb-1">{label}</div>
      <div className="font-mono font-semibold text-ink text-lg">{value}</div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);

  const addProfile = useListStore((state) => state.addProfile);
  const removeProfile = useListStore((state) => state.removeProfile);
  const isSelected = useListStore((state) =>
    state.isProfileSelected(profileData?.data.user_profile.user_id ?? "")
  );

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-slate">Loading...</p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-red-600 mb-4">
          Could not load profile details for {username}
        </p>
        <Link to="/" className="text-teal underline">
          Back to search
        </Link>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const engagementRate = user.engagement_rate ?? 0;
  const barWidth = Math.min((engagementRate / ENGAGEMENT_BENCHMARK) * 100, 100);

  const handleListButtonClick = () => {
    if (isSelected) {
      removeProfile(user.user_id);
    } else {
      addProfile(user);
    }
  };

  return (
    <Layout>
      <Link
        to="/"
        className="text-sm text-teal mb-6 inline-flex items-center gap-1"
      >
        ← Back to search
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-line rounded-xl p-6 mb-4">
          <div className="flex items-start gap-4">
            <img
              src={user.picture}
              alt={`${user.fullname} profile picture`}
              className="w-20 h-20 rounded-full border border-line object-cover"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-semibold text-ink flex items-center gap-1">
                @{user.username}
                <VerifiedBadge verified={user.is_verified} />
              </h2>
              <p className="text-slate">{user.fullname}</p>
              <p className="text-xs text-slate/70 mt-1 capitalize">
                {platform}
              </p>
            </div>
          </div>

          {user.description && (
            <p className="mt-4 text-sm text-ink/80 leading-relaxed">
              {user.description}
            </p>
          )}

          {user.url && (
            
              <a href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-teal font-medium"
            >
              View on platform →
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatBox label="Followers" value={formatFollowers(user.followers)} />

          <div className="bg-white border border-line rounded-xl p-4">
            <div className="text-xs text-slate mb-1">Engagement Rate</div>
            <div className="font-mono font-semibold text-ink text-lg">
              {formatEngagementRate(user.engagement_rate)}
            </div>
            <div className="w-full h-1.5 bg-line rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-teal rounded-full"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {user.posts_count !== undefined && (
            <StatBox label="Posts" value={String(user.posts_count)} />
          )}
          {user.avg_likes !== undefined && (
            <StatBox label="Avg Likes" value={formatFollowers(user.avg_likes)} />
          )}
          {user.avg_comments !== undefined && (
            <StatBox label="Avg Comments" value={String(user.avg_comments)} />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatBox label="Avg Views" value={formatFollowers(user.avg_views)} />
          )}
          {user.engagements !== undefined && (
            <StatBox
              label="Engagements"
              value={formatFollowers(user.engagements)}
            />
          )}
        </div>

        <button
          onClick={handleListButtonClick}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isSelected
              ? "bg-amber-light text-amber"
              : "bg-ink text-paper hover:bg-ink/90"
          }`}
        >
          {isSelected ? "✓ In Shortlist — tap to remove" : "Add to List"}
        </button>
      </div>
    </Layout>
  );
}