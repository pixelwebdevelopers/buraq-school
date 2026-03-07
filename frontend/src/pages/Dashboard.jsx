export default function Dashboard() {
    return (
        <div className="animate-fade-in pb-10">
            {/* Header line */}
            <div className="mb-6 border-b-2 border-primary/10 pb-2 inline-block">
                <h1 className="text-3xl font-bold tracking-tight text-[#1E293B] uppercase">DASHBOARD</h1>
            </div>

            {/* Blank State Welcome */}
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm min-h-[400px]">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome to Buraq School Portal</h2>
                <p className="text-text-secondary max-w-lg">
                    Select an option from the sidebar menu to get started. More modules will be added here soon.
                </p>
            </div>
        </div>
    );
}
