import { fetchData } from "@/hooks/fetchData";
import type Global from "@/interfaces/global";

const apiData = fetchData("/api/global");

/**
 * Componente para mostrar el contenido textual del hero
 * @param siteDescription - Descripción del sitio desde la API
 */
function HeroContent({ siteDescription }: { siteDescription?: string }) {
    return (
        <div className="space-y-4 sm:space-y-6">
            <p className="font-normal text-gray-300 text-sm uppercase tracking-widest">
                A Hub for Designers, Developers & Marketers
            </p>
            <h1 className="font-normal text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                <span className="bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent">
                    {siteDescription || 'Unlimited Design'}
                </span>
            </h1>
            <p className="max-w-lg font-normal text-gray-400 text-lg sm:text-xl">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                Velit officia consequat duis enim velit mollit. Exercitation veniam consequat.
            </p>
        </div>
    );
}

/**
 * Componente para mostrar la imagen del hero con responsive design
 */
function HeroImage() {
    return (
        <div className="flex justify-center lg:justify-end">
            <img
                className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg h-auto object-contain"
                src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/1/3d-illustration.png"
                alt="3D illustration representing design and development"
                loading="lazy"
            />
        </div>
    );
}

/**
 * Componente Hero principal que muestra el contenido de bienvenida
 * Obtiene datos de la API global y renderiza el contenido y la imagen de forma responsive
 */
export function Hero() {
    const apiResponse = apiData.read();
    const data: Global = apiResponse.data;

    return (
        <section className="items-center gap-8 lg:gap-12 grid grid-cols-1 lg:grid-cols-2 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl">
            <HeroContent siteDescription={data?.siteDescription} />

            <HeroImage />
        </section>
    );
}

