"use client";

import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import {
  ACTIVATE_SKIN,
  GET_ME,
  GET_USER_SKINS_WITH_STATUS,
} from "@/graphql/queries/user.queries";
import { SkinWithStatus } from "@/types/user.types";
import { useMutation, useQuery } from "@apollo/client/react";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ChangeAvatar({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { data: session, update } = useSession();
  const [selectedSkinId, setSelectedSkinId] = useState<string | null>(null);

  // Esta query trae todas las skins más el status (si esta activa, bloqueada o desbloqueada)
  const { data: skinsData, loading: skinsLoading } = useQuery<{
    userSkinsWithStatus: SkinWithStatus[];
  }>(GET_USER_SKINS_WITH_STATUS);

  // Mutation para cambiar el skin activa
  const [activateSkin, { loading: activating }] = useMutation(ACTIVATE_SKIN, {
    refetchQueries: [
      {
        query: GET_USER_SKINS_WITH_STATUS,
      },
      {
        query: GET_ME,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const skins = skinsData?.userSkinsWithStatus;

  useEffect(() => {
    if (skins && !selectedSkinId) {
      const activeSkin = skins.find((s) => s.isActive);
      if (activeSkin) setSelectedSkinId(activeSkin.id);
    }
  }, [skins, selectedSkinId]);

  // Función para cambiar el skin seleccionado
  const handleSkinClick = (skin: SkinWithStatus) => {
    if (!skin.isUnlocked || skin.isActive) return;
    setSelectedSkinId(skin.id);
  };

  // Función para guardar el skin seleccionado
  const handleSave = async () => {
    if (!selectedSkinId) return;

    try {
      await activateSkin({ variables: { skinId: selectedSkinId } });

      const selectedSkin = skins?.find((skin) => skin.id === selectedSkinId);
      const newAvatarUrl = `${selectedSkin?.img}?v=${Date.now()}`;

      if (selectedSkin?.img) {
        await update({
          user: {
            avatar: selectedSkin.img,
          },
        });

        console.log("✅ Avatar actualizado en sesión:", selectedSkin.img);
        window.dispatchEvent(
          new CustomEvent("avatarChanged", {
            detail: { avatar: selectedSkin.img },
          })
        );
      }
    } catch (error) {
      console.error("Error activating skin:", error);
    }
  };

  const selectedSkin = skins?.find((skin) => skin.id === selectedSkinId);

  const frames = Array.from({ length: 5 });

  // Cuantos skeletons se van a mostrar
  const skeletonCount = 8;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-1/2 w-190 flex max-w-[95%] max-h-[98vh] items-top border border-dark-gray
         bg-white/7 rounded-2xl pr-2 p-6 md:p-8 lg:p-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          z-100"
      >
        <div className="w-full flex flex-col sm:flex-row gap-10 sm:gap-15 overflow-y-auto custom-scrollbar pr-4">
          <div className="flex flex-col items-center gap-5">
            <div className="flex sm:hidden justify-between w-full">
              <Icon
                onClick={closeModal}
                icon="material-symbols:close-rounded"
                className="cursor-pointer text-light-error ml-3 text-3xl"
              />
              <CustomButtonOne
                icon={"material-symbols:check-circle-outline"}
                text="Confirmar"
                color="secondary"
                size="sm"
              />
            </div>
            <h2 className="text-xl font-medium text-font">Preview</h2>
            {skinsLoading ? (
              <div className="h-42 w-42 sm:h-38 sm:w-38 bg-white/10 animate-pulse rounded-full"></div>
            ) : selectedSkin ? (
              <motion.div
                key={selectedSkinId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-42 h-42 sm:h-38 sm:w-38 rounded-full overflow-hidden bg-background border-4 border-medium-blue"
              >
                <Image
                  src={selectedSkin?.img ?? ""}
                  alt="Avatar"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="w-42 h-42 sm:h-38 sm:w-38 rounded-full bg-background border-4 border-medium-blue flex items-center justify-center">
                <Icon
                  icon="mdi:user"
                  className="text-6xl text-subtitle"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-10 w-full">
            <div className="w-full">
              <h3 className="text-xl font-medium text-font">
                Avatares disponibles
              </h3>
              <div className="custom-grid-avatar gap-5 mt-5 w-full">
                {skinsLoading ? (
                  <>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                      <div
                        key={index}
                        className="w-19 h-19 bg-white/10 animate-pulse rounded-full"
                      ></div>
                    ))}
                  </>
                ) : (
                  skins?.map((skin) => (
                    <motion.div
                      key={skin.id}
                      onClick={() => handleSkinClick(skin)}
                      whileHover={
                        skin.isUnlocked &&
                        !skin.isActive &&
                        skin.id !== selectedSkinId
                          ? { scale: 1.05 }
                          : {}
                      }
                      whileTap={
                        skin.isUnlocked &&
                        !skin.isActive &&
                        skin.id !== selectedSkinId
                          ? { scale: 0.95 }
                          : {}
                      }
                      className={`
                relative rounded-full overflow-hidden transition-all
                ${
                  skin.isActive
                    ? "ring-3 ring-shadow-blue"
                    : skin.id === selectedSkinId
                    ? "ring-3 ring-medium-blue drop-shadow-[0_0_10px_var(--color-medium-blue)]"
                    : !skin.isUnlocked
                    ? "cursor-not-allowed"
                    : " hover:border-white/30 cursor-pointer"
                }
              `}
                    >
                      <div
                        className={`w-full h-full bg-white/5 flex items-center justify-center
                ${!skin.isUnlocked ? "opacity-30" : ""}`}
                      >
                        <Image
                          src={skin.img}
                          alt={skin.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {!skin.isUnlocked && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1">
                          <Icon
                            icon="mdi:lock-outline"
                            className="text-subtitle text-3xl"
                          />
                          <span className="text-xs text-subtitle font-medium">
                            Nivel {skin.level}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-xl font-medium text-font">
                Marcos disponibles
              </h3>
              <div className="custom-grid-avatar gap-5 mt-5 w-full">
                {frames.map((_, index) => (
                  <div
                    key={index}
                    className="h-16 w-16 sm:h-18 sm:w-18 bg-background rounded-full"
                  ></div>
                ))}
              </div>
            </div>
            <div className="hidden items-center gap-5 mt-3 sm:flex">
              <CustomButtonOne
                icon={"material-symbols:check-circle-outline"}
                text="Confirmar"
                color="secondary"
                action={handleSave}
                loading={activating}
                disabled={!selectedSkinId}
              />
              <CustomButtonOne
                action={closeModal}
                icon={"material-symbols:cancel-outline-rounded"}
                text="Cancelar"
                color="error"
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="fixed w-full h-full top-0 left-0 bg-black/80 backdrop-blur-md z-99"
      ></motion.div>
    </>
  );
}
