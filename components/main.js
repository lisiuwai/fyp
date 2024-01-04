import { useRef, useEffect, useState } from 'react';
import { BiChevronDownCircle } from "react-icons/bi";
import Question from "./question"
import Response from "./response"
import { useQuery } from "react-query";
import { getMessages } from "@/lib/request";
import Loading from "./loading";
import NoHistory from './nohistory'


export default function Main({ roomid, darkTheme, isSidebarVisible }) {
    const [showButton, setShowButton] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        let lastScrollTop = 0;

        const onScroll = () => {
            let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop < lastScrollTop) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const { isLoading, isError, data: messages, error } = useQuery(['messages', roomid], () => getMessages(roomid));
    if (isLoading) return <Loading></Loading>
    if (isError) return <div className="text-center">Error: {error.message}</div>
    if (messages.length === 0) return <NoHistory darkTheme={darkTheme} />;

    return (
        <main className={`${isSidebarVisible ? 'container mx-auto w-4/5 py-5' : 'container mx-auto w-4/5 py-5'}`} >
            {
                messages && messages.map((message, index) => {
                    return (
                        <div key={index}>
                            <Question q={message.question}>
                            </Question>

                            <Response ans={message.answer}>
                            </Response>
                        </div>

                    )

                })

            }
            {
                showButton && (
                    <button onClick={scrollToBottom} className="fixed bottom-10 right-10 z-50 p-2 bg-black-600 rounded-full hover:bg-green-700">
                        <BiChevronDownCircle size="2em" />
                    </button>
                )
            }
            <div ref={messagesEndRef}></div>
        </main>
    )
}