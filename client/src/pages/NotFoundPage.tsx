import Page from "./Page";
import { useLocation } from "react-router-dom";


export default function TrainingPage() {
  const location = useLocation();

  return (
    <Page title="Page Not Found" maxWidth="736px">
        Could not locate page for path "{location.pathname}".
    </Page>
  );
}
