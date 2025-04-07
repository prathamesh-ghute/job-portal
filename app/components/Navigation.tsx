{
    session?.user && (
        <>
            <Link
                href="/jobs/post"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
                Post a Job
            </Link>
            <Link
                href="/jobs/myjobs"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
                My Jobs
            </Link>
            <Link
                href="/applications"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
                My Applications
            </Link>
        </>
    )
} 