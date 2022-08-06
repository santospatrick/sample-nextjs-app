import ConfirmDialog from "@/components/ConfirmDialog";
import DataTable from "@/components/DataTable";
import ProfileFilterForm from "@/components/forms/ProfileFilterForm";
import { FormValues } from "@/components/forms/ProfileFilterForm/ProfileFilterForm";
import ModalFullscreen from "@/components/ModalFullscreen";
import PrivatePage from "@/layouts/PrivatePage";
import api from "@/services/api";
import { Container, HStack, IconButton, useBoolean } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import localePt from "date-fns/locale/pt-BR";
import Link from "next/link";
import React, { ReactElement, useMemo, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { MdArrowRightAlt, MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { NextPageWithLayout } from "../_app";

type Props = unknown;

type Filters = {
  name: string;
};

const perPage = 5;

const Profiles: NextPageWithLayout<Props> = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<Filters>>({});
  const [isFiltersOpen, { on, off }] = useBoolean();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: isLoadingDeletion } = useMutation(() =>
    api.delete(`profiles/${idToDelete}`)
  );

  const {
    data: profiles,
    isLoading,
    error,
  } = useQuery(["profiles", page, searchTerm, filters], () =>
    api
      .get("profiles", {
        params: {
          page,
          perPage,
          status: true,
          name: searchTerm || filters?.name,
        },
      })
      .then((response) => response.data)
  );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Created at",
        accessor: "createdAt",
        Cell: ({ value }: { value: string }) => {
          const formattedDate = format(parseISO(value), "Pp", {
            locale: localePt,
          });
          return formattedDate;
        },
      },
      {
        Header: "Actions",
        Cell: (data: any) => (
          <HStack>
            <Link href={`/profiles/${data.cell.row.original.id}`} passHref>
              <IconButton
                aria-label={"Edit profile"}
                icon={<MdArrowRightAlt size={22} />}
              />
            </Link>
            <IconButton
              aria-label={"Delete profile"}
              onClick={() => {
                setIdToDelete(data.cell.row.original.id);
              }}
              icon={<MdDelete size={22} />}
            />
          </HStack>
        ),
      },
    ],
    []
  );

  const onConfirmDelete = async () => {
    try {
      await mutateAsync();
      setIdToDelete(null);
      queryClient.invalidateQueries(["profiles", page]);
      toast.success("Profile deleted successfully!");
    } catch (error) {
      toast.error("Could not delete profile, try again later");
    }
  };

  const onSubmitFilters: SubmitHandler<FormValues> = (values) => {
    setFilters(values);
    off();
    setPage(1);
  };

  if (error) {
    return <div>An error has ocurred: {error}</div>;
  }

  return (
    <Container maxW="1400px" m="auto" py={10}>
      <ConfirmDialog
        isOpen={!!idToDelete}
        onClose={() => setIdToDelete(null)}
        isLoading={isLoadingDeletion}
        onConfirm={onConfirmDelete}
      />
      <ModalFullscreen isOpen={isFiltersOpen} onClose={off}>
        <ProfileFilterForm onSubmit={onSubmitFilters} defaultValues={filters} />
      </ModalFullscreen>
      <DataTable
        columns={columns}
        data={profiles?.data}
        pagination={profiles?.pagination}
        perPage={perPage}
        page={page}
        onChangePage={(nextPage: number) => {
          setPage(nextPage);
        }}
        isLoading={isLoading}
        onSearchDebounced={(searchText) => {
          setSearchTerm(searchText);
        }}
        onClickFilter={on}
      />
    </Container>
  );
};

Profiles.getLayout = (app: ReactElement) => {
  return <PrivatePage>{app}</PrivatePage>;
};

export default Profiles;
