"use client";

import { toast as sonnerToast } from "sonner";

type ToastProps = {
    title?: string;
    description?: string;
};

type ToastOptions = {  id?: string };

function toast({ title, description  }: ToastProps) {
    return sonnerToast(title ?? "Notification", { description });
}

function success(
    title: string,
    description?: string
) {
    return sonnerToast.success(title, {
        description
    });
}

function error( title: string, description?: string ) {
    return sonnerToast.error(title, { description });
}

function dismiss(id?: string) {
    return sonnerToast.dismiss(id);
}

function useToast() {
    return { toast, success, error, dismiss, toasts: [] }
}

export {
    useToast,
    toast,
    success,
    error,
    dismiss,
};

export type {
    ToastProps,
    ToastOptions,
};