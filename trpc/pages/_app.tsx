import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import "normalize.css";
import "./style.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
