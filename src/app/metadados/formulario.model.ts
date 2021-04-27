export class Formulario {
  constructor(id: string, description: string, apiRoute: string){
    this.id = id;
    this.description = description;
    this.apiRoute = apiRoute;
  }

  id: string;
  description: string;
  apiRoute: string;
}