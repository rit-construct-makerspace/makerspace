import Page from "./Page";
import { useLocation } from "react-router-dom";


export default function NoPrivilegePage() {
  const location = useLocation();

  return (
    <Page title="Insufficent Privilege" maxWidth="736px">
        Insufficent permisisons to access "{location.pathname}".
    </Page>
  );
}