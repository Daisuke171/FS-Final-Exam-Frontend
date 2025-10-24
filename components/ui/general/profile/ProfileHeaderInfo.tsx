import { Icon } from "@iconify/react";
import ChipOne from "../../chips/profile/ChipOne";
import { User } from "@/types/user.types";
import Image from "next/image";
import ProfileHeaderInfoSkeleton from "../../skeletons/profile/ProfileHeaderInfoSkeleton";

export default function ProfileHeaderInfo({
  action,
  user,
  error,
  loading,
}: {
  action: () => void;
  user: User | undefined;
  error: Error | undefined;
  loading: boolean;
}) {
  const activeSkin = user?.skins?.find((userSkin) => userSkin.active);
  if (loading) return <ProfileHeaderInfoSkeleton />;
  if (error)
    return (
      <article className="flex justify-between flex-shrink-0 md:pr-8 xl:pr-0 items-center gap-8">
        <div className="flex flex-col items-center">
          <Icon
            icon="mynaui:sad-ghost"
            width="50"
            className="text-font"
          />
          <h2 className="text-lg text-font font-medium">
            No se ha podido cargar tu información
          </h2>
          <p className="text-subtitle">{error.message}</p>
        </div>
      </article>
    );
  return (
    <article className="flex justify-between flex-shrink-0 md:pr-8 xl:pr-0 items-center gap-8">
      <div className="flex items-center gap-5">
        <div
          onClick={action}
          className="h-26 w-26 xl:h-30 xl:w-30  cursor-pointer group flex items-center relative justify-center overflow-hidden rounded-full bg-background border border-dark-gray"
        >
          {activeSkin?.skin?.img ? (
            <Image
              src={activeSkin.skin.img}
              alt={activeSkin.skin.name || "avatar"}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon
              icon="mdi:user"
              className="text-subtitle text-[75px] xl:text-[85px]"
            />
          )}

          <div className="w-full hidden lg:block h-full absolute transition-all duration-300 opacity-0 group-hover:opacity-100 bg-black/95 rounded-full"></div>
          <Icon
            icon="mdi:account-cog"
            width="50"
            className="absolute hidden lg:block transition-all duration-300 text-font transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
          />
        </div>
        <div className="flex flex-col  [@media(min-width:458px)_and_(max-width:1024px)]:gap-5 [@media(min-width:458px)_and_(max-width:1024px)]:flex-row">
          <div className="flex flex-col">
            <Icon
              onClick={action}
              icon="mdi:account-cog"
              width="30"
              className="lg:hidden flex place-self-start mb-1"
            />
            <div className="flex items-center gap-5">
              <h2 className="text-lg text-font font-medium flex items-center gap-1">
                {user?.nickname}
                <Icon
                  icon="material-symbols:verified"
                  width="22"
                  className="text-light-blue"
                />
              </h2>
              {/* Futura función para cambiar el nickname */}
              {/* <Icon
                          icon="material-symbols:edit-rounded"
                          width="22"
                          className="hover:text-light-blue transition-all cursor-pointer"
                        /> */}
            </div>
            <p className="text-subtitle truncate max-w-[23ch] md:max-w-full">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2 [@media(min-width:458px)_and_(max-width:1024px)]:gap-0 [@media(min-width:458px)_and_(max-width:1024px)]:flex-col">
            <ChipOne
              value={user?.totalScore ? user.totalScore : 0}
              icon="ix:trophy-filled"
              color="secondary"
            />
            <ChipOne
              value={user?.coins ? user.coins : 0}
              icon="ix:coins-filled"
              color="primary"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
