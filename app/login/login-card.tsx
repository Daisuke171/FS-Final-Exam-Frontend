import LoginForm from "./login-form";

export default function LoginCard() {
  return (
    <div className="p-6 py-8 md:p-8 lg:p-10 bg-white/7 rounded-2xl w-130 max-w-[95%] backdrop-blur-md">
      <h2 className="font-black text-3xl text-font">INICIA SESIÓN</h2>
      <p className="text-subtitle">
        Ingresa a tu cuenta para subir de nivel y empezar a ganar recompenzas
      </p>
      <LoginForm />
    </div>
  );
}
