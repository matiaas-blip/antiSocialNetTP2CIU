export function PageWrapper({ children }: any) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>{children}</div>
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #1a1a1a, #0a0a0a)",
    display: "flex",
    justifyContent: "center",
    padding: "20px 20px 20px 220px", 
    color: "white",
  },

  container: {
    width: "100%",
    maxWidth: 900,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
};