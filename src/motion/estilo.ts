import React from "react";

/**
 * Estilo de motion. "padrao" = vinheta aprovada. "refinado" = Versão 3 da Etapa 3:
 * formas morfando entre formas oficiais, texto revelado por máscara, relógio
 * odômetro e transições por forma. Os componentes leem este contexto.
 */
export type Estilo = "padrao" | "refinado";
export const EstiloMotion = React.createContext<Estilo>("padrao");
export const useRefinado = () => React.useContext(EstiloMotion) === "refinado";

export { parceiras } from "../brand/grafismos";
