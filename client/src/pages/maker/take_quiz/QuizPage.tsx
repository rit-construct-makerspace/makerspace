import React from "react";
import Page from "../../Page";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_MODULE } from "../../admin/edit_module/EditModulePage";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { Module } from "../../../types/Quiz";
import QuizTaker from "./QuizTaker";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const result = useQuery(GET_MODULE, { variables: { id } });

  return (
    <RequestWrapper2
      result={result}
      render={({ module }: { module: Module }) => (
        <Page title={module.name} maxWidth="800px">
          <QuizTaker quiz={module.quiz} />
        </Page>
      )}
    />
  );
}
