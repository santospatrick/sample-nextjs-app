import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

type Props = unknown;

const Profiles: NextPageWithLayout<Props> = () => {
  return <div>profiles</div>;
};

Profiles.getLayout = (app: ReactElement) => {
  return <div>{app}</div>;
};

export default Profiles;
