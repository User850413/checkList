export const QueryKeys = {
  CHECKS: (tagId: string) => ['checks', tagId],
  INTERESTS: ['interests'],
  MY_INTERESTS: ['interests', 'mine'],
  MY_INTERESTS_COMPLETED: ['interests', 'mine', 'isCompleted'],
  MY_INTERESTS_UNCOMPLETED: ['interests', 'mine', 'unCompleted'],
  TAGS: ['tags'],
  MY_TAGS: ['tags', 'mine'],
  MY_TAGS_COMPLETED: ['tags', 'mine', 'isCompleted'],
  MY_TAGS_UNCOMPLETED: ['tags', 'mine', 'unCompleted'],
  TAGS_FILTERED_BY_INTEREST: (interest: string) => ['tags', interest],
  USERS: ['users'],
  USER_ME: ['user', 'me'],
  USER_ME_DETAIL: ['user', 'me', 'detail'],
  USER_ID: (id: string) => ['user', id],
  USER_ID_DETAIL: (id: string) => ['user', id, 'detail'],
};
