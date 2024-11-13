import { Button, Stack } from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";
import AdminPage from "../../AdminPage";
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from "@apollo/client";
import { GET_TOOL_ITEM_INSTANCE, GET_TOOL_ITEM_TYPES_WITH_INSTANCES } from "../../../queries/toolItemQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import { ToolItemInstance, ToolItemType } from "../../../types/ToolItem";
import { ToolItemTypeCard } from "./ToolItemTypeCard";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ToolItemTypeModal } from "./ToolItemTypeModal";
import { ToolItemInstanceModal } from "./ToolItemInstanceModal";
import { SetStateAction, useState } from "react";
import { LoanToolItemModal } from "./LoanToolItemModal";
import { ReturnToolItemModal } from "./ReturnToolItemModal";
import { CreateToolItemInstanceModal, EditToolItemInstanceModal } from "./EditCreateToolItemInstanceModal";
import { ToolItemsByUser } from "./ToolItemsByUser";


export function ToolItemPage() {
  const { typeid, instanceid } = useParams<{ typeid: string, instanceid: string }>();
  const [searchParams] = useSearchParams()
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const getToolItemTypes = useQuery(GET_TOOL_ITEM_TYPES_WITH_INSTANCES);

  const [currentType, setCurrentType] = useState<ToolItemType>();

  const [loanItem, setLoanItem] = useState<ToolItemInstance>();
  function handleLoanInstanceClick(item: ToolItemInstance, type: ToolItemType) {
    setLoanItem(item);
    setCurrentType(type);
  }

  const [returnItem, setReturnItem] = useState<ToolItemInstance>();
  function handleReturnInstanceClick(item: ToolItemInstance, type: ToolItemType) {
    setReturnItem(item);
    setCurrentType(type);
  }
  
  return (
    <AdminPage title="Tools" 
      topRightAddons={currentUser.privilege == Privilege.STAFF && <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={() => navigate(`/admin/tools/type`)}>Create Type</Button>}>

      {/* <ToolItemsByUser handleReturnItemClick={handleReturnInstanceClick} /> */}

      <RequestWrapper loading={getToolItemTypes.loading} error={getToolItemTypes.error}>
        <Stack direction={"column"} spacing={4}>
          {getToolItemTypes.data?.toolItemTypes.map((type: ToolItemType) => (
            <ToolItemTypeCard type={type} handleLoanInstanceClick={handleLoanInstanceClick} handleReturnInstanceClick={handleReturnInstanceClick} />
          ))}

          {location.pathname.includes("type") && !getToolItemTypes.loading && <ToolItemTypeModal type={!typeid ? undefined : getToolItemTypes.data?.toolItemTypes.find((type: ToolItemType) => type.id == Number(typeid))} />}
          {location.pathname.includes("instance") && searchParams.get("type") && !getToolItemTypes.loading && (instanceid 
            ? <EditToolItemInstanceModal itemID={Number(instanceid)} type={getToolItemTypes.data?.toolItemTypes.find((type: ToolItemType) => type.id == Number(searchParams.get("type")))} />
            : <CreateToolItemInstanceModal type={getToolItemTypes.data?.toolItemTypes.find((type: ToolItemType) => type.id == Number(searchParams.get("type")))} />)}
        </Stack>
      </RequestWrapper>

      {loanItem && currentType && <LoanToolItemModal item={loanItem} setItem={setLoanItem} type={currentType} />}
      {returnItem && currentType && <ReturnToolItemModal item={returnItem} setItem={setReturnItem} type={currentType} />}
    </AdminPage>
  );
}