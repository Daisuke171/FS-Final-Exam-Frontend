import { Icon } from "@iconify/react";
import Link from "next/link";

const socials = [
  { icon: "mdi:instagram", link: "https://instagram.com" },
  { icon: "ic:baseline-discord", link: "https://discord.com" },
  { icon: "ri:twitter-x-fill", link: "https://x.com" },
  { icon: "ri:github-fill", link: "https://github.com" },
  { icon: "ic:baseline-facebook", link: "https://facebook.com" },
  { icon: "uil:linkedin", link: "https://linkedin.com" },
];

const articles = [
  {
    title: "Juegos",
    list: [
      { title: "Piedra, papel o tijera", link: "#" },
      { title: "Coding War", link: "#" },
      { title: "Math War", link: "#" },
    ],
  },
  {
    title: "Recursos",
    list: [
      { title: "Como jugar", link: "#" },
      { title: "Sistema de niveles", link: "#" },
      { title: "Ranking", link: "#" },
    ],
  },
  {
    title: "Legal",
    list: [
      { title: "Terminos y condiciones", link: "#" },
      { title: "Privacidad", link: "#" },
      { title: "Contacto", link: "#" },
    ],
  },
];

const badges = [
  {
    title: "JUEGA",
    icon: "mdi:controller",
    color: "bg-transparent-blue text-light-blue",
  },
  {
    title: "COMPITE",
    icon: "material-symbols:trophy",
    color: "bg-transparent-ranking text-ranking",
  },
  {
    title: "EVOLUCIONA",
    icon: "mdi:atom",
    color: "bg-light-purple/20 text-bright-purple",
  },
];

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full pb-[calc(69px+2rem)] pt-8 md:py-8 px-10 bg-gradient-to-b from-black/40 to-black/10">
      <div className="flex md:flex-row flex-col items-center justify-around lg:justify-between gap-10 md:gap-5 w-full max-w-300 mb-8">
        <div className="flex flex-col items-start lg:gap-2">
          <h2 className="text-[2.8rem] leading-none tracking-widest font-extrabold text-transparent text-clip bg-clip-text bg-gradient-to-r from-light-blue to-bright-purple">
            SANYA
          </h2>
          <div className="flex flex-col gap-1 font-bold items-start">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className={`flex items-center text-xl gap-2 px-2 py-1 rounded-xl ${badge.color}`}
              >
                <Icon
                  icon={badge.icon}
                  className="text-2xl"
                />
                {badge.title}
              </div>
            ))}
          </div>
        </div>
        <div className="grid items-start grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-10 md:gap-15">
          {articles.map((article) => (
            <article
              key={article.title}
              className="ml-8 md:ml-0"
            >
              <h3 className="text-xl font-medium mb-3">{article.title}</h3>
              <ul className="flex flex-col gap-2 text-subtitle">
                {article.list.map((item) => (
                  <li
                    key={item.title}
                    className="hover:text-light-blue transition-all duration-300"
                  >
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <div className="grid grid-cols-2  ml-8 md:ml-0 gap-y-3 w-fit gap-x-4 lg:hidden">
            {socials.map((social, i) => (
              <Link
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  icon={social.icon}
                  className="text-font text-4xl hover:text-light-blue transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-y-3 gap-x-4">
          {socials.map((social, i) => (
            <Link
              key={i}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                icon={social.icon}
                className="text-font text-4xl hover:text-light-blue transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="h-0.5 w-full max-w-[1200px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
      <div className="flex flex-col items-center gap-4 mt-8 text-center">
        <p className="text-subtitle tracking-wide">
          Hecho por{" "}
          <Link
            target="_blank"
            href="https://github.com/StefanoRC"
            className="font-medium text-font hover:underline"
          >
            Stefano
          </Link>
          ,{" "}
          <Link
            target="_blank"
            href="https://github.com/AilenRF21"
            className="font-medium text-font hover:underline"
          >
            Aylen
          </Link>
          ,{" "}
          <Link
            target="_blank"
            href="https://github.com/Nicron7"
            className="font-medium text-font hover:underline"
          >
            Nicolás
          </Link>
          ,{" "}
          <Link
            target="_blank"
            href="https://github.com/YamiVeraLopez"
            className="font-medium text-font hover:underline"
          >
            Yamila
          </Link>{" "}
          y{" "}
          <Link
            target="_blank"
            href="https://github.com/Daisuke171"
            className="font-medium text-font hover:underline"
          >
            Agustín
          </Link>
          .
        </p>
        <p className="text-subtitle font-light text-sm">
          © 2025 SANYA GAMES. Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
