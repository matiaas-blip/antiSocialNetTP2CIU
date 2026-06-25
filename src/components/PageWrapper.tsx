import  ReactNode  from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div style={styles.page}>
      <main style={styles.container}>{children}</main>
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "white",
  },

  container: {
    padding: 20,
    maxWidth: 1000,
    margin: "0 auto",
  },
};