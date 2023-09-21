import {
    NewspaperIcon,
    FolderIcon,
} from '@heroicons/react/24/outline'

export const Sidebar = (props) => {

    const { children } = props

    const Menus = [
        { title: "Project", icon: FolderIcon, path: "/admin" },
        { title: "News", icon: NewspaperIcon, path: "/" },
    ];

    return (
        <>
            <div className="flex flex-wrap justify-between items-center p-4 w-full gap-4">
                <a className="flex title-font font-medium items-center text-primary-1">
                    <span className="text-xl">Final Year Project</span>
                </a>
            </div>
            <div className="flex bg-white">
                <div className="w-16 body-height px-3 relative duration-300" >
                    <ul className="">
                        {
                            Menus.map((e, i) => (
                                <li key={i} className={"mt-3 flex rounded-md p-2 cursor-pointer hover:bg-zinc-200/20 text-gray-300 text-sm items-center gap-x-4"} >
                                    <e.icon title={e.title} className="w-5 h-5 text-primary-1" />
                                </li>
                            ))
                        }
                    </ul >
                </div >
                <div className="w-full overflow-auto border-t border-l border-zinc-100 rounded-tl-md p-4 shadow">
                    {children}
                </div>
            </div >
        </>
    );
};

export default Sidebar