import React from 'react';
import Values from "./components/Values";

import InfoCard from './components/InfoCard';
import HeroImage from './components/HeroImage';

/**
 * Página principal de "Acerca de nosotros"
 * Contiene información sobre la misión, visión y valores de la empresa
 * @returns JSX.Element - Página completa de About
 */
const About: React.FC = () => {
    const visionContent = "Ser una organización que en el 2028 se reconocida a nivel nacional e internacional. Por el dominio, versatilidad y eficiencia de los productos y servicios ofertados mediante la formación de talento humano, desarrollo de productos innovadores, para la satisfacción de las necesidades normativas de nuestros clientes.";

    const missionContent = "Somos una organización que ofrece soluciones integrales a laboratorios de análisis, calibración, y a toda la cadena de valor del sector energético. Con dominio técnico y normativo aplicable, distinguiéndose por la calidad humana, liderazgo y confianza, aportando así, al desarrollo del sector y de nuestros clientes.";

    return (
        <>
            <h1 className="my-8 font-bold text-3xl text-center">Acerca de Nosotros</h1>

            <div className="justify-between items-stretch gap-4 grid grid-cols-2 md:grid-cols-3 py-8">
                <InfoCard title="Visión" content={visionContent} />
                <InfoCard title="Misión" content={missionContent} />
                <HeroImage />
            </div>
            <Values />

        </>
    );
};

export default About;
