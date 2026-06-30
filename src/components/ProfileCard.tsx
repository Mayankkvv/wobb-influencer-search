import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";
import { memo } from "react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
}

const ENGAGEMENT_BENCHMARK = 0.06;

function ProfileCardComponent({
  profile,
  platform,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const addProfile = useListStore((state) => state.addProfile);
  const removeProfile = useListStore((state) => state.removeProfile);
  const isSelected = useListStore((state) =>
    state.isProfileSelected(profile.user_id)
  );

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleListButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile);
    }
  };

  const engagementRate = profile.engagement_rate ?? 0;
  const barWidth = Math.min((engagementRate / ENGAGEMENT_BENCHMARK) * 100, 100);

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View profile of ${profile.fullname}`}
      className="bg-white border border-line rounded-xl p-4 cursor-pointer hover:border-teal hover:shadow-md transition-all flex flex-col focus:outline-none focus:ring-2 focus:ring-teal"
    >
      <div className="flex items-start gap-3 mb-4">
        <img
          src={profile.picture}
          alt={`${profile.fullname} profile picture`}
          className="w-14 h-14 rounded-full object-cover border border-line"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 font-display font-semibold text-ink truncate">
            @{profile.username}
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="text-sm text-slate truncate">{profile.fullname}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs text-slate mb-0.5">Followers</div>
          <div className="font-mono font-semibold text-ink text-sm">
            {formatFollowers(profile.followers)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate mb-0.5">Engagement</div>
          <div className="font-mono font-semibold text-ink text-sm">
            {formatEngagementRate(profile.engagement_rate)}
          </div>
          <div className="w-full h-1.5 bg-line rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-teal rounded-full"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleListButtonClick}
        className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          isSelected
            ? "bg-amber-light text-amber"
            : "bg-ink text-paper hover:bg-ink/90"
        }`}
      >
        {isSelected ? "✓ In Shortlist" : "Add to List"}
      </button>
    </div>
  );
}

export const ProfileCard = memo(ProfileCardComponent);