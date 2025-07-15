import { fetchData } from "@/hooks/fetchData";
import type Global from "@/interfaces/global";
import LazyImage from "./LazyImage";
import RotatingText from "./RotatingText";
import Magnet from './Magnet.tsx'

const apiData = fetchData("/api/global?populate=*");

/**
 * Componente para mostrar el contenido textual del hero
 * @param siteDescription - Descripción del sitio desde la API
 */
function HeroContent({ siteDescription }: { siteDescription?: string }) {
    return (
        <div className="space-y-4 sm:space-y-6">

            <h1 className="font-normal text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                <span className="bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-800 text-transparent">
                    {siteDescription || 'Unlimited Design'}
                </span>
            </h1>
            <p className="inline-flex items-center gap-2 font-bold text-2xl">
                Te ofrecemos
                <RotatingText
                    texts={['Valores', 'Eficiencia', 'Innovación', 'Calidad']}
                    className="justify-center bg-amber-200 px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-2 rounded-lg overflow-hidden text-white bg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                />
            </p>

        </div>
    );
}

/**
 * Componente para mostrar la imagen del hero con responsive design
 */
function HeroImage({ img }: { img?: string }) {
    return (
        <LazyImage
            className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg h-auto object-contain rotate-12"
            src={img || "https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/1/3d-illustration.png"}
            alt="3D illustration representing design and development"
        />
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
            <Magnet padding={1000} disabled={false} magnetStrength={5}>
                <HeroImage img={data?.favicon?.url} />
            </Magnet>
        </section>
    );
}

