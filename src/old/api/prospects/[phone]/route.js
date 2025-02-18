import { NextResponse } from 'next/server';
import { updateProspectRDV, getProspectbyPhone, createProspectJsonFromErp, createProspect } from '@/action/ManageProspect';

export async function POST(req, { params }) {

  const { phone } = params;

  const {prospect, ...data} = await req.json();

  const resultat = await getProspectbyPhone(phone);

  if (resultat === null || !data) {

    // Si je ne retrouve pas le prospect 
    // Je vais créer le prospect
    const formatedProspect = await createProspectJsonFromErp(prospect);
    await createProspect(formatedProspect);

    return NextResponse.json({ code: "007",message : "Prospect added To CallCenter.", data:{}});

  }

  await updateProspectRDV(resultat._id, data, false);

  return NextResponse.json({
      message : "RDV added"
  });
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
