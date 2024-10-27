import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { gql, useQuery } from '@apollo/client';
import { prisma } from '~/utils/db.server';
import AffiliateLinksPage from '~/components/dashboard/affiliate/AffiliateLinksPage';

const GET_AFFILIATE_PROGRAMS = gql`
  query GetAffiliatePrograms {
    affiliatePrograms {
      id
      name
      commissionRate
    }
  }
`;

export async function loader() {
  const affiliateLinks = await prisma.affiliateLink.findMany({
    include: {
      affiliateProgram: true,
    },
  });

  return json({ affiliateLinks });
}

export default function AffiliateDashboard() {
  const { affiliateLinks } = useLoaderData<typeof loader>();
  const { data, loading } = useQuery(GET_AFFILIATE_PROGRAMS);

  return (
    <AffiliateLinksPage 
      links={affiliateLinks}
      programs={data?.affiliatePrograms || []}
      loading={loading}
    />
  );
}
