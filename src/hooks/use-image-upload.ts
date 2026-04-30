import { useCallback, useEffect, useReducer, useRef } from "react";

interface UseImageUploadProps {
  onUpload?: (url: string) => void;
}

interface ImageUploadState {
  previewUrl: string | null;
  fileName: string | null;
  uploading: boolean;
  error: string | null;
}

type ImageUploadAction =
  | { type: "SET_PREVIEW"; payload: { url: string; name: string } }
  | { type: "SET_UPLOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_PREVIEW" };

const initialState: ImageUploadState = {
  previewUrl: null,
  fileName: null,
  uploading: false,
  error: null,
};

function imageUploadReducer(
  state: ImageUploadState,
  action: ImageUploadAction,
): ImageUploadState {
  switch (action.type) {
    case "SET_PREVIEW":
      return {
        ...state,
        previewUrl: action.payload.url,
        fileName: action.payload.name,
        error: null,
      };
    case "SET_UPLOADING":
      return { ...state, uploading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, uploading: false };
    case "CLEAR_PREVIEW":
      return { ...state, previewUrl: null, fileName: null, error: null };
    default:
      return state;
  }
}

class ImageUploadHandler {
  private onUpload?: (url: string) => void;
  private dispatch: React.Dispatch<ImageUploadAction>;
  private previewRef: React.MutableRefObject<string | null>;
  private fileInputRef: React.RefObject<HTMLInputElement | null>;

  constructor(
    dispatch: React.Dispatch<ImageUploadAction>,
    onUpload?: (url: string) => void,
    previewRef?: React.MutableRefObject<string | null>,
    fileInputRef?: React.RefObject<HTMLInputElement | null>,
  ) {
    this.dispatch = dispatch;
    this.onUpload = onUpload;
    this.previewRef = previewRef || { current: null };
    this.fileInputRef = fileInputRef || { current: null };
  }

  async simulateUpload(_file: File, localUrl: string): Promise<string> {
    try {
      this.dispatch({ type: "SET_UPLOADING", payload: true });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.dispatch({ type: "SET_ERROR", payload: null });
      return localUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      this.dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  }

  triggerFileInput(): void {
    this.fileInputRef.current?.click();
  }

  async handleFileSelect(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      this.previewRef.current = localUrl;
      this.dispatch({
        type: "SET_PREVIEW",
        payload: { url: localUrl, name: file.name },
      });

      try {
        const uploadedUrl = await this.simulateUpload(file, localUrl);
        this.onUpload?.(uploadedUrl);
      } catch (err) {
        URL.revokeObjectURL(localUrl);
        this.dispatch({ type: "CLEAR_PREVIEW" });
        console.error(err);
      }
    }
  }

  removeImage(): void {
    const currentUrl = this.previewRef.current;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    this.previewRef.current = null;
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = "";
    }
    this.dispatch({ type: "CLEAR_PREVIEW" });
  }

  cleanup(): void {
    if (this.previewRef.current) {
      URL.revokeObjectURL(this.previewRef.current);
    }
  }
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const [state, dispatch] = useReducer(imageUploadReducer, initialState);
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handler = useRef(
    new ImageUploadHandler(dispatch, onUpload, previewRef, fileInputRef),
  );

  useEffect(() => {
    handler.current = new ImageUploadHandler(
      dispatch,
      onUpload,
      previewRef,
      fileInputRef,
    );
  }, [onUpload]);

  useEffect(() => {
    return () => {
      handler.current.cleanup();
    };
  }, []);

  const handleThumbnailClick = useCallback(() => {
    handler.current.triggerFileInput();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      await handler.current.handleFileSelect(event);
    },
    [],
  );

  const handleRemove = useCallback(() => {
    handler.current.removeImage();
  }, []);

  return {
    previewUrl: state.previewUrl,
    fileName: state.fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    uploading: state.uploading,
    error: state.error,
  };
}
