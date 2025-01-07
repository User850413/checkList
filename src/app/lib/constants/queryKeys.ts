export const QueryKeys = {
  CHECKS: (tagId: string) => ['checks', tagId],
  INTERESTS: ['interests'],
  MY_INTERESTS: ['interests', 'mine'],
  TAGS: ['tags'],
  MY_TAGS: ['tags', 'mine'],
  TAGS_FILTERED_BY_INTEREST: (interest: string) => ['tags', interest],
  USERS: ['users'],
  USER_ME: ['user', 'me'],
  USER_ME_DETAIL: ['user', 'me', 'detail'],
  USER_ID: (id: string) => ['user', id],
  USER_ID_DETAIL: (id: string) => ['user', id, 'detail'],
};
