export const getScrollbarStyles = (theme: any) => ({
  scrollbarWidth: "thin",
  scrollbarColor: `${theme.palette.scroll.color} transparent`,

  "&::-webkit-scrollbar": {
    width: 6,
    height: 6,
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },

  "&::-webkit-scrollbar-track-piece": {
    backgroundColor: theme.palette.scroll.background,
    borderRadius: 999,
    marginBlock: 6,
    marginInline: 6,
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.scroll.color,
    borderRadius: 999,
    minHeight: 40,
    margin: 2,
    transition: "background-color 0.2s ease",
  },

  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.scroll.hover,
  },
});
