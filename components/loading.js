export default function LoadingPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-300 to-purple-400">
            <div className="text-center">
                <div className="loader rounded-full border-8 border-t-8 border-white h-16 w-16 mb-4 mx-auto"></div>
                <h1 className="text-4xl text-white font-semibold mb-2">
                    Loading...
                </h1>
                <p className="text-white text-opacity-80">
                    Please wait, we're preparing everything for you.
                </p>
            </div>
        </div>
    )
}
