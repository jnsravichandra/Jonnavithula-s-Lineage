function Loading () {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-primary border-t-transparent"></div>
                <h2 className="text-xl font-semibold text-white">Loading...</h2>
            </div>
        </div>
    )
}

export default Loading;