import InputBox from '../common/inputBox';
import StyledButton from '../common/styledButton';

export default function AuthForm() {
  return (
    <div className="w-[480px] mx-auto bg-white shadow-card rounded-xl p-10 flex flex-col items-center gap-5">
      <InputBox label="Email" type="email" required />
      <InputBox label="비밀번호" type="password" required />
      <StyledButton className="w-full">로그인</StyledButton>
    </div>
  );
}
