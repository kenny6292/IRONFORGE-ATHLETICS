import { login } from "@/app/login/actions";

export default function Login(){
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / MEMBER AREA</p><h1>MEMBER <i>LOGIN.</i></h1><p className="pageLead">Sign in to manage your membership and class bookings.</p><form className="contactForm" action={login}><input name="email" required type="email" placeholder="EMAIL"/><input name="password" required type="password" placeholder="PASSWORD"/><button className="btn primary" type="submit">SIGN IN →</button></form><p className="notice">New member? <a href="/signup">Create an account</a></p></main>
}