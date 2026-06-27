const PROFILE_STORAGE_KEY = (userId: string) =>
  `antisocial_profile_${userId}`;

export const profileStorage = {
  get(userId: string) {
    try {
      return JSON.parse(
        localStorage.getItem(PROFILE_STORAGE_KEY(userId)) || "null"
      );
    } catch {
      return null;
    }
  },

  set(userId: string, data: any) {
    localStorage.setItem(
      PROFILE_STORAGE_KEY(userId),
      JSON.stringify(data)
    );
  },

  remove(userId: string) {
    localStorage.removeItem(PROFILE_STORAGE_KEY(userId));
  },

  merge(userId: string, backendUser: any) {
    const local = this.get(userId);

    return {
      ...backendUser,
      descripcion:
        local?.descripcion ?? backendUser.descripcion ?? "",
      fotoPerfil:
        local?.fotoPerfil ?? backendUser.fotoPerfil ?? "",
      fondoPerfil:
        local?.fondoPerfil ?? backendUser.fondoPerfil ?? "",
      canciones:
        local?.canciones ?? backendUser.canciones ?? [],
      theme: local?.theme ?? backendUser.theme ?? {
        primary: "#8b5cf6",
      },
    };
  },
};