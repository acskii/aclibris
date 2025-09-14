import { useLocation, useParams } from "react-router-dom";
import { PDFViewer } from "../components/pdf/PDFViewer";

export function View() {
    const location = useLocation();
    const params = useParams();
    const page = params.page ? parseInt(params.page) : 1;
    const { file } = location.state || {};

    return (
        <div>
            <PDFViewer file={file} page={page} />
        </div>
    );
}