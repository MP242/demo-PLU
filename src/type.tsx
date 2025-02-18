export interface ProspectsItem {
    _id: string;
    firstName: string;
    lastName: string;
    gender: string;
    age: string;
    address: string;
    departement: string;
    arrondissement: string;
    region: string;
    city: string;
    housing: string;
    zipCode: string;
    district: string;
    phone1: string;
    phone2: string;
    mobile1: string;
    mobile2: string;
    calling: number;
    proprietaire: string;
    profession: string;
    houseAge: string;
    consumption: string;
    roof: string;
    erpReference: string;
    domaine: string;
    facture: { price: number, frequency: string };
    thread: string;
    calls: Array<{ date: string, texte: { value: string, updateAt: string }, idUsers: string, answer: { value: string, updateAt: string }, status: string }>;
    iris: string;
    rdv: Array<{ date: string, status: string, idUsers: string }>;
}

export interface ProspectsItemADD {
    firstName: string;
    lastName: string;
    gender: string;
    age: string;
    address: string;
    region: string;
    departement: string;
    arrondissement: string;
    city: string;
    housing: string;
    zipCode: string;
    district: string;
    phone1: string;
    phone2: string;
    mobile1: string;
    mobile2: string;
    calling: number;
    proprietaire: string;
    profession: string;
    houseAge: string;
    consumption: string;
    roof: string;
    erpReference: string;
    domaine: string;
    facture: { price: number, frequency: string };
    thread: string;
    calls: Array<{ date: string, texte: { value: string, updateAt: string }, idUsers: string, answer: { value: string, updateAt: string }, status: string }>;
    iris: string;
    rdv: Array<{ date: string, status: string, idUsers?: string }>;
}

export interface FilesItemADD {
    name: string;
    success: number;
    error: number;
    date: string;
}

export interface FilesItem {
    _id: string,
    date: string,
    success: number,
    error: number,
    name: string
}

export interface UsersItem {
    _id: string;
    email: string;
    password: string;
    role: string;
    link: string;
    createdAt: Date;
}

export interface UsersItemADD {
    email: string;
    password: string;
    role: string;
    link: string;
}
