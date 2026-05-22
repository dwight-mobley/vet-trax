export const UserProfile = () => {
  return (
    <div className="p-4 border-t border-text-disabled/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary text-secondary-contrast flex items-center justify-center font-bold">DM</div>
        <div>
          <p className="text-sm font-medium text-text-primary">Dwight Mobley</p>
          <p className="text-xs text-text-secondary">Horse Lover</p>
        </div>
      </div>
    </div>
  );
};
