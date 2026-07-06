/*
    Notification component to notify user for successful operation
*/

import { CircleCheckBig } from "lucide-react";

interface SuccessToastProps {
    message: string;
}

export default function SuccessToast({ message }: SuccessToastProps) {
    return (
        <div
            className="bg-emerald-400 z-50 rounded-md border border-3 border-green-800"
            role="alert"
            aria-labelledby="toast-success"
        >
            <div className="flex p-4 gap-4 items-center">
                <div className="text-green-600">
                    <CircleCheckBig size={30} />
                </div>
                <p className="text-md text-white font-bold ">{message}</p>
            </div>
        </div>
    );
}
