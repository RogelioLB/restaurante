import { createUser } from "./db/auth";
import { User } from "firebase/auth";

const submitButton = document.getElementById('submit');

submitButton?.addEventListener('click', async (e) => {
  e.preventDefault()
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const user = await createUser(email, password);
  if(!(user as User).email) return alert(user)
  window.location.href = '/';
});