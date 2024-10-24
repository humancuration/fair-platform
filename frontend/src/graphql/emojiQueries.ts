import { gql } from '@apollo/client';

export const GET_GROUP_EMOJIS = gql`
  query GetGroupEmojis($groupId: ID!) {
    groupEmojis(groupId: $groupId) {
      id
      name
      url
      price
      isPublic
      createdBy {
        id
        username
      }
    }
  }
`;

export const UPLOAD_EMOJI = gql`
  mutation UploadEmoji($groupId: ID, $file: Upload!, $name: String!, $price: Float!, $isPublic: Boolean!) {
    uploadEmoji(
      groupId: $groupId
      file: $file
      name: $name
      price: $price
      isPublic: $isPublic
    ) {
      id
      name
      url
    }
  }
`;

export const UPDATE_EMOJI = gql`
  mutation UpdateEmoji($emojiId: ID!, $name: String, $price: Float, $isPublic: Boolean) {
    updateEmoji(
      emojiId: $emojiId
      name: $name
      price: $price
      isPublic: $isPublic
    ) {
      id
      name
      price
      isPublic
    }
  }
`;

export const DELETE_EMOJI = gql`
  mutation DeleteEmoji($emojiId: ID!) {
    deleteEmoji(emojiId: $emojiId)
  }
`;
