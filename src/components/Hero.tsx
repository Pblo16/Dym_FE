import { fetchData } from "@/hooks/fetchData";
import type Global from "@/interfaces/global";

const apiData = fetchData("/api/global");

export function Hero() {
    const apiResponse = apiData.read();
    const data: Global = apiResponse.data;

    return (
        <section className="py-12 sm:pb-16 lg:pb-20 xl:pb-24">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="relative">
                    <div className="lg:w-2/3">
                        <p className="font-normal text-gray-300 text-sm uppercase tracking-widest">A Hub for Designers, Developers & Marketers</p>
                        <h1 className="mt-6 sm:mt-10 font-normal text-white text-4xl sm:text-5xl lg:text-6xl xl:text-8xl"><span className="bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent">{data?.siteDescription || 'Unlimited Design'}</span> Inspiration</h1>
                        <p className="mt-4 sm:mt-8 max-w-lg font-normal text-gray-400 text-xl">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat.</p>
                        <div className="group inline-flex relative justify-center items-center mt-8 sm:mt-12">
                            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-cyan-500/50 group-hover:shadow-lg rounded-full transition-all duration-200"></div>
                            <a href="#" title="" className="inline-flex relative justify-center items-center bg-black px-8 py-3 border border-transparent rounded-full font-normal text-white text-base" role="button"> Start Exploring Inspiration </a>
                        </div>

                    </div>

                    <div className="md:top-32 lg:top-0 md:right-0 md:absolute mt-8 md:mt-0">
                        <img className="mx-auto w-full max-w-xs lg:max-w-lg xl:max-w-xl" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/1/3d-illustration.png" alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
}

