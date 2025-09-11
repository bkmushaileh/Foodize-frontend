interface SignInUserInfo {
  username: string;
  password: string;
}

interface UserInfo extends SignInUserInfo {
  username: string;
  password: string;
  image: string;
  email: string;
}

export { SignInUserInfo, UserInfo };
