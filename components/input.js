import { BiNavigation } from "react-icons/bi";

export default () => {
    return (
        <div className="fixed bottom-0 left-0 w-full z-0 h-40 text-gray-50 bg-gradient-to-t from-gray-900">
            <div className="grid grid-cols-6 absolute bottom-10 w-full">
                <div className="col-stary-2 col-span-6 flex justify-center items-center w-full">
                    <div className="w-3/5 px-5 bg-gray-800 border-gray-700 rounded-lg flex items-center">
                        <form className="flex w-full shadow-2xl">

                            <input type="text" className="w-full py-3 bg-transparent focus:outline-none text-lg" 
                                          placeholder="type in here" />
                        </form>
                        <button type = "submit">
<BiNavigation className="text-2xl ">

</BiNavigation>
                        </button>
                    </div>
                </div>
            </div>
        

        </div>
    )
}