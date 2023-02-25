import { useRouteError } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="m-5">
        
      <Alert className="p-5" variant="danger">
        <Alert.Heading>Ocurrio un Error Inesperado</Alert.Heading>
        <p>{error.statusText || error.message}</p>
      </Alert>
    </div>
  );
}
