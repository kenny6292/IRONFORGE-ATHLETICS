import { signup } from "@/app/login/actions";

export default function SignupPage(){
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / JOIN</p><h1>CREATE <i>ACCOUNT.</i></h1><p className="pageLead">Create your member account to manage classes, membership and training requests.</p><form className="contactForm" action={signup}><input name="full_name" placeholder="FULL NAME" required minLength={2}/><input name="email" type="email" placeholder="EMAIL" required/><input name="password" type="password" placeholder="PASSWORD" required minLength={8}/><button className="btn" type="submit">CREATE ACCOUNT →</button></form><p className="notice">Already registered? <a href="/login">Sign in</a></p></main>
}