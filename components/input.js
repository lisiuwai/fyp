import { BiNavigation, BiXCircle, BiSun, BiSolidMoon } from "react-icons/bi";
import { useState } from 'react';
import { useMutation, useQueryClient } from "react-query";
import { sendMessage } from "@/lib/request";

export default function Input({ roomid, inputText, setInputText, toggleTheme, darkTheme }) {
    const queryClient = useQueryClient();
    const [rows, setRows] = useState(1);
    const mutation = useMutation(sendMessage, {
        onSuccess: () => {
            queryClient.invalidateQueries('messages');
        }

    });

    const calculateRows = (text) => {
        const lines = text.split('\n');
        let rowCount = lines.length;


        const maxLineLength = 65;
        lines.forEach(line => {
            (rowCount += Math.floor(line.length / maxLineLength)) - 2;
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
            mutation.mutate({ roomid, message: inputText });
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

    return (
        <div className={`fixed bottom-0 left-0 w-full z-0 h-40 ${darkTheme ? 'text-gray-50 bg-gradient-to-t from-gray-900' : 'text-gray-900 bg-gray-200'}`}>
        <div className="grid grid-cols-6 absolute bottom-10 w-full">
            <div className="col-start-2 col-span-6 flex justify-center items-center w-full">
                <div className={`w-4/5 px-5 ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-200'} rounded-lg flex items-center`}>
                    <form className={`flex w-full ${darkTheme ? 'shadow-2xl' : 'shadow-md'}`} onSubmit={onSubmit}>
                        <textarea
                            type="text"
                            className={`w-full py-3 focus:outline-none text-lg ${darkTheme ? 'bg-gray-800 text-gray-50' : 'bg-gray-200 text-gray-900'}`}
                            autoFocus
                            placeholder="type in here"
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
                </div>

            </div>

        </div>
    );
}
