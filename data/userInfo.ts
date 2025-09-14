interface SignInUserInfo {
  email: string;
  password: string;
}

interface UserInfo extends SignInUserInfo {
  username: string;
  image: string;
}

export { SignInUserInfo, UserInfo };
