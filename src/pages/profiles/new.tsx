import React, { ReactElement, useRef } from "react";
import UserProfileForm, {
  FormValues,
  UserProfileFormRef,
} from "@/components/forms/UserProfileForm/UserProfileForm";
import { SubmitHandler } from "react-hook-form";
import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import api, { httpErrorHandler } from "@/services/api";
import { toast } from "react-toastify";

type Props = unknown;

const NewProfile = (_props: Props) => {
  const formRef = useRef<UserProfileFormRef>();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await api.post("profiles", values);
      toast.success("Profile created successfully!");
    } catch (error) {
      httpErrorHandler(error, formRef.current?.setError);
    }
  };

  return (
    <Container maxW="600px" m="auto" py={10}>
      <UserProfileForm onSubmit={onSubmit} />
    </Container>
  );
};

NewProfile.getLayout = (app: ReactElement) => {
  return <PrivatePage>{app}</PrivatePage>;
};

export default NewProfile;
