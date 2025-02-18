import { NextApiRequest, NextApiResponse } from 'next';
import { updateProspectRDV, getProspectbyPhone } from '@/action/ManageProspect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const {
        query: { phone },
    } = req;

    const data = req.body;

    const resultat = await getProspectbyPhone(phone as string);

    if (resultat === null) {
        res.status(404).json({ error: "Prospect not found." });
        return;
    }

    await updateProspectRDV(resultat._id, data, false);

    res.status(200).json({ message: "RDV added" });
    return;
}
