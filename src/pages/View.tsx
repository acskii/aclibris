import { useLocation } from "react-router-dom";
import { PDFViewer } from "../components/pdf/PDFViewer";

export function View() {
    const location = useLocation();
    const { file } = location.state || {};

    return (
        <div>
            <PDFViewer file={file} page={10} />
        </div>
    );
}