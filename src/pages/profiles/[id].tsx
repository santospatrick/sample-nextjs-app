import UserProfileForm from "@/components/forms/UserProfileForm";
import { FormValues } from "@/components/forms/UserProfileForm/UserProfileForm";
import PrivatePage from "@/layouts/PrivatePage";
import React, { ReactElement } from "react";
import { SubmitHandler } from "react-hook-form";

type Props = unknown;

const EditProfile = (_props: Props) => {
  const onSubmit: SubmitHandler<FormValues> = (_values) => null;

  return (
    <div>
      <UserProfileForm onSubmit={onSubmit} />
    </div>
  );
};

EditProfile.getLayout = (app: ReactElement) => {
  return <PrivatePage>{app}</PrivatePage>;
};

export default EditProfile;
