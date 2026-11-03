import { FlyerCoordinatesConfig, PhotoCropConfig } from '../models/flyer.model';

export const DEFAULT_CROP_CONFIG: PhotoCropConfig = {
  zoom: 1.0,
  offsetX: 0,
  offsetY: 0
};

export const FLYER_CONFIG: FlyerCoordinatesConfig = {
  canvasWidth: 1280,
  canvasHeight: 1280,
  templateImagePath: 'images/november-blessing-template.jpg',
  portrait: {
    centerX: 344,
    centerY: 498,
    radius: 231
  },
  nameBanner: {
    x: 131,
    y: 790,
    width: 425,
    height: 84,
    backgroundColor: '#E3A72B',
    borderRadius: 12
  },
  typography: {
    fontFamily: "'Montserrat', 'Arial Black', Arial, sans-serif",
    fontWeight: '800',
    initialFontSize: 38,
    minFontSize: 18,
    maxFontSize: 42,
    textColor: '#321447',
    textTransform: 'uppercase',
    letterSpacing: 2
  }
};

export const UPLOAD_CONSTRAINTS = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
};

export const CONFERENCE_INFO = {
  name: 'November Blessing Conference 2026',
  ministry: "Christ's Heart Ministries",
  theme: 'Powered Witness',
  scripture: 'Acts 1:8',
  website: 'https://novemberblessingweek.com',
  websiteLabel: 'novemberblessingweek.com',
  hashtags: ['#PoweredWitness', '#NBC2026'],
  schedules: [
    { dates: '9-11 NOV', venue: 'MTN Arena Lugogo', time: '5PM' },
    { dates: '12-13 NOV', venue: "Christ's Heart Buloba", time: '5PM' },
    { dates: '14-15 NOV', venue: "Christ's Heart Mukono HQ", time: '9AM' }
  ]
};

