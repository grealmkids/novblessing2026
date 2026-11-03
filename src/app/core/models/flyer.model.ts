export interface PhotoCropConfig {
  zoom: number;      // e.g. 1.0 = fit, up to 3.0
  offsetX: number;   // horizontal panning in px
  offsetY: number;   // vertical panning in px
}

export interface FlyerCoordinatesConfig {
  canvasWidth: number;
  canvasHeight: number;
  templateImagePath: string;
  portrait: {
    centerX: number;
    centerY: number;
    radius: number;
  };
  nameBanner: {
    x: number;
    y: number;
    width: number;
    height: number;
    backgroundColor: string;
    borderRadius: number;
  };
  typography: {
    fontFamily: string;
    fontWeight: string;
    initialFontSize: number;
    minFontSize: number;
    maxFontSize: number;
    textColor: string;
    textTransform: 'uppercase' | 'none';
    letterSpacing: number; // in pixels
  };
}

export interface FlyerState {
  selectedImage: File | null;
  imagePreviewUrl: string | null;
  memberName: string;
  cropConfig: PhotoCropConfig;
  isImageValid: boolean;
  isNameValid: boolean;
  isGenerating: boolean;
  generatedImageBlob: Blob | null;
  generatedImageUrl: string | null;
  generatedFileName: string;
  generationError: string | null;
}

