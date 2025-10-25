"use client";
import { Icon } from "@iconify/react";

const items = [
	{ icon: "mdi:home", label: "Inicio" },
	{ icon: "mdi:account-group", label: "Amigos" },
	{ icon: "mdi:chat", label: "Salas" },
	{ icon: "mdi:gamepad-variant", label: "Juegos" },
	{ icon: "mdi:trophy", label: "Ranking" },
];

export default function BottomNav() {
	return (
		<nav
			className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-[rgba(25,20,40,.95)] backdrop-blur
                    border-t border-cyan-300/30 shadow-[0_-4px_16px_rgba(76,201,240,.15)]"
		>
			<ul className="grid grid-cols-5 h-full">
				{items.map((it) => (
					<li
						key={it.label}
						className="grid place-items-center text-cyan-100"
					>
						<button className="flex flex-col items-center gap-0.5 text-[11px]">
							<Icon icon={it.icon} width="20" />
							{it.label}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}
