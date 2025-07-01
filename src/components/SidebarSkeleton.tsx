export default function SidebarSkeleton() {
    return (
        <div className="ml-4 space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="animate-pulse space-y-1">
                    <div className="w-28 h-4 bg-gray-300 rounded" />
                    <div className="w-48 h-3 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );
}
