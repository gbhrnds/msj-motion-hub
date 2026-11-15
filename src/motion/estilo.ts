import React from "react";

/**
 * Estilo de motion. "padrao" = vinheta aprovada. "refinado" = Versão 3 da Etapa 3:
 * formas morfando entre formas oficiais, texto revelado por máscara, relógio
 * odômetro e transições por forma. Os componentes leem este contexto.
 */
export type Estilo = "padrao" | "refinado";
export const EstiloMotion = React.createContext<Estilo>("padrao");
export const useRefinado = () => React.useContext(EstiloMotion) === "refinado";

/**
 * Morph de formas só nas telas de respiro (formas em volta do texto) e nas
 * transições entre telas (decisão do usuário, Etapa 3). A tela de respiro
 * abre este contexto; fora dele as formas ficam estáticas.
 */
export const MorphPermitido = React.createContext(false);
export const useMorph = () => useRefinado() && React.useContext(MorphPermitido);

export { parceiras } from "../brand/grafismos";
