'use client'

interface BodyItem {
    _id: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    district: string;
    phone1: string;
    phone2: string;
    calling: number;
    calls: string[];
    rdv: Array<{ date: string, statut: string }>;
}

interface TableRDVProps {
    prospectsRDV: BodyItem[] | null;
}

const TableRDV = ({ prospectsRDV }: TableRDVProps) => {
    return (
        <div className="flex flex-col">
            <div data-cy="tableau" className=" container mx-auto overflow-y-auto max-h-[700px]">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Adresse</th>
                            <th>Ville</th>
                            <th>Code Postal</th>
                            <th>Rendez-vous</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prospectsRDV?.map((prospect) => (
                            <tr key={prospect._id}>
                                <td>{prospect.lastName}</td>
                                <td>{prospect.firstName}</td>
                                <td>{prospect.address}</td>
                                <td>{prospect.city}</td>
                                <td>{prospect.zipCode}</td>
                                <td>
                                    {prospect.rdv.map((rdv) => (
                                        <div key={rdv.date}>
                                            {rdv.date.split(" ")[1]} {rdv.statut}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default TableRDV
