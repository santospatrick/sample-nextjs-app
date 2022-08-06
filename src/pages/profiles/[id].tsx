import UserProfileForm from "@/components/forms/UserProfileForm";
import {
  FormValues,
  UserProfileFormRef,
} from "@/components/forms/UserProfileForm/UserProfileForm";
import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import React, { ReactElement, useRef } from "react";
import { SubmitHandler } from "react-hook-form";
import { GetServerSideProps } from "next";
import api, { getAPIClient, httpErrorHandler } from "@/services/api";

type Data = {
  createdAt: string;
  id: string;
  name: string;
  status: boolean;
  updatedAt: string;
};

type Props = {
  data: Data;
};

const EditProfile = ({ data }: Props) => {
  const formRef = useRef<UserProfileFormRef>(null);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await api.put(`profiles/${data.id}`, {
        name: values.name,
      });
    } catch (error) {
      httpErrorHandler(error, formRef.current?.setError);
    }
  };

  return (
    <Container maxW="600px" m="auto" py={10}>
      <UserProfileForm ref={formRef} onSubmit={onSubmit} defaultValues={data} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const api = getAPIClient(ctx);
  const { data } = await api.get(`profiles/${ctx.query.id}`);

  return {
    props: {
      data,
    },
  };
};

EditProfile.getLayout = (app: ReactElement) => {
  return <PrivatePage>{app}</PrivatePage>;
};

export default EditProfile;
