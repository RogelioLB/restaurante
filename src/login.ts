import { User } from "firebase/auth";
import { login } from "./db/auth";

const submitButton = document.getElementById('submit');

submitButton?.addEventListener('click', async (e) => {
  e.preventDefault()
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const user = await login(email, password);
  if(!(user as User).email) return alert(user)
  window.location.href = '/';
});