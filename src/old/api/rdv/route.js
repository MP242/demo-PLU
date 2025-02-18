import { NextResponse } from 'next/server';

export function GET(req, res) {

  console.log(req.nextUrl);

  // Traite la requête POST
  return NextResponse.json({
    message : "Voila"
});
}