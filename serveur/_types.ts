/**
 * La plupart des champs ne sont utilisés que pendant la documentation et
 * n'ont pas de vrai but dans le code. Ils seront préfixé d'un DOC
 * Les champs avec CODE sont utile dans le code, et leur contenu est important
 */

interface QueryParam {
  param: string; // DOC: Le contenur du paramètre 
  desc: string; // DOC: Qu'est ce qu'il fait
}

interface Result {
  code: number; // DOC: Le code HTTP renvoyé
  content: any; // DOC: Le contenu (peut être du texte, un tableau, un objet JS pour du JSON...)
}

interface BodyArgument {
  type: 'string' | 'number' | 'data_url' | 'date' | any; // CODE: Le type du BodyArgument
  required?: boolean; // CODE: Est-ce qu'il est requis
  value?: string[]; // CODE: Non obligatoire, les différentes valeurs de chaînes que l'argument peut prendre
}

export interface Route {
  method: 'GET' | 'POST' | 'DELETE'; // DOC
  url: string; // CODE: L'adresse de la route. Possibilité d'utiliser des : pour faire des routes paramétrées (voir doc Express)
  func: Array<(req: any, res: any, next?: any) => void>; // CODE: Un tableau de fonction, qui devront être exécutées dans l'ordre
  name: string; // DOC: Le nom de la route
  permission: -1 | 0 | 100 | 1000; // CODE: La permission nécéssaire pour y accèder. -1 non connecté, 0 utilisateur normal, 100 créateur et 1000 Administrateur
  description?: string; // DOC: La description
  query?: Array<QueryParam>; // DOC: Les query element
  result: Array<Result>; // DOC: Les différents resultats possibles
  test?: true | false; // DOC: Est-ce que la route a été testée
  body?: { // CODE: Les différents champs à renseigner dans le body. Si un type est renseigné par une chaine, le champs est forcément obligatoire
    [key: string]: string | BodyArgument;
  };
}
