export default () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
            <div className="text-center mb-5">
                <svg className="w-16 h-16 text-blue-500 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 7v10c0 1.1.9 2 2 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5c-1.1 0-2 .9-2 2z"></path>
                    <path d="M16 3v4M8 3v4M3 7h18"></path>
                </svg>
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-200 mb-3">
                    No Chat History
                </h1>
                <p className="w-3/4 mx-auto text-lg text-gray-400">
                    Please wait for a response or start a new conversation.
                </p>
            </div>
        </div>
    );
}
