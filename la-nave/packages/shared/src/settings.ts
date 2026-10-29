import { bool, objectWith, oneOf } from './parse';
import { THEMES } from './domain';

/**
 * Los ajustes se cambian SOLO con un parche validado: claves conocidas, valores del tipo correcto.
 * (El estado de la ventana lo guarda main por su cuenta y no pasa por aquí.)
 */
export const parseSettingsPatch = objectWith({}, { theme: oneOf(THEMES), notifications: bool, sideOpen: bool });
