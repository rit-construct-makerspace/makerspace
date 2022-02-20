import React from "react";
import { useParams } from "react-router-dom";
import EditMaterialPage from "./EditMaterialPage";
import NewMaterialPage from "./NewMaterialPage";

interface MaterialPageProps {}

export default function MaterialPage({}: MaterialPageProps) {
  const { id } = useParams<{ id: string }>();

  const isNewItem = id.toLocaleLowerCase() === "new";

  return isNewItem ? <NewMaterialPage /> : <EditMaterialPage />;
}
