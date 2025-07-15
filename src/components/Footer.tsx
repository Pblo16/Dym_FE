import { fetchData } from "@/hooks/fetchData";
import type Global from "@/interfaces/global";
import { NavLink } from "react-router";

const apiData = fetchData("/api/global");

const Footer = () => {
    const apiResponse = apiData.read();
    const data: Global = apiResponse.data;
    return (
        <footer className="bg-gray-800 mt-4 py-4 text-white">
            <div className="mx-auto text-center container">
                <NavLink to="/" className="text-white hover:underline">
                    <p>
                        <span className="">{data?.siteName || "Site Name"}</span>
                        . Todos los derechos reservados.
                    </p>
                </NavLink>
            </div>
        </footer>
    );
}

export default Footer;