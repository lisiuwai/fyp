
export default function () {
    
    return (
        <div className={`flex flex-col justify-center items-center h-screen bg-gray-800`}>
            <div className="text-center mb-5">  
                <img src="/image/bg.png" alt="Chatbot" className="w-20 h-20 mx-auto" />
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-200 mb-3">
                    Ready to Chat?
                </h1>
                <p className="w-3/4 mx-auto text-lg text-gray-400">
                    Start a conversation with our AI chatbot. Type your message below and get an instant response!
                </p>
            </div>
        </div>
    );
}
