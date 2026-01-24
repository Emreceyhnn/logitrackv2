export const getScrollbarStyles = (theme: any) => ({
    /* Firefox */
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.palette.scroll.color} transparent`,

    /* WebKit */
    "&::-webkit-scrollbar": {
        width: 6,
        height: 6,
    },

    /* RAY (arka kanal) */
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
    },

    /* RAY İÇİ KAPSAYICI (asıl trick) */
    "&::-webkit-scrollbar-track-piece": {
        backgroundColor: theme.palette.scroll.background,
        borderRadius: 999,
        marginBlock: 6, // 🔥 üst-alt boşluk
        marginInline: 6, // 🔥 sağ-sol boşluk
    },

    /* THUMB */
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.scroll.color,
        borderRadius: 999,
        minHeight: 40, // 🔥 kısa olmasın
        margin: 2, // 🔥 rayın içinde ortalanır
        transition: "background-color 0.2s ease",
    },

    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: theme.palette.scroll.hover,
    },
});