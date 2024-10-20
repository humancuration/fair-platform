import { gql } from '@apollo/client';

export const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      id
      name
      # Add other fields you need for campaigns here
    }
  }
`;
