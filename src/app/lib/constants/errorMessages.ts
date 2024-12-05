const ERROR_MESSAGES = {
  EMPTY_EMAIL: {
    ko: '이메일은 필수 입력사항입니다',
  },
  INVALID_EMAIL: {
    ko: '올바르지 않은 이메일 형식입니다',
  },
  EMPTY_PWD: {
    ko: '비밀번호는 필수 입력사항입니다',
  },
  SHORT_PWD: {
    ko: '비밀번호는 8자 이상이어야 합니다',
  },
  PWD_CHECK_ERROR: {
    ko: '비밀번호가 일치하지 않습니다',
  },
  INVALID_USER: {
    ko: '아이디 또는 비밀번호가 올바르지 않습니다',
  },
  EMPTY_USERNAME: {
    ko: '닉네임은 1자 이상이어야 합니다!',
  },
  LOGIN_ERROR: {
    ko: '로그인 중 오류가 발생했습니다',
  },
  REGISTER_ERROR: {
    ko: '회원가입 중 오류가 발생했습니다',
  },
  TOO_MANY_TRIES: {
    ko: '너무 많은 시도가 있었습니다. 나중에 다시 시도해 주세요',
  },
  EXPIRED_TOKEN: {
    ko: '토큰이 만료되었습니다',
  },
  EXPIRED_SESSION: {
    ko: '세션이 만료되었습니다',
  },
  INVALID_TOKEN: {
    ko: '유효하지 않은 토큰입니다',
  },
  TOKEN_ERROR: {
    ko: '토큰 검증 중 문제가 발생했습니다',
  },
  JWT_SECRET_ERROR: {
    ko: '환경 변수 JWT_SECRET이 설정되지 않았습니다',
  },
  SERVER_ERROR: {
    ko: '서버 에러가 발생하였습니다',
  },
  EMPTY_ID: {
    ko: 'id값은 필수 항목입니다',
  },
  EMPTY_TAGNAME: {
    ko: '태그명은 1자 이상이어야 합니다',
  },
  NOT_FOUND_TAG: {
    ko: '존재하지 않는 태그입니다',
  },
  NOT_FOUND_USER: {
    ko: '존재하지 않는 유저입니다',
  },
};

export default ERROR_MESSAGES;
