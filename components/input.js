import { BiNavigation, BiXCircle, BiSun, BiSolidMoon, BiBulb } from "react-icons/bi";
import { useState } from 'react';
import { useMutation, useQueryClient } from "react-query";
import { sendMessage } from "@/lib/request";

export default function Input({ roomid, inputText, setInputText, toggleTheme, darkTheme, isSidebarMinimized }) {
    const queryClient = useQueryClient();
    const [rows, setRows] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const mutation = useMutation(sendMessage, {
        onSuccess: () => {
            queryClient.invalidateQueries('messages');
        }
    });

    const calculateRows = (text) => {
        const lines = text.split('\n');
        let rowCount = lines.length;
        const maxLineLength = 150;
        lines.forEach(line => {
            (rowCount += Math.floor(line.length / maxLineLength)) - 1;
        });

        return Math.min(rowCount, 5);
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        setRows(calculateRows(text));
    };

    const clearInput = () => {
        setInputText('');
        setRows(1);
    };

    function onSubmit(e) {
        e.preventDefault();
        if (inputText.trim()) {
            mutation.mutate({ roomid, message: inputText.trim() });
            setInputText('');
            setRows(1);
        }
    }

    if (mutation.isLoading) {
        return (
            <div className="flex justify-center items-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (mutation.isError) return <div className="text-center text-gray-50">Error: {mutation.error.message}</div>;

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const Popup = () => (
        <div className="absolute right-20 bottom-20 w-96 p-4 bg-sky-300 dark:bg-gray-800 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold">Chatbot Usage Guide</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>Exclusively for Computer Science course inquiries</li>
                <li>Retrieve course-related information or answers to general queries swiftly</li>
                <li>Examples of questions you can ask:</li>
                <ul className="list-disc pl-8 space-y-1">
                    <li>Teacher contact information</li>
                    <li>Group project student requirements</li>
                    <li>Requirement of assignment/project</li>
                    <li>Exam format and preparation tips</li>
                    <li>Important deadlines for assignments/projects</li>
                    <li>Marking scheme of assignment/project </li>
                </ul>
            </ul>

            <button onClick={togglePopup} className="mt-4 bg-red-500 text-white p-2 rounded">Close</button>
        </div>
    );

    return (
        <div className={`fixed bottom-0 left-0 w-full z-0 h-40 ${darkTheme ? 'text-gray-50 bg-gradient-to-t from-gray-900' : 'text-black bg-gradient-to-t'}`}>
            <div className="grid grid-cols-6 absolute bottom-10 w-full">
                <div className={`col-start-1 col-span-6 flex justify-center items-center w-full ${isSidebarMinimized ? 'md:col-start-1 md:col-span-6' : 'md:col-start-2 md:col-span-5'}`}>
                    <div className={`w-4/5 px-5 ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-200'} rounded-lg flex items-center`}>
                        <form className={`flex w-full ${darkTheme ? 'shadow-2xl' : 'shadow-md'}`} onSubmit={onSubmit}>
                            <textarea
                                type="text"
                                className={`w-full py-3 focus:outline-none text-lg ${darkTheme ? 'bg-gray-800 text-gray-50' : 'bg-gray-200 text-gray-900'}`}
                                autoFocus
                                placeholder="Type in here"
                                value={inputText}
                                onChange={handleInputChange}
                                rows={rows}
                            />
                            {inputText && (
                                <button type="button" onClick={clearInput} className="text-xl">
                                    <BiXCircle size="1.5em" />
                                </button>
                            )}
                            <button type="submit">
                                <BiNavigation className="text-2xl" />
                            </button>
                        </form>

                    </div>
                    <button onClick={toggleTheme} className="text-xl">
                        {darkTheme ? <BiSolidMoon size="1.5em" /> : <BiSun size="1.5em" />}
                    </button>
                    <button onClick={togglePopup} className="text-xl ml-2">
                        <BiBulb size="1.5em" />
                    </button>
                    {showPopup && <Popup />}
                </div>
            </div>
        </div>
    );
}
