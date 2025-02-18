import { NextResponse } from 'next/server';
import { updateProspectRDV, getProspectbyPhone, createProspectJsonFromErp, createProspect } from '@/action/ManageProspect';

export async function POST(req, { params }) {

  const listData = await req.json();

  console.log(listData);

  const result = await Promise.all(listData.map(async row => {

    const {prospect, ...data} = row;

    const resultat = await getProspectbyPhone(prospect.phone1);

    if (resultat === null || !data) {
      // Si je ne retrouve pas le prospect 
      // Je vais créer le prospect
      const formatedProspect = await createProspectJsonFromErp(prospect);
      await createProspect(formatedProspect);
      
    }else{
      await updateProspectRDV(resultat._id, data, false);
    }

  }));

  return NextResponse.json({ code: "007",message : "Prospect added To CallCenter.", data:{}});

}

export const OPTIONS = async (request) => {
  // Return Response
  return NextResponse.json(
    {},
    {
      status: 200,
      // headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
  );
};
