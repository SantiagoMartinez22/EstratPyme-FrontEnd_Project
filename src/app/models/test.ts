export interface Test {
    id_empresa?: string | null;
    id?: number |null;
    pregunta1: string;
    pregunta2: string;
    pregunta3: string;
    pregunta4: string;
    pregunta5: string;
    pregunta6: string;
    pregunta7: string;
    pregunta8: string;
    pregunta9: string;
    user: { id: number }; // Asegúrate de tener este campo para la relación con el usuario
  }
  
